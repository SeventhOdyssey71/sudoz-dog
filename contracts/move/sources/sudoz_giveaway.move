module sudoz::giveaway {
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

    // Error codes
    const E_NOT_SUDOZ_HOLDER: u64 = 0;
    const E_ALREADY_ENTERED: u64 = 1;
    const E_GIVEAWAY_NOT_ACTIVE: u64 = 2;
    const E_GIVEAWAY_NOT_ENDED: u64 = 3;
    const E_NOT_ADMIN: u64 = 4;
    const E_INVALID_DURATION: u64 = 5;
    const E_NO_PARTICIPANTS: u64 = 6;
    const E_INVALID_NFT_TYPE: u64 = 7;

    // Struct to represent a SUDOZ NFT (simplified)
    struct SUDOZNFT has key, store {
        id: UID,
        name: String,
        level: u8,
        evolved: bool,
    }

    // Giveaway struct
    struct Giveaway has key, store {
        id: UID,
        title: String,
        description: String,
        admin: address,
        prize_pool: Balance<SUI>,
        participants: vector<address>,
        participant_entries: Table<address, bool>,
        start_time: u64,
        end_time: u64,
        active: bool,
        winner: Option<address>,
        total_entries: u64,
    }

    // Admin capability
    struct GiveawayAdminCap has key, store {
        id: UID,
    }

    // Events
    struct GiveawayCreated has copy, drop {
        giveaway_id: ID,
        title: String,
        prize_amount: u64,
        start_time: u64,
        end_time: u64,
    }

    struct GiveawayEntered has copy, drop {
        giveaway_id: ID,
        participant: address,
        entry_number: u64,
    }

    struct GiveawayEnded has copy, drop {
        giveaway_id: ID,
        winner: address,
        prize_amount: u64,
    }

    // Initialize the module
    fun init(ctx: &mut TxContext) {
        transfer::transfer(
            GiveawayAdminCap { id: object::new(ctx) },
            tx_context::sender(ctx)
        );
    }

    // Create a new giveaway (admin only)
    public entry fun create_giveaway(
        _admin_cap: &GiveawayAdminCap,
        title: vector<u8>,
        description: vector<u8>,
        prize: Coin<SUI>,
        duration_ms: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(duration_ms > 0, E_INVALID_DURATION);

        let current_time = clock::timestamp_ms(clock);
        let giveaway_id = object::new(ctx);
        let giveaway_id_copy = object::uid_to_inner(&giveaway_id);
        
        let giveaway = Giveaway {
            id: giveaway_id,
            title: string::utf8(title),
            description: string::utf8(description),
            admin: tx_context::sender(ctx),
            prize_pool: coin::into_balance(prize),
            participants: vector::empty(),
            participant_entries: table::new(ctx),
            start_time: current_time,
            end_time: current_time + duration_ms,
            active: true,
            winner: option::none(),
            total_entries: 0,
        };

        event::emit(GiveawayCreated {
            giveaway_id: giveaway_id_copy,
            title: string::utf8(title),
            prize_amount: balance::value(&giveaway.prize_pool),
            start_time: current_time,
            end_time: current_time + duration_ms,
        });

        transfer::share_object(giveaway);
    }

    // Enter giveaway (must hold SUDOZ NFT)
    public entry fun enter_giveaway(
        giveaway: &mut Giveaway,
        nft: &SUDOZNFT,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let current_time = clock::timestamp_ms(clock);

        // Check if giveaway is active
        assert!(giveaway.active, E_GIVEAWAY_NOT_ACTIVE);
        assert!(current_time < giveaway.end_time, E_GIVEAWAY_NOT_ACTIVE);

        // Check if user hasn't already entered
        assert!(!table::contains(&giveaway.participant_entries, sender), E_ALREADY_ENTERED);

        // Verify NFT ownership (the fact that they can reference it proves ownership)
        // Add extra entries for evolved SUDOZ or high-level artifacts
        let entries = if (nft.evolved) { 3 } else if (nft.level >= 8) { 2 } else { 1 };

        // Add participant
        let i = 0;
        while (i < entries) {
            vector::push_back(&mut giveaway.participants, sender);
            i = i + 1;
        };

        table::add(&mut giveaway.participant_entries, sender, true);
        giveaway.total_entries = giveaway.total_entries + entries;

        event::emit(GiveawayEntered {
            giveaway_id: object::uid_to_inner(&giveaway.id),
            participant: sender,
            entry_number: giveaway.total_entries,
        });
    }

    // End giveaway and select winner
    public entry fun end_giveaway(
        giveaway: &mut Giveaway,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let current_time = clock::timestamp_ms(clock);
        
        // Check if giveaway has ended
        assert!(current_time >= giveaway.end_time, E_GIVEAWAY_NOT_ENDED);
        assert!(giveaway.active, E_GIVEAWAY_NOT_ACTIVE);
        
        let participant_count = vector::length(&giveaway.participants);
        assert!(participant_count > 0, E_NO_PARTICIPANTS);

        // Generate pseudo-random winner index
        let winner_index = generate_random_index(participant_count, current_time, ctx);
        let winner_address = *vector::borrow(&giveaway.participants, winner_index);

        // Transfer prize to winner
        let prize_amount = balance::value(&giveaway.prize_pool);
        let prize_coin = coin::from_balance(balance::withdraw_all(&mut giveaway.prize_pool), ctx);
        transfer::public_transfer(prize_coin, winner_address);

        // Update giveaway state
        giveaway.active = false;
        giveaway.winner = option::some(winner_address);

        event::emit(GiveawayEnded {
            giveaway_id: object::uid_to_inner(&giveaway.id),
            winner: winner_address,
            prize_amount,
        });
    }

    // Cancel giveaway (admin only, returns funds)
    public entry fun cancel_giveaway(
        _admin_cap: &GiveawayAdminCap,
        giveaway: &mut Giveaway,
        ctx: &mut TxContext
    ) {
        assert!(giveaway.active, E_GIVEAWAY_NOT_ACTIVE);
        assert!(tx_context::sender(ctx) == giveaway.admin, E_NOT_ADMIN);

        // Return prize pool to admin
        let prize_coin = coin::from_balance(balance::withdraw_all(&mut giveaway.prize_pool), ctx);
        transfer::public_transfer(prize_coin, giveaway.admin);

        giveaway.active = false;
    }

    // Helper function to generate pseudo-random index
    fun generate_random_index(max: u64, timestamp: u64, ctx: &mut TxContext): u64 {
        let sender_bytes = sui::address::to_bytes(tx_context::sender(ctx));
        let timestamp_bytes = sui::bcs::to_bytes(&timestamp);
        
        let mut combined = vector::empty<u8>();
        vector::append(&mut combined, sender_bytes);
        vector::append(&mut combined, timestamp_bytes);
        
        let hash = sui::hash::keccak256(&combined);
        let random_value = 0u64;
        let i = 0;
        
        while (i < 8) {
            let byte = *vector::borrow(&hash, i);
            random_value = (random_value << 8) | (byte as u64);
            i = i + 1;
        };
        
        random_value % max
    }

    // View functions
    public fun get_participant_count(giveaway: &Giveaway): u64 {
        giveaway.total_entries
    }

    public fun is_participant(giveaway: &Giveaway, user: address): bool {
        table::contains(&giveaway.participant_entries, user)
    }

    public fun get_prize_amount(giveaway: &Giveaway): u64 {
        balance::value(&giveaway.prize_pool)
    }
}