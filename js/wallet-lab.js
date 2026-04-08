const walletLabConfig = window.ARCLUME_CIRCLE_BACKEND || {
  enabled: false,
  baseUrl: '',
  arcscanBaseUrl: 'https://testnet.arcscan.app',
  tokenAddress: '0x3600000000000000000000000000000000000000',
  blockchain: 'ARC-TESTNET',
};

const labEls = {
  backendState: document.getElementById('backendState'),
  walletSetId: document.getElementById('walletSetId'),
  walletAId: document.getElementById('walletAId'),
  walletAAddress: document.getElementById('walletAAddress'),
  walletBId: document.getElementById('walletBId'),
  walletBAddress: document.getElementById('walletBAddress'),
  walletABefore: document.getElementById('walletABefore'),
  walletAAfter: document.getElementById('walletAAfter'),
  walletBBefore: document.getElementById('walletBBefore'),
  walletBAfter: document.getElementById('walletBAfter'),
  txHash: document.getElementById('txHash'),
  txState: document.getElementById('txState'),
  txLink: document.getElementById('txLink'),
  amountInput: document.getElementById('transferAmount'),
  note: document.getElementById('labNote'),
  createSetBtn: document.getElementById('createWalletSetBtn'),
  createWalletsBtn: document.getElementById('createWalletsBtn'),
  loadBalancesBtn: document.getElementById('loadBalancesBtn'),
  transferBtn: document.getElementById('transferBtn'),
  copyFaucetWalletBtn: document.getElementById('copyFaucetWalletBtn'),
};

const labState = {
  walletSetId: '',
  walletAId: '',
  walletAAddress: '',
  walletBId: '',
  walletBAddress: '',
  balances: {
    beforeA: '--',
    afterA: '--',
    beforeB: '--',
    afterB: '--',
  },
  txHash: '',
  txState: 'Not started',
};

function saveLabState() {
  localStorage.setItem('arclume_wallet_lab_v1', JSON.stringify(labState));
}

function loadLabState() {
  try {
    const raw = localStorage.getItem('arclume_wallet_lab_v1');
    if (!raw) return;
    const parsed = JSON.parse(raw);
    Object.assign(labState, parsed);
  } catch {}
}

function renderLabState() {
  labEls.backendState.textContent = walletLabConfig.enabled && walletLabConfig.baseUrl
    ? `Live backend configured at ${walletLabConfig.baseUrl}`
    : 'Static frontend ready. Connect a separate backend to make wallet creation and transfer live.';
  labEls.walletSetId.textContent = labState.walletSetId || '--';
  labEls.walletAId.textContent = labState.walletAId || '--';
  labEls.walletAAddress.textContent = labState.walletAAddress || '--';
  labEls.walletBId.textContent = labState.walletBId || '--';
  labEls.walletBAddress.textContent = labState.walletBAddress || '--';
  labEls.walletABefore.textContent = labState.balances.beforeA || '--';
  labEls.walletAAfter.textContent = labState.balances.afterA || '--';
  labEls.walletBBefore.textContent = labState.balances.beforeB || '--';
  labEls.walletBAfter.textContent = labState.balances.afterB || '--';
  labEls.txHash.textContent = labState.txHash || '--';
  labEls.txState.textContent = labState.txState || 'Not started';
  if (labState.txHash) {
    labEls.txLink.href = `${walletLabConfig.arcscanBaseUrl}/tx/${labState.txHash}`;
    labEls.txLink.classList.remove('disabled-link');
  } else {
    labEls.txLink.href = '#';
    labEls.txLink.classList.add('disabled-link');
  }
}

function setLabNote(message, tone = 'default') {
  labEls.note.className = `wallet-lab-note ${tone}`;
  labEls.note.textContent = message;
}

async function copyText(value, successMessage) {
  if (!value || value === '--') {
    setLabNote('There is nothing to copy yet.', 'warning');
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    setLabNote(successMessage, 'success');
  } catch {
    window.prompt('Copy this value:', value);
  }
}

async function requestJson(path, options = {}) {
  if (!walletLabConfig.enabled || !walletLabConfig.baseUrl) {
    throw new Error('Wallet Lab backend is not configured yet. Add a backend base URL in runtime-config.js first.');
  }

  const response = await fetch(`${walletLabConfig.baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.ok === false) {
    throw new Error(json.message || 'Backend request failed.');
  }
  return json;
}

async function createWalletSet() {
  try {
    setLabNote('Creating Circle wallet set on Arc Testnet...', 'info');
    const json = await requestJson('/wallet-set', { method: 'POST' });
    labState.walletSetId = json.walletSetId || json.data?.walletSetId || '';
    saveLabState();
    renderLabState();
    setLabNote('Wallet set created successfully.', 'success');
  } catch (error) {
    setLabNote(error instanceof Error ? error.message : 'Wallet set could not be created.', 'warning');
  }
}

async function createWallets() {
  if (!labState.walletSetId) {
    setLabNote('Create a wallet set first.', 'warning');
    return;
  }

  try {
    setLabNote('Creating wallet A and wallet B on ARC-TESTNET...', 'info');
    const json = await requestJson('/wallets/create', {
      method: 'POST',
      body: JSON.stringify({
        walletSetId: labState.walletSetId,
        blockchain: walletLabConfig.blockchain,
      }),
    });

    labState.walletAId = json.walletAId || json.walletA?.id || '';
    labState.walletAAddress = json.walletAAddress || json.walletA?.address || '';
    labState.walletBId = json.walletBId || json.walletB?.id || '';
    labState.walletBAddress = json.walletBAddress || json.walletB?.address || '';
    saveLabState();
    renderLabState();
    setLabNote('Wallet A and wallet B created successfully.', 'success');
  } catch (error) {
    setLabNote(error instanceof Error ? error.message : 'Wallets could not be created.', 'warning');
  }
}

async function loadBalances() {
  if (!labState.walletAId || !labState.walletBAddress) {
    setLabNote('Create wallets first so ArcLume knows which balances to load.', 'warning');
    return;
  }

  try {
    setLabNote('Loading balances before and after transfer...', 'info');
    const params = new URLSearchParams({
      walletAId: labState.walletAId,
      walletBAddress: labState.walletBAddress,
      blockchain: walletLabConfig.blockchain,
      tokenAddress: walletLabConfig.tokenAddress,
    });

    const json = await requestJson(`/wallets/balances?${params.toString()}`, { method: 'GET' });

    labState.balances.beforeA = json.walletABefore || json.balances?.walletABefore || '--';
    labState.balances.afterA = json.walletAAfter || json.balances?.walletAAfter || labState.balances.beforeA;
    labState.balances.beforeB = json.walletBBefore || json.balances?.walletBBefore || '--';
    labState.balances.afterB = json.walletBAfter || json.balances?.walletBAfter || labState.balances.beforeB;
    saveLabState();
    renderLabState();
    setLabNote('Balances loaded successfully.', 'success');
  } catch (error) {
    setLabNote(error instanceof Error ? error.message : 'Balances could not be loaded.', 'warning');
  }
}

async function transferUsdc() {
  if (!labState.walletAId || !labState.walletBAddress) {
    setLabNote('Create wallets first before starting a transfer.', 'warning');
    return;
  }

  const amount = labEls.amountInput.value.trim() || '1';

  try {
    setLabNote(`Transferring ${amount} test USDC on Arc Testnet...`, 'info');

    const before = await requestJson(`/wallets/balances?${new URLSearchParams({
      walletAId: labState.walletAId,
      walletBAddress: labState.walletBAddress,
      blockchain: walletLabConfig.blockchain,
      tokenAddress: walletLabConfig.tokenAddress,
    }).toString()}`, { method: 'GET' });

    labState.balances.beforeA = before.walletABefore || before.balances?.walletABefore || '--';
    labState.balances.beforeB = before.walletBBefore || before.balances?.walletBBefore || '--';

    const json = await requestJson('/transfer', {
      method: 'POST',
      body: JSON.stringify({
        walletAId: labState.walletAId,
        walletBAddress: labState.walletBAddress,
        amount,
        blockchain: walletLabConfig.blockchain,
        tokenAddress: walletLabConfig.tokenAddress,
      }),
    });

    labState.txHash = json.txHash || json.transactionHash || json.data?.txHash || '';
    labState.txState = json.state || json.txState || 'Submitted';

    const after = await requestJson(`/wallets/balances?${new URLSearchParams({
      walletAId: labState.walletAId,
      walletBAddress: labState.walletBAddress,
      blockchain: walletLabConfig.blockchain,
      tokenAddress: walletLabConfig.tokenAddress,
    }).toString()}`, { method: 'GET' });

    labState.balances.afterA = after.walletAAfter || after.balances?.walletAAfter || labState.balances.beforeA;
    labState.balances.afterB = after.walletBAfter || after.balances?.walletBAfter || labState.balances.beforeB;

    saveLabState();
    renderLabState();
    setLabNote('Transfer submitted successfully. Open Arcscan to verify the transaction.', 'success');
  } catch (error) {
    setLabNote(error instanceof Error ? error.message : 'Transfer could not be submitted.', 'warning');
  }
}

function bindEvents() {
  labEls.createSetBtn?.addEventListener('click', createWalletSet);
  labEls.createWalletsBtn?.addEventListener('click', createWallets);
  labEls.loadBalancesBtn?.addEventListener('click', loadBalances);
  labEls.transferBtn?.addEventListener('click', transferUsdc);
  labEls.copyFaucetWalletBtn?.addEventListener('click', () => copyText(labState.walletAId || labState.walletAAddress, 'Wallet A copied for Circle faucet use.'));
}

loadLabState();
renderLabState();
bindEvents();
