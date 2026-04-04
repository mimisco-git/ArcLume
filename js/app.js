import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@6.13.5/+esm';

const CONFIG = {
  appName: 'ArcLume',
  networkName: 'Arc Testnet',
  chainId: 5042002,
  rpcUrl: 'https://rpc.testnet.arc.network',
  explorerUrl: 'https://testnet.arcscan.app',
  explorerApi: 'https://testnet.arcscan.app/api',
  communityUrl: 'https://community.arc.network/home',
  sampleAddress: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
  storageKey: 'arclume-v4-profile',
  paletteKey: 'arclume-v4-palette'
};

const COMMUNITY_DATA = {
  feed: [
    {
      type: 'Event',
      title: 'ETHGlobal Cannes Hackathon',
      icon: '⬡',
      badge: 'Hackathon',
      meta: 'Apr 3 to Apr 5, 2026',
      description: 'Arc House is publicly listing ETHGlobal Cannes Hackathon on the active event slate.',
      url: 'https://community.arc.network/home/events/ethglobal-pragma-l7dy3xfft9'
    },
    {
      type: 'Event',
      title: 'Arc Discord Office Hours',
      icon: '◎',
      badge: 'Community',
      meta: 'Apr 7, 2026 · 5:00 PM GMT',
      description: 'Office hours for ecosystem discussion and builder support are currently listed on Arc House.',
      url: 'https://community.arc.network/home'
    },
    {
      type: 'Event',
      title: 'Arc Discord Office Hours',
      icon: '◌',
      badge: 'Community',
      meta: 'Apr 14, 2026 · 5:00 PM GMT',
      description: 'Second office hours session currently visible on Arc House.',
      url: 'https://community.arc.network/home'
    },
    {
      type: 'Event',
      title: 'Building Agentic Commerce on Arc: VibeCard',
      icon: '✦',
      badge: 'Builder spotlight',
      meta: 'Apr 15, 2026 · 5:00 PM GMT',
      description: 'Upcoming session focused on agentic commerce building on Arc.',
      url: 'https://community.arc.network/home'
    },
    {
      type: 'Event',
      title: 'Agentic Economy on Arc Hackathon',
      icon: '⚡',
      badge: 'Prize pool',
      meta: 'Apr 20 to Apr 26, 2026 · $10,000 prize pool',
      description: 'Hybrid Arc hackathon focused on agentic economic apps using USDC nanopayments and Arc settlement.',
      url: 'https://community.arc.network/home/events/agentic-economy-on-arc-hackathon-xoayqenc6j'
    },
    {
      type: 'Content',
      title: 'Tradable joins the Arc Builders Fund',
      icon: '▣',
      badge: 'Latest',
      meta: 'Blog · Apr 2, 2026',
      description: 'Featured Arc House post on Tradable expanding institutional-grade private credit onchain with Arc Testnet deployment.',
      url: 'https://community.arc.network/'
    },
    {
      type: 'Content',
      title: 'Event Replay: Building an Agentic Economy on Arc with RSoft Agentic Bank',
      icon: '▶',
      badge: 'Replay',
      meta: 'Video · Apr 2, 2026',
      description: 'Replay centered on identity signals, scoring, treasury management, and atomic settlement for agents.',
      url: 'https://community.arc.network/'
    },
    {
      type: 'Content',
      title: 'Introducing Arc House and the Architects Program',
      icon: '✧',
      badge: 'Launch',
      meta: 'External content · Mar 31, 2026',
      description: 'Launch content for Arc House and the Architects program.',
      url: 'https://community.arc.network/home/events/introducing-arc-house-and-architects-hyp33duk9f?autoRsvp=true'
    }
  ],
  resources: [
    {
      title: 'Architects: Program Overview',
      icon: '◎',
      description: 'Public overview of Arc’s ambassador-style Architects program.',
      url: 'https://community.arc.network/home/resources/architects-overview'
    },
    {
      title: 'Architects: Tiers & Benefits',
      icon: '◌',
      description: 'Public breakdown of tier thresholds from Tier 0 through Tier 5.',
      url: 'https://community.arc.network/home/resources/architects-tiers-and-benefits'
    },
    {
      title: 'Architects: Roles',
      icon: '⬡',
      description: 'Public description of Architect roles like Community Moderator and other role paths.',
      url: 'https://community.arc.network/home/resources/architects-roles'
    },
    {
      title: 'Contribution Rules',
      icon: '✦',
      description: 'Public rules for points and badges, including event speaking, hosting, and registration actions.',
      url: 'https://community.arc.network/public/contributors/contribution-rules'
    }
  ],
  timeline: [
    {
      title: 'Start at Tier 0',
      icon: '①',
      badge: 'Tier 0',
      description: 'Users who register for Arc House start at Tier 0.'
    },
    {
      title: 'Earn points by showing up',
      icon: '②',
      badge: 'Points',
      description: 'Public rules show points for activities like speaking, hosting, and event registration.'
    },
    {
      title: 'Reach 500 points and opt in',
      icon: '③',
      badge: 'Tier 1',
      description: 'Tier 1 Architect status begins at 500 points after opting in to the program.'
    },
    {
      title: 'Grow into higher tiers and roles',
      icon: '④',
      badge: 'Roles',
      description: 'At higher tiers, more benefits and role eligibility open up, including moderator and organizer paths.'
    },
    {
      title: 'Aim for high-impact contribution',
      icon: '⑤',
      badge: 'Tier 5',
      description: 'Tier 5 reaches 90,000 points, with high-visibility spotlighting and deeper access opportunities.'
    }
  ],
  spotlight: [
    {
      title: 'Architect tiers are now much clearer',
      description: 'Arc House now publicly spells out the full points ladder, from Tier 0 at registration to Tier 5 at 90,000 points.'
    },
    {
      title: 'Agentic economy is a major theme',
      description: 'Arc is actively featuring agentic commerce, agentic banking, and an agentic economy hackathon in its public content and events.'
    },
    {
      title: 'Contributors need sign-in for personal stats',
      description: 'The public contributor page shows the leaderboard, but personal points and badges are behind login.'
    }
  ]
};

const els = {
  walletInput: document.getElementById('walletInput'),
  emailInput: document.getElementById('emailInput'),
  analyzeBtn: document.getElementById('analyzeBtn'),
  profileForm: document.getElementById('profileForm'),
  latestBlock: document.getElementById('latestBlock'),
  networkBlock: document.getElementById('networkBlock'),
  gasPrice: document.getElementById('gasPrice'),
  lastRefresh: document.getElementById('lastRefresh'),
  balanceValue: document.getElementById('balanceValue'),
  txCountValue: document.getElementById('txCountValue'),
  scoreValue: document.getElementById('scoreValue'),
  walletTypeValue: document.getElementById('walletTypeValue'),
  rpcStatusText: document.getElementById('rpcStatusText'),
  loadingBar: document.getElementById('loadingBar'),
  activityList: document.getElementById('activityList'),
  activityNote: document.getElementById('activityNote'),
  viewWalletTag: document.getElementById('viewWalletTag'),
  liveModeTag: document.getElementById('liveModeTag'),
  rpcEndpoint: document.getElementById('rpcEndpoint'),
  useDemoAddress: document.getElementById('useDemoAddress'),
  copyNetworkConfig: document.getElementById('copyNetworkConfig'),
  saveProfileMode: document.getElementById('saveProfileMode'),
  copySnapshot: document.getElementById('copySnapshot'),
  identityWallet: document.getElementById('identityWallet'),
  identityEmail: document.getElementById('identityEmail'),
  identityStatus: document.getElementById('identityStatus'),
  identityProof: document.getElementById('identityProof'),
  identityPoints: document.getElementById('identityPoints'),
  identityTier: document.getElementById('identityTier'),
  identityBadges: document.getElementById('identityBadges'),
  identityEvents: document.getElementById('identityEvents'),
  readinessScore: document.getElementById('readinessScore'),
  communityModeValue: document.getElementById('communityModeValue'),
  communityModeLabel: document.getElementById('communityModeLabel'),
  identityNote: document.getElementById('identityNote'),
  communityFeed: document.getElementById('communityFeed'),
  communityTimeline: document.getElementById('communityTimeline'),
  resourceGrid: document.getElementById('resourceGrid'),
  spotlightPanel: document.getElementById('spotlightPanel'),
  paletteToggle: document.getElementById('paletteToggle')
};

const provider = new ethers.JsonRpcProvider(CONFIG.rpcUrl, {
  name: CONFIG.networkName,
  chainId: CONFIG.chainId
}, {
  staticNetwork: true
});

const activityIcons = {
  swap: '⇄',
  bridge: '⇢',
  transfer: '◎',
  contract: '◇',
  stake: '◌',
  mint: '✦',
  deploy: '⬡',
  default: '•'
};

let currentProfile = {
  wallet: '',
  email: '',
  balance: '--',
  txCount: '--',
  score: '--',
  walletType: '--'
};

function abbreviate(value, front = 6, back = 4) {
  if (!value) return '--';
  if (value.length <= front + back) return value;
  return `${value.slice(0, front)}...${value.slice(-back)}`;
}

function formatCompact(value, digits = 2) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '--';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: digits
  }).format(num);
}

function formatUsdc(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '--';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: num >= 1 ? 2 : 4,
    maximumFractionDigits: num >= 1 ? 4 : 6
  }).format(num);
}

function relativeTime(input) {
  if (!input) return 'Unknown';
  const diff = Date.now() - new Date(input).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function classifyTransaction(tx) {
  const method = (tx.functionName || tx.method || '').toLowerCase();
  const input = (tx.input || '').toLowerCase();
  const value = Number(tx.value || 0);

  if (method.includes('swap')) return { type: 'Swap', icon: activityIcons.swap, tag: 'tag-primary' };
  if (method.includes('bridge') || method.includes('deposit') || method.includes('withdraw')) return { type: 'Bridge', icon: activityIcons.bridge, tag: 'tag-accent' };
  if (method.includes('stake') || method.includes('unstake') || method.includes('liquidity')) return { type: 'Liquidity', icon: activityIcons.stake, tag: 'tag-warning' };
  if (method.includes('mint')) return { type: 'Mint', icon: activityIcons.mint, tag: 'tag-success' };
  if (!tx.to) return { type: 'Deploy', icon: activityIcons.deploy, tag: 'tag-warning' };
  if (value > 0 || input === '0x') return { type: 'Transfer', icon: activityIcons.transfer, tag: 'tag-success' };
  return { type: 'Contract call', icon: activityIcons.contract, tag: 'tag-primary' };
}

function computeScore({ balance, txCount, recentCount, uniqueTargets, isContract }) {
  const balanceScore = Math.min(Math.floor(balance * 8), 40);
  const txScore = Math.min(txCount * 4, 120);
  const recentScore = Math.min(recentCount * 6, 60);
  const diversityScore = Math.min(uniqueTargets * 5, 40);
  const contractPenalty = isContract ? 0 : 10;
  return balanceScore + txScore + recentScore + diversityScore + contractPenalty;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function calculateReadiness(wallet, email) {
  let score = 0;
  if (ethers.isAddress(wallet)) score += 60;
  if (isValidEmail(email)) score += 40;
  return score;
}

function communityModeLabel(wallet, email) {
  const hasWallet = ethers.isAddress(wallet);
  const hasEmail = isValidEmail(email);
  if (hasWallet && hasEmail) return 'Wallet + email';
  if (hasWallet) return 'Wallet only';
  if (hasEmail) return 'Email only';
  return 'Awaiting input';
}

function applyPalette(palette) {
  const next = palette === 'arc' ? 'arc' : 'emerald';
  document.body.dataset.palette = next;
  localStorage.setItem(CONFIG.paletteKey, next);
  els.paletteToggle.textContent = `Palette: ${next === 'arc' ? 'Arc' : 'Emerald'}`;
}

function loadSavedProfile() {
  const saved = localStorage.getItem(CONFIG.storageKey);
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    if (parsed.wallet) els.walletInput.value = parsed.wallet;
    if (parsed.email) els.emailInput.value = parsed.email;
  } catch {}
}

function saveProfile() {
  const payload = {
    wallet: els.walletInput.value.trim(),
    email: els.emailInput.value.trim()
  };
  localStorage.setItem(CONFIG.storageKey, JSON.stringify(payload));
  els.saveProfileMode.textContent = 'Saved';
  setTimeout(() => { els.saveProfileMode.textContent = 'Save profile mode'; }, 1400);
}

function updateIdentity(wallet = '', email = '') {
  const readiness = calculateReadiness(wallet, email);
  const mode = communityModeLabel(wallet, email);

  els.identityWallet.textContent = ethers.isAddress(wallet) ? abbreviate(wallet, 8, 6) : 'No valid wallet yet';
  els.identityEmail.textContent = isValidEmail(email) ? email : 'Optional';
  els.identityStatus.textContent = isValidEmail(email) ? 'Profile mode active' : 'Awaiting email or sign-in';
  els.identityProof.textContent = isValidEmail(email) ? 'Email captured locally' : 'Not verified';
  els.identityPoints.textContent = 'Login required';
  els.identityTier.textContent = 'Login required';
  els.identityBadges.textContent = 'Login required';
  els.identityEvents.textContent = 'Login required';
  els.readinessScore.textContent = `${readiness}%`;
  els.communityModeValue.textContent = mode;
  els.communityModeLabel.textContent = mode;

  els.identityNote.textContent = isValidEmail(email)
    ? 'Your email is now part of ArcLume profile mode. Arc House private stats still remain login-gated unless Arc later provides authenticated account access.'
    : 'Add an email to unlock the fuller ArcLume profile mode. Arc House private stats remain login-gated unless Arc provides authenticated account access later.';
}

async function refreshNetworkPanel() {
  try {
    const [network, blockNumber, feeData] = await Promise.all([
      provider.getNetwork(),
      provider.getBlockNumber(),
      provider.getFeeData()
    ]);

    els.latestBlock.textContent = formatCompact(blockNumber, 1);
    els.networkBlock.textContent = formatCompact(blockNumber, 1);
    els.rpcStatusText.textContent = `${network.name || CONFIG.networkName} online`;
    els.gasPrice.textContent = feeData.gasPrice ? `${ethers.formatUnits(feeData.gasPrice, 'gwei')} gwei` : 'Unavailable';
    els.lastRefresh.textContent = new Date().toLocaleTimeString();
  } catch {
    els.rpcStatusText.textContent = 'Arc RPC unavailable';
    els.latestBlock.textContent = '--';
    els.networkBlock.textContent = '--';
    els.gasPrice.textContent = 'Unavailable';
  }
}

async function fetchExplorerTransactions(address) {
  const url = `${CONFIG.explorerApi}?module=account&action=txlist&address=${address}&sort=desc&page=1&offset=10`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });

  if (!response.ok) throw new Error(`Explorer request failed with status ${response.status}`);

  const data = await response.json();
  if (!data || !Array.isArray(data.result)) return [];
  return data.result;
}

function setLoading(isLoading) {
  els.analyzeBtn.disabled = isLoading;
  els.analyzeBtn.textContent = isLoading ? 'Loading...' : 'Analyze profile';
  els.loadingBar.classList.toggle('active', isLoading);
}

function renderActivities(transactions, note = '') {
  els.activityNote.style.display = note ? 'block' : 'none';
  els.activityNote.textContent = note;

  if (!transactions.length) {
    els.activityList.innerHTML = '<div class="empty">No recent explorer activity was loaded for this wallet in this browser session.</div>';
    return;
  }

  els.activityList.innerHTML = transactions.map((tx) => {
    const details = classifyTransaction(tx);
    const ts = tx.timeStamp ? new Date(Number(tx.timeStamp) * 1000).toISOString() : null;
    const amount = Number(tx.value || 0) > 0 ? `${formatUsdc(Number(ethers.formatUnits(tx.value || '0', 18)))} USDC` : 'Interaction';
    const methodLabel = tx.functionName && tx.functionName !== '0x' ? tx.functionName : details.type;

    return `
      <article class="activity-item">
        <div class="activity-icon">${details.icon}</div>
        <div class="activity-main">
          <h4>${methodLabel}</h4>
          <p>${abbreviate(tx.hash, 10, 8)} • ${ts ? relativeTime(ts) : 'Unknown time'} • ${amount}</p>
        </div>
        <div class="activity-meta">
          <span class="tag ${details.tag}">${details.type}</span>
          <a href="${CONFIG.explorerUrl}/tx/${tx.hash}" target="_blank" rel="noreferrer" class="text-link">View tx ↗</a>
        </div>
      </article>
    `;
  }).join('');
}

function renderCommunity() {
  els.communityFeed.innerHTML = COMMUNITY_DATA.feed.map((item) => `
    <article class="community-card">
      <div class="community-icon">${item.icon}</div>
      <div class="community-main">
        <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; flex-wrap:wrap;">
          <h4>${item.title}</h4>
          <span class="tag ${item.type === 'Event' ? 'tag-primary' : 'tag-accent'}">${item.badge}</span>
        </div>
        <p>${item.description}</p>
        <div class="community-links">
          <span class="tag tag-muted">${item.meta}</span>
          <a class="text-link" href="${item.url}" target="_blank" rel="noreferrer">Open ↗</a>
        </div>
      </div>
    </article>
  `).join('');

  els.communityTimeline.innerHTML = COMMUNITY_DATA.timeline.map((item) => `
    <article class="timeline-item">
      <div class="timeline-icon">${item.icon}</div>
      <div class="timeline-main">
        <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; flex-wrap:wrap;">
          <h4>${item.title}</h4>
          <span class="tag tag-success">${item.badge}</span>
        </div>
        <p>${item.description}</p>
      </div>
    </article>
  `).join('');

  els.resourceGrid.innerHTML = COMMUNITY_DATA.resources.map((item) => `
    <article class="resource-card">
      <div class="resource-icon">${item.icon}</div>
      <div class="resource-main">
        <h4>${item.title}</h4>
        <p>${item.description}</p>
        <div class="resource-links">
          <a class="text-link" href="${item.url}" target="_blank" rel="noreferrer">Open resource ↗</a>
        </div>
      </div>
    </article>
  `).join('');

  els.spotlightPanel.innerHTML = COMMUNITY_DATA.spotlight.map((item) => `
    <article class="spotlight-card">
      <h4>${item.title}</h4>
      <p>${item.description}</p>
    </article>
  `).join('');
}

async function analyzeProfile(wallet, email) {
  updateIdentity(wallet, email);

  if (!ethers.isAddress(wallet)) {
    els.balanceValue.textContent = '--';
    els.txCountValue.textContent = '--';
    els.scoreValue.textContent = '--';
    els.walletTypeValue.textContent = '--';
    els.activityNote.style.display = 'block';
    els.activityNote.textContent = 'Enter a valid wallet address to load live Arc data. Email alone powers profile mode, not onchain metrics.';
    els.activityList.innerHTML = '<div class="empty">Wallet lookup is waiting for a valid Arc-compatible address.</div>';
    currentProfile = { wallet, email, balance: '--', txCount: '--', score: '--', walletType: '--' };
    return;
  }

  setLoading(true);
  els.viewWalletTag.href = `${CONFIG.explorerUrl}/address/${wallet}`;
  els.viewWalletTag.textContent = 'Open wallet in Arcscan';
  els.activityList.innerHTML = '<div class="empty">Loading recent activity…</div>';
  els.activityNote.style.display = 'none';

  try {
    const [balanceBn, txCount, code, latestBlock] = await Promise.all([
      provider.getBalance(wallet),
      provider.getTransactionCount(wallet),
      provider.getCode(wallet),
      provider.getBlockNumber()
    ]);

    const balance = Number(ethers.formatUnits(balanceBn, 18));
    const isContract = code && code !== '0x';

    els.balanceValue.textContent = `${formatUsdc(balance)} USDC`;
    els.txCountValue.textContent = formatCompact(txCount, 0);
    els.walletTypeValue.textContent = isContract ? 'Contract' : 'EOA';
    els.latestBlock.textContent = formatCompact(latestBlock, 1);
    els.networkBlock.textContent = formatCompact(latestBlock, 1);
    els.liveModeTag.textContent = 'Live mode';

    let explorerTransactions = [];
    let explorerNote = isValidEmail(email)
      ? 'Wallet data is live. Your email is stored locally for ArcLume profile mode, but Arc House private profile fields still remain login-gated.'
      : 'Wallet data is live. Add an email for the fuller ArcLume profile mode. Arc House private profile fields remain login-gated.';

    try {
      explorerTransactions = await fetchExplorerTransactions(wallet);
      if (!explorerTransactions.length) {
        explorerNote = 'Explorer reached, but no recent transactions were returned for this wallet. Arc House private profile fields remain login-gated.';
      }
    } catch {
      explorerNote = 'Recent activity feed could not be loaded from the explorer in this browser session. Live balance and wallet metrics are still real. Arc House private profile fields remain login-gated.';
      els.liveModeTag.textContent = 'RPC live, explorer limited';
    }

    const uniqueTargets = new Set(explorerTransactions.map(tx => tx.to).filter(Boolean)).size;
    const score = computeScore({
      balance,
      txCount,
      recentCount: explorerTransactions.length,
      uniqueTargets,
      isContract
    });

    els.scoreValue.textContent = formatCompact(score, 0);
    renderActivities(explorerTransactions, explorerNote);
    els.lastRefresh.textContent = new Date().toLocaleTimeString();

    currentProfile = {
      wallet,
      email,
      balance: `${formatUsdc(balance)} USDC`,
      txCount: formatCompact(txCount, 0),
      score: formatCompact(score, 0),
      walletType: isContract ? 'Contract' : 'EOA'
    };
  } catch (error) {
    console.error(error);
    els.balanceValue.textContent = '--';
    els.txCountValue.textContent = '--';
    els.scoreValue.textContent = '--';
    els.walletTypeValue.textContent = '--';
    els.activityNote.style.display = 'block';
    els.activityNote.textContent = 'Unable to load wallet data right now. Check the address format, then retry.';
    els.activityList.innerHTML = '<div class="empty">Wallet lookup failed. Try again in a moment.</div>';
    currentProfile = { wallet, email, balance: '--', txCount: '--', score: '--', walletType: '--' };
  } finally {
    setLoading(false);
  }
}

async function copyNetworkConfig() {
  const text = [
    `Network Name: ${CONFIG.networkName}`,
    `RPC URL: ${CONFIG.rpcUrl}`,
    `Chain ID: ${CONFIG.chainId}`,
    `Currency Symbol: USDC`,
    `Explorer URL: ${CONFIG.explorerUrl}`
  ].join('\n');

  try {
    await navigator.clipboard.writeText(text);
    els.copyNetworkConfig.textContent = 'Copied network config';
    setTimeout(() => { els.copyNetworkConfig.textContent = 'Copy Arc network config'; }, 1500);
  } catch {
    alert(text);
  }
}

async function copySnapshot() {
  const lines = [
    'ArcLume V4 Snapshot',
    `Wallet: ${currentProfile.wallet || 'Not set'}`,
    `Email: ${currentProfile.email || 'Not set'}`,
    `Balance: ${currentProfile.balance}`,
    `Tx Count: ${currentProfile.txCount}`,
    `Arc Score: ${currentProfile.score}`,
    `Wallet Type: ${currentProfile.walletType}`,
    'Arc House private stats: Login required'
  ].join('\n');

  try {
    await navigator.clipboard.writeText(lines);
    els.copySnapshot.textContent = 'Copied snapshot';
    setTimeout(() => { els.copySnapshot.textContent = 'Copy summary snapshot'; }, 1500);
  } catch {
    alert(lines);
  }
}

function initPalette() {
  const saved = localStorage.getItem(CONFIG.paletteKey);
  applyPalette(saved || 'emerald');
}

els.paletteToggle.addEventListener('click', () => {
  applyPalette(document.body.dataset.palette === 'emerald' ? 'arc' : 'emerald');
});

els.profileForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const wallet = els.walletInput.value.trim();
  const email = els.emailInput.value.trim();
  analyzeProfile(wallet, email);
});

els.walletInput.addEventListener('input', () => updateIdentity(els.walletInput.value.trim(), els.emailInput.value.trim()));
els.emailInput.addEventListener('input', () => updateIdentity(els.walletInput.value.trim(), els.emailInput.value.trim()));

els.useDemoAddress.addEventListener('click', () => {
  els.walletInput.value = CONFIG.sampleAddress;
  analyzeProfile(CONFIG.sampleAddress, els.emailInput.value.trim());
});

els.copyNetworkConfig.addEventListener('click', copyNetworkConfig);
els.saveProfileMode.addEventListener('click', saveProfile);
els.copySnapshot.addEventListener('click', copySnapshot);

const queryAddress = new URLSearchParams(window.location.search).get('address');
if (queryAddress) els.walletInput.value = queryAddress;

els.rpcEndpoint.textContent = CONFIG.rpcUrl;
renderCommunity();
initPalette();
loadSavedProfile();
updateIdentity(els.walletInput.value.trim(), els.emailInput.value.trim());
refreshNetworkPanel();
setInterval(refreshNetworkPanel, 30000);

if (queryAddress && ethers.isAddress(queryAddress)) {
  analyzeProfile(queryAddress, els.emailInput.value.trim());
}
