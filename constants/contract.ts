export const CONTRACT_CONSTANTS = {
  PACKAGE_ID: '0x28a337bfbdc3553483735824d14e2627f31b73c68662d9242f43b126fa61aa1e',
  ADMIN_CAP_ID: '0x4dc09e244c77f4c86f5d7fa54ac0d45a1f67bb8e6ce0e4651e6c941d525e572b',
  GLOBAL_STATS_ID: '0x57ade2aa864775e50c944b48cd9116812a4cbc20ff3d2ac3b7dc5b763640aa28',
  RANDOM_OBJECT_ID: '0x8',
  MODULE_NAME: 'sudoz_artifacts',
  
  // Function names
  FUNCTIONS: {
    MINT_ARTIFACT: 'mint_artifact',
    UPGRADE_LEVEL: 'upgrade_level',
    UPGRADE_TO_LEVEL: 'upgrade_to_level',
    UPGRADE_TO_LEVEL_10: 'upgrade_to_level_10',
    EVOLVE_ARTIFACT: 'evolve_artifact',
    GET_LEVEL: 'get_level',
    GET_POINTS: 'get_points',
    GET_NAME: 'get_name',
    GET_PATH: 'get_path',
  },
  
  // Type names
  TYPES: {
    SUDOZ_ARTIFACT: '',
    EVOLVED_SUDOZ: '',
  },
  
  // Constants
  UPGRADE_COST_PER_LEVEL: 1_000_000_000, // 1 SUI in MIST
  MAX_LEVEL: 10,
  ARTIFACT_SUPPLY: 13600,
  EVOLVED_SUPPLY: 5555,
  
  // Path names
  PATHS: [
    'SUDO-A5 Frostbark',
    'SUDO-E8 Toxinpup',
    'SUDO-N0 Cryoblink',
    'SUDO-V9 Emberfang',
    'SUDO-X7 Glitchtail',
    'SUDO-Z1 Aurapup',
    'SUDO-Z3 Voidpaw',
  ],
};

// Fix the TYPES object
CONTRACT_CONSTANTS.TYPES = {
  SUDOZ_ARTIFACT: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::SudozArtifact`,
  EVOLVED_SUDOZ: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::EvolvedSudoz`,
};