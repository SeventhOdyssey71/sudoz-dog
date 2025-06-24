# SUDOZ Vault Smart Contracts

This directory contains the Move smart contracts for the SUDOZ Vault system, including giveaways and the sacrifice mechanism.

## Contracts

### 1. SUDOZ Giveaway (`sudoz_giveaway.move`)

A giveaway system exclusively for SUDOZ NFT holders.

**Features:**
- Only SUDOZ NFT holders can participate
- Admin creates giveaways with SUI prizes
- Evolved SUDOZ holders get 3x entries
- High-level artifacts (8+) get 2x entries
- Random winner selection based on timestamp and participant data
- Automatic prize distribution

**Key Functions:**
- `create_giveaway`: Admin creates a new giveaway with prize pool
- `enter_giveaway`: SUDOZ holders enter by proving NFT ownership
- `end_giveaway`: Ends giveaway and selects winner
- `cancel_giveaway`: Admin can cancel and reclaim funds

### 2. SUDOZ Sacrifice (`sudoz_sacrifice.move`)

A burn-to-earn system where artifact holders can burn NFTs for rewards.

**Features:**
- Burn artifacts for SUI rewards (0.1 SUI per artifact)
- Burn exactly 10 artifacts to earn a SUDOZ spot
- Bonus reward (0.5 SUI) for burning a full set of 10
- SUDOZ spots can be claimed later for actual SUDOZ NFTs
- Tracks user spots and burn history

**Key Functions:**
- `burn_artifacts`: Burn multiple artifacts for rewards
- `burn_single_artifact`: Burn one artifact
- `deposit_rewards`: Admin deposits SUI into reward pool
- `claim_sudoz_with_spot`: Claim SUDOZ NFT with earned spot (TODO: integrate with minting)

## Deployment

1. Install Sui CLI:
```bash
cargo install --git https://github.com/MystenLabs/sui.git sui
```

2. Build the contracts:
```bash
cd contracts/move
sui move build
```

3. Deploy to testnet:
```bash
sui client publish --gas-budget 100000000
```

4. Save the package ID and update it in your frontend configuration.

## Integration

After deployment, update the following in your frontend:

1. Add package ID to `constants/contract.ts`
2. Update transaction builders in `contracts/sui.ts`
3. Add the new contract functions to handle giveaways and sacrifice

## Security Considerations

- Only verified SUDOZ NFT holders can enter giveaways
- Artifacts are permanently burned and cannot be recovered
- Admin capabilities are required for certain functions
- Reward pool must be funded before burns can occur
- Random winner selection uses on-chain data (not truly random, but fair)

## Testing

Test on Sui testnet first:

1. Deploy contracts
2. Mint test NFTs
3. Fund sacrifice pool with test SUI
4. Test giveaway creation and participation
5. Test artifact burning and spot earning

## Future Enhancements

- Integration with SUDOZ minting contract for spot redemption
- True randomness using Sui's VRF when available
- Multiple prize tiers in giveaways
- Burn events with time limits
- Leaderboards for top burners