window.ARCLUME_CONNECTED_MODE = {
  enabled: false,
  authEndpoint: '',
  profileEndpoint: '',
  notes: 'Static mode only. Configure this when you have a supported Arc House auth connector.'
};


window.ARCLUME_CIRCLE_BACKEND = {
  enabled: false,
  baseUrl: '',
  arcscanBaseUrl: 'https://testnet.arcscan.app',
  tokenAddress: '0x3600000000000000000000000000000000000000',
  blockchain: 'ARC-TESTNET',
  notes: 'Deploy a separate backend or worker for Circle API calls. Never place Circle secrets in this static site.'
};
