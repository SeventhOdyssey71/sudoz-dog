module sudoz::sacrifice {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::clock::{Self, Clock};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use sui::table::{Self, Table};
    use sui::balance::{Self, Balance};
    use std::string::{Self, String};
    use std::vector;
    use sui::math;

    // Constants
    const ARTIFACTS_REQUIRED_FOR_SPOT: u64 = 10;
    const BURN_REWARD_PER_ARTIFACT: u64 = 100_000_000; // 0.1 SUI per artifact
    const BONUS_REWARD_FOR_FULL_SET: u64 = 500_000_000; // 0.5 SUI bonus for burning 10

    // Error codes
    const E_INSUFFICIENT_ARTIFACTS: u64 = 0;
    const E_NOT_ARTIFACT_OWNER: u64 = 1;
    const E_INVALID_ARTIFACT: u64 = 2;
    const E_SACRIFICE_POOL_EMPTY: u64 = 3;
    const E_NOT_ADMIN: u64 = 4;
    const E_SPOT_ALREADY_CLAIMED: u64 = 5;
    const E_NO_SPOT_TO_CLAIM: u64 = 6;
    const E_DUPLICATE_ARTIFACT: u64 = 7;

    // Struct to represent an Artifact NFT
    struct ArtifactNFT has key, store {
        id: UID,
        name: String,
        level: u8,
        dna: String,
    }

    // SUDOZ Spot - earned by burning 10 artifacts
    struct SUDOZSpot has key, store {
        id: UID,
        owner: address,
        artifacts_burned: u64,
        earned_timestamp: u64,
        claimed: bool,
    }

    // Sacrifice Pool - holds rewards for burning
    struct SacrificePool has key {
        id: UID,
        admin: address,
        reward_pool: Balance<SUI>,
        total_artifacts_burned: u64,
        total_spots_created: u64,
        total_rewards_distributed: u64,
        user_spots: Table<address, vector<ID>>,
    }

    // Admin capability
    struct SacrificeAdminCap has key, store {
        id: UID,
    }

    // Events
    struct ArtifactsBurned has copy, drop {
        burner: address,
        artifacts_count: u64,
        reward_amount: u64,
        spot_earned: bool,
        timestamp: u64,
    }

    struct SUDOZSpotEarned has copy, drop {
        owner: address,
        spot_id: ID,
        artifacts_burned: u64,
        timestamp: u64,
    }

    struct SUDOZSpotClaimed has copy, drop {
        owner: address,
        spot_id: ID,
        timestamp: u64,
    }

    struct RewardsDeposited has copy, drop {
        amount: u64,
        depositor: address,
    }

    // Initialize the module
    fun init(ctx: &mut TxContext) {
        let admin = tx_context::sender(ctx);
        
        // Create admin capability
        transfer::transfer(
            SacrificeAdminCap { id: object::new(ctx) },
            admin
        );

        // Create sacrifice pool
        transfer::share_object(SacrificePool {
            id: object::new(ctx),
            admin,
            reward_pool: balance::zero(),
            total_artifacts_burned: 0,
            total_spots_created: 0,
            total_rewards_distributed: 0,
            user_spots: table::new(ctx),
        });
    }

    // Burn artifacts for rewards and potentially earn a SUDOZ spot
    public entry fun burn_artifacts(
        pool: &mut SacrificePool,
        artifacts: vector<ArtifactNFT>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let artifact_count = vector::length(&artifacts);
        assert!(artifact_count > 0, E_INSUFFICIENT_ARTIFACTS);

        // Calculate rewards
        let base_reward = artifact_count * BURN_REWARD_PER_ARTIFACT;
        let bonus_reward = if (artifact_count == ARTIFACTS_REQUIRED_FOR_SPOT) {
            BONUS_REWARD_FOR_FULL_SET
        } else {
            0
        };
        let total_reward = base_reward + bonus_reward;

        // Check if pool has enough rewards
        assert!(balance::value(&pool.reward_pool) >= total_reward, E_SACRIFICE_POOL_EMPTY);

        // Burn all artifacts
        let i = 0;
        while (i < artifact_count) {
            let artifact = vector::pop_back(&mut artifacts);
            // Verify level to ensure it's not an evolved SUDOZ (level 10+)
            assert!(artifact.level < 10, E_INVALID_ARTIFACT);
            burn_artifact(artifact);
            i = i + 1;
        };
        vector::destroy_empty(artifacts);

        // Update pool stats
        pool.total_artifacts_burned = pool.total_artifacts_burned + artifact_count;
        pool.total_rewards_distributed = pool.total_rewards_distributed + total_reward;

        // Send rewards
        let reward_coin = coin::from_balance(
            balance::split(&mut pool.reward_pool, total_reward),
            ctx
        );
        transfer::public_transfer(reward_coin, sender);

        // If burned exactly 10 artifacts, create a SUDOZ spot
        let spot_earned = artifact_count == ARTIFACTS_REQUIRED_FOR_SPOT;
        if (spot_earned) {
            let spot = SUDOZSpot {
                id: object::new(ctx),
                owner: sender,
                artifacts_burned: artifact_count,
                earned_timestamp: clock::timestamp_ms(clock),
                claimed: false,
            };

            let spot_id = object::uid_to_inner(&spot.id);
            
            // Add spot to user's collection
            if (!table::contains(&pool.user_spots, sender)) {
                table::add(&mut pool.user_spots, sender, vector::empty());
            };
            let user_spots = table::borrow_mut(&mut pool.user_spots, sender);
            vector::push_back(user_spots, spot_id);

            pool.total_spots_created = pool.total_spots_created + 1;

            event::emit(SUDOZSpotEarned {
                owner: sender,
                spot_id,
                artifacts_burned: artifact_count,
                timestamp: clock::timestamp_ms(clock),
            });

            // Transfer spot to user
            transfer::transfer(spot, sender);
        };

        event::emit(ArtifactsBurned {
            burner: sender,
            artifacts_count: artifact_count,
            reward_amount: total_reward,
            spot_earned,
            timestamp: clock::timestamp_ms(clock),
        });
    }

    // Burn a single artifact for a smaller reward
    public entry fun burn_single_artifact(
        pool: &mut SacrificePool,
        artifact: ArtifactNFT,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let mut artifacts = vector::empty();
        vector::push_back(&mut artifacts, artifact);
        burn_artifacts(pool, artifacts, clock, ctx);
    }

    // Admin function to deposit rewards into the pool
    public entry fun deposit_rewards(
        _admin_cap: &SacrificeAdminCap,
        pool: &mut SacrificePool,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&payment);
        balance::join(&mut pool.reward_pool, coin::into_balance(payment));

        event::emit(RewardsDeposited {
            amount,
            depositor: tx_context::sender(ctx),
        });
    }

    // Claim a SUDOZ NFT using a spot (to be implemented when SUDOZ minting is ready)
    public entry fun claim_sudoz_with_spot(
        spot: &mut SUDOZSpot,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(!spot.claimed, E_SPOT_ALREADY_CLAIMED);
        assert!(spot.owner == tx_context::sender(ctx), E_NO_SPOT_TO_CLAIM);

        // Mark as claimed
        spot.claimed = true;

        event::emit(SUDOZSpotClaimed {
            owner: spot.owner,
            spot_id: object::uid_to_inner(&spot.id),
            timestamp: clock::timestamp_ms(clock),
        });

        // TODO: Mint and transfer SUDOZ NFT to the user
        // This would be implemented when SUDOZ minting contract is ready
    }

    // Internal function to burn an artifact
    fun burn_artifact(artifact: ArtifactNFT) {
        let ArtifactNFT { id, name: _, level: _, dna: _ } = artifact;
        object::delete(id);
    }

    // View functions
    public fun get_pool_balance(pool: &SacrificePool): u64 {
        balance::value(&pool.reward_pool)
    }

    public fun get_total_burned(pool: &SacrificePool): u64 {
        pool.total_artifacts_burned
    }

    public fun get_total_spots_created(pool: &SacrificePool): u64 {
        pool.total_spots_created
    }

    public fun get_user_spots_count(pool: &SacrificePool, user: address): u64 {
        if (table::contains(&pool.user_spots, user)) {
            vector::length(table::borrow(&pool.user_spots, user))
        } else {
            0
        }
    }

    public fun is_spot_claimed(spot: &SUDOZSpot): bool {
        spot.claimed
    }

    // Calculate reward for a given number of artifacts
    public fun calculate_burn_reward(artifact_count: u64): u64 {
        let base_reward = artifact_count * BURN_REWARD_PER_ARTIFACT;
        let bonus = if (artifact_count == ARTIFACTS_REQUIRED_FOR_SPOT) {
            BONUS_REWARD_FOR_FULL_SET
        } else {
            0
        };
        base_reward + bonus
    }
}