window.ARCLUME_CONNECTED_MODE = {
  enabled: true,
  authEndpoint: 'https://your-worker.example.com/auth/start',
  profileEndpoint: 'https://your-worker.example.com/profile',
  notes: 'Example only. Use a supported Arc House integration when available.'
};


window.ARCLUME_CIRCLE_BACKEND = {
  enabled: false,
  baseUrl: '',
  arcscanBaseUrl: 'https://testnet.arcscan.app',
  tokenAddress: '0x3600000000000000000000000000000000000000',
  blockchain: 'ARC-TESTNET',
  notes: 'Deploy a separate backend or worker for Circle API calls. Never place Circle secrets in this static site.'
};
