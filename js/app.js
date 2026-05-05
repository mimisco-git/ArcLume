
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@6.13.5/+esm';


// ── Arc Testnet Constants (from docs.arc.network) ──────────────────────────
const ARC_RPC = "https://rpc.testnet.arc.network";
const ARC_CHAIN_ID = 5042002;
const ARC_CHAIN_ID_HEX = "0x4CE612";
const USDC_ADDRESS = "0x3600000000000000000000000000000000000000"; // 6 decimals ERC-20
const EURC_ADDRESS = "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a"; // 6 decimals
const USYC_ADDRESS = "0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C"; // 6 decimals
const ERC8004_IDENTITY  = "0x8004A818BFB912233c491871b3d84c89A494BD9e";
const ERC8004_REPUTATION = "0x8004B663056A597Dffe9eCcC1965A193B7388713";
const ERC8004_VALIDATION = "0x8004Cb1BF31DAf7788923b405b754f57acEB4272";
const ARCSCAN_API = "https://testnet.arcscan.app/api/v2";

// Minimal ERC-20 ABI for balance reads
const ERC20_BALANCE_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

// ERC-8004 minimal ABI
const IDENTITY_ABI = ["function getAgent(address) view returns (address,string,string,uint256)"];
const REPUTATION_ABI = ["function getEventCount(address) view returns (uint256)"];
const VALIDATION_ABI = ["function isValidated(address) view returns (bool)"];


const CONFIG = {
  appName: 'ArcLume V10',
  networkName: 'Arc Testnet',
  chainId: 5042002,
  rpcUrl: 'https://rpc.testnet.arc.network',
  explorerUrl: 'https://testnet.arcscan.app',
  explorerApi: 'https://testnet.arcscan.app/api',
  communityUrl: 'https://community.arc.network/home',
  sampleAddress: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
  profileStorageKey: 'arclume_v10_profile',
  buildTimestamp: '2026-05-05T16:17:58Z',
  communityDataUrl: './data/community.json',
  // Latest Arc contract addresses (from docs.arc.network/arc/references/contract-addresses)
  usdcAddress: '0x3600000000000000000000000000000000000000',
  eurcAddress: '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a',
  usycAddress: '0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C',
  // Chain config (native USDC uses 18 decimals for gas, ERC-20 interface uses 6)
  nativeDecimals: 18,
  erc20Decimals: 6,
  chainIdHex: '0x4CEF52',
  // Arc ecosystem links
  faucetUrl: 'https://faucet.circle.com',
  appKitDocs: 'https://docs.arc.network/app-kit',
  arcDocs: 'https://docs.arc.network',
  arcdiscord: 'https://discord.com/invite/buildonarc',
  arcHouseUrl: 'https://community.arc.network',
};

const FALLBACK_COMMUNITY_DATA = {
  meta: {
    generatedAt: CONFIG.buildTimestamp,
    sourceMode: 'Bundled static snapshot',
    notes: 'Fallback bundled community data. Private Arc House profile data remains login-gated.',
    sources: []
  },
  items: [
    {
      id: 'fallback-connect-arc',
      title: 'Connect to Arc',
      type: 'build',
      priority: 'medium',
      source: 'Arc Docs',
      mode: 'Bundled static snapshot',
      visibility: 'Public',
      when: CONFIG.buildTimestamp,
      icon: '⌁',
      summary: 'Open the official Arc Docs to verify Arc Testnet network details and wallet setup.',
      actionLabel: 'Open docs',
      url: 'https://docs.arc.network/arc/references/connect-to-arc'
    }
  ],
  resources: [
    { title: 'Arc House home', icon: '⌂', desc: 'Open Arc House directly.', url: 'https://community.arc.network/' }
  ]
};

const ACTIVITY_FILTERS = ['all', 'transfer', 'bridge', 'swap', 'liquidity', 'mint', 'contract call', 'deploy'];
const COMMUNITY_FILTERS = [
  { id: 'all', label: 'All priorities' },
  { id: 'high', label: 'High priority' },
  { id: 'event', label: 'Event' },
  { id: 'content', label: 'Content' },
  { id: 'tier', label: 'Tier' },
  { id: 'points', label: 'Points' },
  { id: 'signin', label: 'Sign-in' },
  { id: 'build', label: 'Build' }
];

const provider = new ethers.JsonRpcProvider(CONFIG.rpcUrl, { name: CONFIG.networkName, chainId: CONFIG.chainId }, { staticNetwork: true });
const CONNECTED_MODE = window.ARCLUME_CONNECTED_MODE || { enabled: false, authEndpoint: '', profileEndpoint: '', notes: 'Static mode only.' };

const POINT_RULES = [
  { key: 'planOnboarding', label: 'Finish onboarding', points: 100 },
  { key: 'planDailyActive', label: 'Daily active', points: 5 },
  { key: 'planEventRegistration', label: 'Event registration', points: 5 },
  { key: 'planEventParticipation', label: 'Event participation', points: 100 },
  { key: 'planReadContent', label: 'Read content', points: 5 },
  { key: 'planWatchVideo', label: 'Watch a video', points: 5 },
  { key: 'planPublishPost', label: 'Publish a post', points: 10 },
  { key: 'planComments', label: 'Comment or reply', points: 5 },
  { key: 'planAcceptedAnswer', label: 'Accepted answer', points: 30 },
  { key: 'planAuthor', label: 'Author content', points: 200 },
  { key: 'planIdVerified', label: 'ID verified', points: 100 },
  { key: 'planDeveloperChallenge', label: 'Developer challenge winner', points: 100 },
  { key: 'planHackathonWinner', label: 'Hackathon winner', points: 500 },
  { key: 'planCourseChampion', label: 'Course champion', points: 200 },
  { key: 'planEventSpeaker', label: 'Event speaker', points: 500 },
  { key: 'planMeetingHost', label: 'Meeting or webinar host', points: 300 }
];

const TIER_THRESHOLDS = [
  { tier: 0, min: 0, next: 500, roles: 'None yet', focus: 'Onboarding + early activity' },
  { tier: 1, min: 500, next: 3500, roles: 'Architect badge and topic group', focus: 'Stack event participation and content' },
  { tier: 2, min: 3500, next: 15000, roles: 'Community Moderator or Technical Speaker application window', focus: 'Higher-value speaking and hosting' },
  { tier: 3, min: 15000, next: 40000, roles: 'Senior Technical Speaker path', focus: 'Sustain speaking, workshops, and visibility' },
  { tier: 4, min: 40000, next: 90000, roles: 'Regional Lead (City) coming soon', focus: 'Broader leadership and ecosystem participation' },
  { tier: 5, min: 90000, next: null, roles: 'Regional Lead (Country) coming soon', focus: 'Top-tier ecosystem leadership' }
];

const els = Object.fromEntries([...document.querySelectorAll('[id]')].map((node) => [node.id, node]));

let state = {
  wallet: '',
  email: '',
  savedProfile: false,
  activityFilter: 'all',
  communityFilter: 'all',
  transactions: [],
  explorerHealthy: true,
  summary: null,
  communityData: FALLBACK_COMMUNITY_DATA
};

const activityIcons = {
  swap: '⇄', bridge: '⇢', transfer: '◎', 'contract call': '◇', liquidity: '◌', mint: '✦', deploy: '⬡', default: '•'
};

function abbreviate(value, front = 6, back = 4) {
  if (!value) return '--';
  if (value.length <= front + back) return value;
  return `${value.slice(0, front)}...${value.slice(-back)}`;
}

function formatCompact(value, digits = 2) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '--';
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: digits }).format(num);
}

function formatUsdc(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '--';
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: num >= 1 ? 2 : 4, maximumFractionDigits: num >= 1 ? 4 : 6 }).format(num);
}

function formatDate(value, opts = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!value) return '--';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '--';
  return d.toLocaleDateString([], opts);
}

function formatDateTime(value) {
  if (!value) return '--';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '--';
  return d.toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function relativeTime(value) {
  if (!value) return 'Unknown';
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function timeUntil(value) {
  const diff = new Date(value).getTime() - Date.now();
  const abs = Math.abs(diff);
  const days = Math.floor(abs / 86400000);
  const hours = Math.floor((abs % 86400000) / 3600000);
  if (diff >= 0) return days > 0 ? `in ${days}d ${hours}h` : `in ${hours}h`;
  return days > 0 ? `${days}d ago` : `${hours}h ago`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => els.toast.classList.remove('show'), 2200);
}

function setBanner(type, text) {
  if (!text) {
    els.stateBanner.className = 'card glass banner-card hidden';
    els.stateBanner.textContent = '';
    return;
  }
  els.stateBanner.className = `card glass banner-card ${type || 'info'}`;
  els.stateBanner.textContent = text;
}

function setLoading(isLoading) {
  els.analyzeBtn.disabled = isLoading;
  els.analyzeBtn.textContent = isLoading ? 'Loading...' : 'Analyze profile';
  els.loadingBar.classList.toggle('active', isLoading);
}

function classifyTransaction(tx) {
  const method = (tx.functionName || '').toLowerCase();
  const input = (tx.input || '').toLowerCase();
  const value = Number(tx.value || 0);
  if (method.includes('swap')) return { type: 'swap', icon: activityIcons.swap, tag: 'tag-primary', label: 'Swap' };
  if (method.includes('bridge') || method.includes('deposit') || method.includes('withdraw')) return { type: 'bridge', icon: activityIcons.bridge, tag: 'tag-accent', label: 'Bridge' };
  if (method.includes('stake') || method.includes('unstake') || method.includes('liquidity')) return { type: 'liquidity', icon: activityIcons.liquidity, tag: 'tag-warning', label: 'Liquidity' };
  if (method.includes('mint')) return { type: 'mint', icon: activityIcons.mint, tag: 'tag-success', label: 'Mint' };
  if (!tx.to) return { type: 'deploy', icon: activityIcons.deploy, tag: 'tag-warning', label: 'Deploy' };
  if (input === '0x' && value > 0) return { type: 'transfer', icon: activityIcons.transfer, tag: 'tag-success', label: 'Transfer' };
  return { type: 'contract call', icon: activityIcons['contract call'], tag: 'tag-primary', label: 'Contract call' };
}

function saveProfile() {
  const payload = { wallet: state.wallet || els.walletInput.value.trim(), email: (state.email || els.emailInput.value.trim()).toLowerCase(), savedAt: new Date().toISOString() };
  localStorage.setItem(CONFIG.profileStorageKey, JSON.stringify(payload));
  state.savedProfile = true;
  updateJourneyAndIdentity();
  showToast('Profile mode saved locally');
  setBanner('success', 'Saved profile mode locally. ArcLume will restore this wallet and email on your next visit.');
}

function clearProfile() {
  localStorage.removeItem(CONFIG.profileStorageKey);
  state.savedProfile = false;
  state.wallet = '';
  state.email = '';
  state.transactions = [];
  state.summary = null;
  els.walletInput.value = '';
  els.emailInput.value = '';
  resetWalletViews();
  updateJourneyAndIdentity();
  showToast('Saved profile cleared');
  setBanner('info', 'Saved profile cleared. You can enter a fresh wallet and email anytime.');
}

function loadSavedProfile() {
  try {
    const raw = localStorage.getItem(CONFIG.profileStorageKey);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (data.wallet) { els.walletInput.value = data.wallet; state.wallet = data.wallet; }
    if (data.email) { els.emailInput.value = data.email; state.email = data.email; }
    state.savedProfile = Boolean(data.wallet || data.email);
    return state.savedProfile;
  } catch {
    return false;
  }
}

function buildShareUrl() {
  const url = new URL(window.location.href);
  const wallet = els.walletInput.value.trim();
  const email = els.emailInput.value.trim();
  wallet ? url.searchParams.set('address', wallet) : url.searchParams.delete('address');
  email ? url.searchParams.set('email', email) : url.searchParams.delete('email');
  return url.toString();
}

async function copyText(text, success = 'Copied') {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    showToast(success);
  } catch {
    window.prompt('Copy this value:', text);
  }
}

function computeReadiness() {
  const walletValid = ethers.isAddress(els.walletInput.value.trim());
  const email = els.emailInput.value.trim();
  const emailValid = email ? isValidEmail(email) : false;
  const saved = state.savedProfile;
  const score = (walletValid ? 40 : 0) + (emailValid ? 25 : 0) + (saved ? 15 : 0) + ((walletValid && emailValid) ? 20 : 0);
  let badge = 'Awaiting setup';
  if (score >= 90) badge = 'Arc House ready';
  else if (score >= 60) badge = 'Profile prepared';
  else if (score >= 40) badge = 'Wallet ready';
  return { score, badge, walletValid, emailValid };
}

function getJourneySteps() {
  const readiness = computeReadiness();
  return [
    { title: 'Wallet connected', desc: 'A valid Arc wallet is present for onchain analysis.', done: readiness.walletValid, icon: '⌁' },
    { title: 'Email added', desc: 'An email is present for Arc House profile prep.', done: readiness.emailValid, icon: '@' },
    { title: 'Profile saved', desc: 'Wallet and email are stored locally for quick return.', done: state.savedProfile, icon: '◌' },
    { title: 'Arc House handoff ready', desc: 'Use the access panel to continue into Arc House sign-in.', done: readiness.walletValid && readiness.emailValid, icon: '↗' }
  ];
}

function updateJourneyAndIdentity() {
  const wallet = els.walletInput.value.trim();
  const email = els.emailInput.value.trim().toLowerCase();
  state.wallet = wallet;
  state.email = email;
  const { score, badge, walletValid, emailValid } = computeReadiness();
  const journey = getJourneySteps();
  const completed = journey.filter(step => step.done).length;

  els.readinessScore.textContent = `${score}%`;
  els.readinessBadgeValue.textContent = badge;
  els.communityModeValue.textContent = walletValid && emailValid ? 'Profile prepared' : walletValid ? 'Wallet mode' : 'Awaiting input';
  els.communityModeValue.textContent = walletValid && emailValid ? 'Profile prepared' : walletValid ? 'Wallet mode' : 'Awaiting input';
  els.identityWallet.textContent = wallet ? abbreviate(wallet, 8, 6) : 'Not checked yet';
  els.identityEmail.textContent = email || 'Optional';
  els.identityStatus.textContent = walletValid && emailValid ? 'Ready for Arc House handoff' : walletValid ? 'Wallet analyzed only' : 'Ready for wallet or sign-in';
  els.identityProof.textContent = emailValid ? 'Email format ready' : 'Not verified';
  els.nextActionText.textContent = walletValid && emailValid
    ? 'Your wallet and email are ready. Use the Arc House access panel to continue into sign-in and then review your My Contributions area.'
    : walletValid
      ? 'Your wallet is ready. Add your Arc House email to complete the profile preparation step.'
      : 'Start with a valid wallet, then add your Arc House email if you want a cleaner sign-in handoff.';
  els.walletBadgeTag.textContent = badge;
  els.journeyTag.textContent = `Step ${completed}`;
  els.identityNote.textContent = walletValid && emailValid
    ? 'ArcLume profile mode is prepared. Personal Arc House stats still remain sign-in-only until Arc exposes a supported authenticated integration.'
    : 'Add both wallet and email to unlock the fuller ArcLume profile mode. Personal Arc House stats still remain sign-in-only unless Arc provides an authenticated integration later.';

  els.journeyGrid.innerHTML = journey.map((step, idx) => `
    <article class="journey-card">
      <div class="journey-icon">${step.icon}</div>
      <div class="journey-main">
        <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; flex-wrap:wrap;">
          <h4>${idx + 1}. ${step.title}</h4>
          <span class="tag ${step.done ? 'tag-success' : 'tag-muted'}">${step.done ? 'Done' : 'Pending'}</span>
        </div>
        <p>${step.desc}</p>
      </div>
    </article>
  `).join('');

  els.modalWalletValue.textContent = wallet ? abbreviate(wallet, 8, 6) : 'Not set';
  els.modalEmailValue.textContent = email || 'Not set';
}

function resetWalletViews() {
  els.balanceValue.textContent = '--';
  els.txCountValue.textContent = '--';
  els.scoreValue.textContent = '--';
  els.walletTypeValue.textContent = '--';
  els.firstSeenValue.textContent = '--';
  els.streakValue.textContent = '--';
  els.diversityValue.textContent = '--';
  els.contractDepthValue.textContent = '--';
  els.recentActivityValue.textContent = '--';
  els.readinessBadgeValue.textContent = computeReadiness().badge;
  els.activityList.innerHTML = '<div class="empty">No wallet checked yet. Paste an address above to load live data.</div>';
  els.activityNote.classList.add('hidden');
  els.viewWalletTag.href = CONFIG.explorerUrl;
  els.quickWalletLink && (els.quickWalletLink.href = CONFIG.explorerUrl);
}

async function refreshNetworkPanel() {
  try {
    const [network, blockNumber, feeData] = await Promise.all([
      provider.getNetwork(), provider.getBlockNumber(), provider.getFeeData()
    ]);
    els.latestBlock.textContent = formatCompact(blockNumber, 1);
    els.networkBlock.textContent = formatCompact(blockNumber, 1);
    els.rpcStatusText.textContent = `${network.name || CONFIG.networkName} online`;
    els.gasPrice.textContent = feeData.gasPrice ? `${ethers.formatUnits(feeData.gasPrice, 'gwei')} gwei` : 'Unavailable';
    els.lastRefresh.textContent = new Date().toLocaleTimeString();
  } catch (error) {
    els.rpcStatusText.textContent = 'Arc RPC unavailable';
    els.latestBlock.textContent = '--';
    els.networkBlock.textContent = '--';
    els.gasPrice.textContent = 'Unavailable';
    setBanner('warning', 'Arc RPC is unavailable right now. Wallet checks may fail until the network endpoint responds again.');
  }
}

async function fetchTransactionList(address, sort = 'desc', offset = 25) {
  const url = `${CONFIG.explorerApi}?module=account&action=txlist&address=${address}&sort=${sort}&page=1&offset=${offset}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Explorer request failed with status ${response.status}`);
  const data = await response.json();
  if (!data || !Array.isArray(data.result)) return [];
  return data.result;
}

async function loadCommunityData(force = false) {
  try {
    const cacheBust = force ? `?t=${Date.now()}` : '';
    const response = await fetch(`${CONFIG.communityDataUrl}${cacheBust}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Community JSON request failed with status ${response.status}`);
    const data = await response.json();
    if (!data || !Array.isArray(data.items) || !Array.isArray(data.resources)) throw new Error('Community JSON shape invalid');
    state.communityData = data;
    els.communityStatusTag.textContent = 'Auto-updating public feed';
    els.communityModeText.textContent = data.meta?.sourceMode || 'Auto-updating public feed';
    els.communityFeedMode.textContent = 'Auto-updating public feed';
    els.communitySourceNote.textContent = data.meta?.notes || 'ArcLume loads public Arc House data from data/community.json. Private Arc House profile data still requires sign-in.';
    els.communityBuildTime.textContent = formatDateTime(data.meta?.generatedAt || CONFIG.buildTimestamp);
    els.communityRefreshTime.textContent = new Date().toLocaleTimeString();
    renderCommunity();
    if (force) showToast('Community feed refreshed');
  } catch (error) {
    console.error(error);
    state.communityData = FALLBACK_COMMUNITY_DATA;
    els.communityStatusTag.textContent = 'Bundled static fallback';
    els.communityModeText.textContent = FALLBACK_COMMUNITY_DATA.meta.sourceMode;
    els.communityFeedMode.textContent = 'Bundled static fallback';
    els.communitySourceNote.textContent = 'Community JSON could not be refreshed in this browser session, so ArcLume is using the bundled public fallback snapshot.';
    els.communityBuildTime.textContent = formatDateTime(FALLBACK_COMMUNITY_DATA.meta.generatedAt);
    els.communityRefreshTime.textContent = new Date().toLocaleTimeString();
    renderCommunity();
    if (force) showToast('Using fallback community snapshot');
  }
}

function computeStreak(transactions) {
  if (!transactions.length) return 0;
  const daySet = new Set(transactions.map(tx => new Date(Number(tx.timeStamp) * 1000).toISOString().slice(0, 10)));
  let streak = 0;
  let cursor = new Date();
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!daySet.has(key)) break;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

function getWalletBadge(txCount, recentCount, diversity, contractDepth) {
  if (txCount === 0) return 'Fresh wallet';
  if (txCount < 8 || recentCount < 3) return 'Warming wallet';
  if (txCount >= 8 && recentCount >= 3 && diversity >= 3) return contractDepth >= 5 ? 'Active builder' : 'Active wallet';
  return 'Fresh wallet';
}

function computeScore({ balance, txCount, recentCount, uniqueTargets, isContract }) {
  const balanceScore = Math.min(Math.floor(balance * 8), 40);
  const txScore = Math.min(txCount * 4, 120);
  const recentScore = Math.min(recentCount * 6, 60);
  const diversityScore = Math.min(uniqueTargets * 5, 40);
  const contractPenalty = isContract ? 0 : 10;
  return balanceScore + txScore + recentScore + diversityScore + contractPenalty;
}

function renderActivityFilters() {
  els.activityFilters.innerHTML = ACTIVITY_FILTERS.map(filter => `
    <button class="filter-chip ${state.activityFilter === filter ? 'active' : ''}" data-activity-filter="${filter}" type="button">${filter === 'all' ? 'All activity' : filter}</button>
  `).join('');
}

function renderActivities(note = '') {
  els.activityNote.textContent = note || '';
  els.activityNote.classList.toggle('hidden', !note);
  if (!state.transactions.length) {
    els.activityList.innerHTML = '<div class="empty">No recent wallet activity was available in this session. If the wallet is new, that may be expected. If the explorer is limiting browser calls, retry later or open Arcscan directly.</div>';
    return;
  }
  const filtered = state.transactions.filter(tx => state.activityFilter === 'all' || tx.__details.type === state.activityFilter);
  if (!filtered.length) {
    els.activityList.innerHTML = `<div class="empty">No transactions matched the <strong>${state.activityFilter}</strong> filter for this wallet.</div>`;
    return;
  }
  els.activityList.innerHTML = filtered.map(tx => {
    const d = tx.__details;
    const ts = new Date(Number(tx.timeStamp) * 1000).toISOString();
    const amount = Number(tx.value || 0) > 0 ? `${formatUsdc(Number(ethers.formatUnits(tx.value || '0', 18)))} USDC` : 'Interaction';
    const label = tx.functionName && tx.functionName !== '0x' ? tx.functionName : d.label;
    return `
      <article class="activity-item">
        <div class="activity-icon">${d.icon}</div>
        <div class="activity-main">
          <h4>${label}</h4>
          <p>${abbreviate(tx.hash, 10, 8)} • ${relativeTime(ts)} • ${amount}</p>
        </div>
        <div class="activity-meta">
          <span class="tag ${d.tag}">${d.label}</span>
          <a class="text-link" href="${CONFIG.explorerUrl}/tx/${tx.hash}" target="_blank" rel="noreferrer">View tx ↗</a>
        </div>
      </article>`;
  }).join('');
}

function renderCommunity() {
  const data = state.communityData || FALLBACK_COMMUNITY_DATA;
  els.communityBuildTime.textContent = formatDateTime(data.meta?.generatedAt || CONFIG.buildTimestamp);
  els.communityRefreshTime.textContent = new Date().toLocaleTimeString();
  const items = (data.items || []).filter(item => state.communityFilter === 'all' || item.priority === state.communityFilter || item.type === state.communityFilter);
  if (!items.length) {
    els.communityFeed.innerHTML = '<div class="empty">No community cards matched the selected filter in this session.</div>';
  } else {
    els.communityFeed.innerHTML = items.map(item => `
      <article class="community-card">
        <div class="community-icon">${item.icon || '•'}</div>
        <div class="community-main">
          <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; flex-wrap:wrap;">
            <h4>${item.title}</h4>
            <span class="tag ${item.priority === 'high' ? 'tag-warning' : item.priority === 'medium' ? 'tag-primary' : 'tag-muted'}">${item.priority} priority</span>
          </div>
          <p>${item.summary}</p>
          <div class="community-links">
            <span class="tag tag-muted">${item.source}</span>
            <span class="tag tag-muted">${item.mode}</span>
            <span class="tag tag-muted">${item.visibility}</span>
            <span class="tag tag-muted">${item.when ? timeUntil(item.when) : 'No schedule'}</span>
            <a class="text-link" href="${item.url}" target="_blank" rel="noreferrer">${item.actionLabel || 'Open'} ↗</a>
          </div>
        </div>
      </article>
    `).join('');
  }

  const resources = data.resources || [];
  els.resourceGrid.innerHTML = resources.map(item => `
    <article class="resource-card">
      <div class="resource-icon">${item.icon || '•'}</div>
      <div class="resource-main">
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
        <div class="resource-links"><a class="text-link" href="${item.url}" target="_blank" rel="noreferrer">Open resource ↗</a></div>
      </div>
    </article>
  `).join('');
}

function renderCommunityFilters() {
  els.communityFilters.innerHTML = COMMUNITY_FILTERS.map(filter => `
    <button class="filter-chip ${state.communityFilter === filter.id ? 'active' : ''}" data-community-filter="${filter.id}" type="button">${filter.label}</button>
  `).join('');
}

function setWalletInsightDefaults() {
  els.firstSeenValue.textContent = '--';
  els.streakValue.textContent = '--';
  els.diversityValue.textContent = '--';
  els.contractDepthValue.textContent = '--';
  els.recentActivityValue.textContent = '--';
  els.walletBadgeTag.textContent = 'Fresh wallet';
}






// ── Feature 5: Wallet Comparison Tool ────────────────────────────────────────
async function compareWallets() {
  const a = document.getElementById('compareWalletA')?.value?.trim();
  const b = document.getElementById('compareWalletB')?.value?.trim();
  const el = document.getElementById('compareResult');
  if (!el) return;
  if (!a || !b) { el.innerHTML = '<div class="x402-error">Enter both wallet addresses.</div>'; return; }
  if (!ethers.isAddress(a) || !ethers.isAddress(b)) { el.innerHTML = '<div class="x402-error">One or both addresses are invalid.</div>'; return; }
  el.innerHTML = '<div class="loading-text">Comparing wallets...</div>';

  async function getWalletStats(addr) {
    try {
      const [balRaw, txCount] = await Promise.all([
        provider.getBalance(addr),
        provider.getTransactionCount(addr)
      ]);
      const bal = Number(ethers.formatUnits(balRaw, 18)).toFixed(4);
      return { addr, bal, txCount, score: Math.min(100, txCount * 3 + (parseFloat(bal) > 0 ? 20 : 0)) };
    } catch { return { addr, bal: '—', txCount: 0, score: 0 }; }
  }

  const [statsA, statsB] = await Promise.all([getWalletStats(a), getWalletStats(b)]);
  const short = addr => addr.slice(0,8)+'...'+addr.slice(-4);
  const win = (vA, vB) => parseFloat(vA) > parseFloat(vB) ? 'compare-win' : '';

  el.innerHTML = `
    <div class="compare-grid">
      <div class="compare-header"></div>
      <div class="compare-header">${short(a)}</div>
      <div class="compare-header">${short(b)}</div>

      <div class="compare-label">Balance</div>
      <div class="compare-val ${win(statsA.bal, statsB.bal)}">${statsA.bal} USDC</div>
      <div class="compare-val ${win(statsB.bal, statsA.bal)}">${statsB.bal} USDC</div>

      <div class="compare-label">Tx Count</div>
      <div class="compare-val ${win(statsA.txCount, statsB.txCount)}">${statsA.txCount}</div>
      <div class="compare-val ${win(statsB.txCount, statsA.txCount)}">${statsB.txCount}</div>

      <div class="compare-label">Arc Score</div>
      <div class="compare-val ${win(statsA.score, statsB.score)}">${statsA.score}/100</div>
      <div class="compare-val ${win(statsB.score, statsA.score)}">${statsB.score}/100</div>

      <div class="compare-label">Explorer</div>
      <div class="compare-val"><a href="${CONFIG.explorerUrl}/address/${a}" target="_blank">View ↗</a></div>
      <div class="compare-val"><a href="${CONFIG.explorerUrl}/address/${b}" target="_blank">View ↗</a></div>
    </div>`;
}

// ── Feature 4: Arcscan Live Feed ─────────────────────────────────────────────
async function fetchLiveFeed() {
  const el = document.getElementById('liveFeedList');
  const lastEl = document.getElementById('liveFeedLastBlock');
  if (!el) return;
  try {
    // Get latest block
    const blockNum = await provider.getBlockNumber();
    if (lastEl) lastEl.textContent = `Block #${blockNum.toLocaleString()}`;
    const block = await provider.getBlock(blockNum, true);
    const txs = block?.transactions?.slice(0, 8) || [];
    if (txs.length === 0) {
      el.innerHTML = '<div class="empty-state">No transactions in latest block.</div>';
      return;
    }
    el.innerHTML = txs.map(tx => {
      const short = a => a ? a.slice(0,8)+'...'+a.slice(-4) : '?';
      const val = tx.value ? Number(ethers.formatUnits(tx.value, 18)).toFixed(4) : '0';
      return `
        <div class="feed-row">
          <span class="feed-hash"><a href="${CONFIG.explorerUrl}/tx/${tx.hash}" target="_blank">${tx.hash.slice(0,12)}...</a></span>
          <span class="feed-addr">${short(tx.from)} → ${short(tx.to)}</span>
          <span class="feed-val">${val} USDC</span>
        </div>`;
    }).join('');
  } catch (e) {
    if (el) el.innerHTML = '<div class="empty-state">Feed unavailable.</div>';
  }
}

function startLiveFeed() {
  fetchLiveFeed();
  setInterval(fetchLiveFeed, 5000);
}

// ── Feature 3: x402 Payment Simulator ────────────────────────────────────────
function buildX402Header(wallet, amount, resourceUrl) {
  const payload = {
    scheme: 'exact',
    network: 'arc-testnet',
    payload: {
      from: wallet,
      to: 'YOUR_SERVER_WALLET',
      value: Math.floor(parseFloat(amount) * 1e6).toString(),
      asset: { address: '0x3600000000000000000000000000000000000000', decimals: 6, eip712_domain: {} },
      validFor: 300,
      nonce: Date.now().toString(),
    }
  };
  return btoa(JSON.stringify(payload));
}

async function simulateX402Payment() {
  const url = document.getElementById('x402Url')?.value?.trim();
  const amount = document.getElementById('x402Amount')?.value?.trim() || '0.001';
  const wallet = document.getElementById('walletInput')?.value?.trim();
  const resultEl = document.getElementById('x402Result');
  if (!resultEl) return;
  if (!wallet) { resultEl.innerHTML = '<div class="x402-error">Enter a wallet address first in the lookup section.</div>'; return; }
  if (!url) { resultEl.innerHTML = '<div class="x402-error">Enter a resource URL to simulate.</div>'; return; }

  const header = buildX402Header(wallet, amount, url);
  resultEl.innerHTML = `
    <div class="x402-section">
      <div class="x402-label">Payment header (x-payment)</div>
      <div class="x402-code">${header.slice(0, 80)}...</div>
    </div>
    <div class="x402-section">
      <div class="x402-label">How it works on Arc</div>
      <div class="x402-detail">1. Client sends GET ${url} with x-payment header</div>
      <div class="x402-detail">2. Server validates ${amount} USDC payment on Arc testnet</div>
      <div class="x402-detail">3. Arc settles in &lt;1 second at ~$0.01 gas</div>
      <div class="x402-detail">4. Server returns premium content</div>
    </div>
    <div class="x402-section">
      <div class="x402-label">Estimated cost</div>
      <div class="x402-detail">Payment: ${amount} USDC &nbsp;|&nbsp; Gas: ~$0.01 USDC &nbsp;|&nbsp; Total: ~${(parseFloat(amount)+0.01).toFixed(3)} USDC</div>
    </div>`;
}

// ── Feature 2: CCTP Transfer Tracker ─────────────────────────────────────────
async function fetchCctpTransfers(wallet) {
  const el = document.getElementById('cctpTransferList');
  const badge = document.getElementById('cctpBadge');
  if (!el) return;
  el.innerHTML = '<div class="loading-text">Scanning CCTP activity...</div>';
  try {
    // Query Arcscan API for USDC token transfers
    const url = `${CONFIG.explorerApi}?module=account&action=tokentx&address=${wallet}&contractaddress=${CONFIG.usdcAddress}&sort=desc&limit=10`;
    const res = await fetch(url);
    const data = await res.json();
    const txs = data?.result || [];
    const crossChain = txs.filter(tx => tx.from?.toLowerCase() !== wallet.toLowerCase() || tx.to?.toLowerCase() !== wallet.toLowerCase());
    if (badge) badge.textContent = txs.length;
    if (txs.length === 0) {
      el.innerHTML = '<div class="empty-state">No USDC transfers found for this wallet.</div>';
      return;
    }
    el.innerHTML = txs.slice(0, 8).map(tx => {
      const isIn = tx.to?.toLowerCase() === wallet.toLowerCase();
      const amt = Number(ethers.formatUnits(tx.value || '0', 6)).toFixed(2);
      const time = new Date(Number(tx.timeStamp) * 1000).toLocaleString();
      const short = addr => addr ? addr.slice(0,8) + '...' + addr.slice(-4) : '?';
      return `
        <div class="cctp-row">
          <span class="cctp-direction ${isIn ? 'cctp-in' : 'cctp-out'}">${isIn ? '↓ IN' : '↑ OUT'}</span>
          <span class="cctp-amount">${amt} USDC</span>
          <span class="cctp-addr">${isIn ? short(tx.from) : short(tx.to)}</span>
          <a href="${CONFIG.explorerUrl}/tx/${tx.hash}" target="_blank" class="cctp-hash">↗ View</a>
        </div>`;
    }).join('');
  } catch {
    el.innerHTML = '<div class="empty-state">Could not load transfer history.</div>';
  }
}

// ── Feature 1: Unified Balance (App Kit pattern) ─────────────────────────────
// Shows estimated USDC across chains using public RPC reads
async function fetchUnifiedBalance(wallet) {
  const chains = [
    { name: 'Arc Testnet', rpc: 'https://rpc.testnet.arc.network', isArc: true },
    { name: 'Ethereum Sepolia', rpc: 'https://rpc.sepolia.org', token: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' },
    { name: 'Base Sepolia', rpc: 'https://sepolia.base.org', token: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' },
  ];

  const ERC20_ABI = ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'];
  const results = [];

  await Promise.allSettled(chains.map(async (chain) => {
    try {
      const p = new ethers.JsonRpcProvider(chain.rpc);
      let balance = 0;
      if (chain.isArc) {
        const raw = await p.getBalance(wallet);
        balance = Number(ethers.formatUnits(raw, 18));
      } else if (chain.token) {
        const contract = new ethers.Contract(chain.token, ERC20_ABI, p);
        const [raw, dec] = await Promise.all([contract.balanceOf(wallet), contract.decimals()]);
        balance = Number(ethers.formatUnits(raw, dec));
      }
      results.push({ chain: chain.name, balance: balance.toFixed(4), isArc: chain.isArc });
    } catch {
      results.push({ chain: chain.name, balance: '—', isArc: chain.isArc });
    }
  }));

  return results;
}

function renderUnifiedBalance(results) {
  const el = document.getElementById('unifiedBalanceGrid');
  if (!el) return;
  const total = results.reduce((s, r) => s + (parseFloat(r.balance) || 0), 0);
  document.getElementById('unifiedBalanceTotal').textContent = total > 0 ? `${total.toFixed(4)} USDC` : '0 USDC';
  el.innerHTML = results.map(r => `
    <div class="unified-chain-row">
      <span class="chain-name">${r.chain}${r.isArc ? ' <span class="tag tag-accent" style="font-size:10px;padding:2px 8px;">Native</span>' : ''}</span>
      <span class="chain-balance">${r.balance} USDC</span>
    </div>
  `).join('');
}

async function analyzeWallet(wallet, email) {
  if (!wallet || !ethers.isAddress(wallet)) {
    setBanner('error', 'Enter a valid wallet address before running the profile analysis.');
    showToast('Wallet address invalid');
    return;
  }
  if (email && !isValidEmail(email)) {
    setBanner('warning', 'The email format looks invalid. Fix it first, or leave it blank and continue with wallet-only mode.');
    showToast('Email format looks invalid');
    return;
  }

  state.wallet = wallet;
  state.email = email.toLowerCase();
  updateJourneyAndIdentity();
  setLoading(true);
  setBanner('info', 'Running live Arc wallet analysis. Explorer-derived insights may be limited if browser access to Arcscan is unavailable.');
  els.viewWalletTag.href = `${CONFIG.explorerUrl}/address/${wallet}`;
  if (els.quickWalletLink) els.quickWalletLink.href = `${CONFIG.explorerUrl}/address/${wallet}`;

  try {
    const [balanceBn, txCount, code, latestBlock] = await Promise.all([
      provider.getBalance(wallet),
      provider.getTransactionCount(wallet),
      provider.getCode(wallet),
      provider.getBlockNumber()
    ]);

    // Arc native USDC: use ERC-20 interface (6 decimals) per docs.arc.network
    const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_BALANCE_ABI, provider);
    const erc20Balance = await usdcContract.balanceOf(wallet).catch(() => balanceBn);
    const balance = Number(ethers.formatUnits(erc20Balance, 6)); // native USDC uses 18 decimal precision per Arc docs
    const isContract = code && code !== '0x';
    els.balanceValue.textContent = `${formatUsdc(balance)} USDC`;
    els.txCountValue.textContent = formatCompact(txCount, 0);
    els.walletTypeValue.textContent = isContract ? 'Contract' : 'EOA';
    els.latestBlock.textContent = formatCompact(latestBlock, 1);
    els.networkBlock.textContent = formatCompact(latestBlock, 1);
    els.liveModeTag.textContent = 'RPC live';

    let recentTxs = [];
    let oldestTx = null;
    let note = '';
    state.explorerHealthy = true;
    try {
      const [recentList, firstList] = await Promise.all([
        fetchTransactionList(wallet, 'desc', 25),
        fetchTransactionList(wallet, 'asc', 1)
      ]);
      recentTxs = recentList.map(tx => ({ ...tx, __details: classifyTransaction(tx) }));
      oldestTx = firstList[0] || null;
      if (!recentTxs.length) note = 'No recent explorer transactions were returned for this wallet. The wallet may be new, inactive, or temporarily limited by explorer indexing.';
    } catch (error) {
      state.explorerHealthy = false;
      els.liveModeTag.textContent = 'RPC live, explorer limited';
      note = 'Arcscan activity could not be loaded in this browser session. Live wallet balance and nonce are still real.';
    }

    state.transactions = recentTxs;
    const uniqueTargets = new Set(recentTxs.map(tx => tx.to).filter(Boolean)).size;
    const contractDepth = recentTxs.filter(tx => tx.__details.type !== 'transfer').length;
    const streak = computeStreak(recentTxs);
    const score = computeScore({ balance, txCount, recentCount: recentTxs.length, uniqueTargets, isContract });
    const badge = getWalletBadge(txCount, recentTxs.length, uniqueTargets, contractDepth);

    els.scoreValue.textContent = formatCompact(score, 0);
    els.firstSeenValue.textContent = oldestTx ? formatDate(Number(oldestTx.timeStamp) * 1000) : state.explorerHealthy ? 'No history' : 'Unavailable';
    els.streakValue.textContent = state.explorerHealthy ? `${streak}d` : 'Unavailable';
    els.diversityValue.textContent = state.explorerHealthy ? formatCompact(uniqueTargets, 0) : 'Unavailable';
    els.contractDepthValue.textContent = state.explorerHealthy ? formatCompact(contractDepth, 0) : 'Unavailable';
    els.recentActivityValue.textContent = state.explorerHealthy ? formatCompact(recentTxs.length, 0) : 'Unavailable';
    els.walletBadgeTag.textContent = badge;

    renderActivities(note);
    updateJourneyAndIdentity();
    state.summary = {
      wallet,
      email: state.email,
      balance: els.balanceValue.textContent,
      txCount: els.txCountValue.textContent,
      score: els.scoreValue.textContent,
      walletType: els.walletTypeValue.textContent,
      firstSeen: els.firstSeenValue.textContent,
      streak: els.streakValue.textContent,
      diversity: els.diversityValue.textContent,
      badge
    };

    if (email) {
      setBanner('success', 'Wallet analysis complete. Your wallet and email are now prepared for the Arc House handoff panel.');
    } else {
      setBanner('info', 'Wallet analysis complete. Add your Arc House email if you want a stronger sign-in handoff and saved profile mode.');
    }
  } catch (error) {
    console.error(error);
    resetWalletViews();
    setWalletInsightDefaults();
    els.liveModeTag.textContent = 'Wallet lookup failed';
    setBanner('error', 'Wallet lookup failed. Check the address format, then retry. If Arc RPC is under load, wait and try again.');
    showToast('Wallet lookup failed');
  } finally {
    setLoading(false);
  }
}


function getTierEstimate(points) {
  let current = TIER_THRESHOLDS[0];
  for (const tier of TIER_THRESHOLDS) {
    if (points >= tier.min) current = tier;
  }
  return current;
}

function calculatePlanner() {
  let total = 0;
  const rows = [];
  for (const rule of POINT_RULES) {
    const el = els[rule.key];
    const qty = Math.max(0, Number(el?.value || 0));
    const pts = qty * rule.points;
    if (qty > 0) rows.push({ label: rule.label, qty, pts });
    total += pts;
  }
  const tier = getTierEstimate(total);
  const next = tier.next;
  const progress = next ? Math.min(100, Math.round(((total - tier.min) / (next - tier.min)) * 100)) : 100;
  els.plannerTotalPoints.textContent = formatCompact(total, 0);
  els.plannerTier.textContent = `Tier ${tier.tier}`;
  els.plannerNextMilestone.textContent = next ? `${formatCompact(Math.max(next - total, 0), 0)} pts to next` : 'Top public tier';
  els.plannerRoles.textContent = tier.roles;
  els.plannerProgress.textContent = `${progress}%`;
  els.plannerFocus.textContent = tier.focus;
  if (!rows.length) {
    els.plannerBreakdown.innerHTML = '<div class="empty">Add some planned contribution counts to see an estimated points path.</div>';
  } else {
    els.plannerBreakdown.innerHTML = rows.sort((a,b)=>b.pts-a.pts).slice(0,8).map(r => `<div class="breakdown-row"><span>${r.label} × ${r.qty}</span><strong>${formatCompact(r.pts,0)} pts</strong></div>`).join('');
  }
}

function resetPlanner() {
  for (const rule of POINT_RULES) {
    if (els[rule.key]) els[rule.key].value = ['planOnboarding','planIdVerified'].includes(rule.key) ? 1 : 0;
  }
  if (els.planDailyActive) els.planDailyActive.value = 7;
  if (els.planEventRegistration) els.planEventRegistration.value = 2;
  if (els.planEventParticipation) els.planEventParticipation.value = 1;
  if (els.planReadContent) els.planReadContent.value = 5;
  if (els.planWatchVideo) els.planWatchVideo.value = 2;
  calculatePlanner();
}

function copyPlannerSummary() {
  const lines = ['ArcLume V8 planner summary'];
  for (const rule of POINT_RULES) {
    const qty = Number(els[rule.key]?.value || 0);
    if (qty > 0) lines.push(`${rule.label}: ${qty} × ${rule.points} = ${qty * rule.points}`);
  }
  lines.push(`Estimated points: ${els.plannerTotalPoints.textContent}`);
  lines.push(`Estimated tier: ${els.plannerTier.textContent}`);
  lines.push(`Likely role window: ${els.plannerRoles.textContent}`);
  copyText(lines.join('\n'), 'Planner summary copied');
}

function updateConnectedModeCard() {
  const endpointAuth = CONNECTED_MODE.authEndpoint || '';
  const endpointProfile = CONNECTED_MODE.profileEndpoint || '';
  const enabled = Boolean(CONNECTED_MODE.enabled && endpointAuth && endpointProfile);
  els.connectorModeTag.textContent = enabled ? 'Connected ready' : 'Static mode';
  els.connectorStatus.textContent = enabled ? 'Configured' : 'Not configured';
  els.connectorAuthEndpoint.textContent = endpointAuth || 'Not set';
  els.connectorProfileEndpoint.textContent = endpointProfile || 'Not set';
}

function copyRuntimeConfig() {
  const example = `window.ARCLUME_CONNECTED_MODE = {
  enabled: true,
  authEndpoint: 'https://your-worker.example.com/auth/start',
  profileEndpoint: 'https://your-worker.example.com/profile',
  notes: 'Use only with a supported Arc House auth flow.'
};`;
  copyText(example, 'Runtime config copied');
}

function openModal() {
  els.signInModal.classList.remove('hidden');
  els.signInModal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  els.signInModal.classList.add('hidden');
  els.signInModal.setAttribute('aria-hidden', 'true');
}

function buildSnapshotText() {
  const s = state.summary || {
    wallet: els.walletInput.value.trim() || 'Not set',
    email: els.emailInput.value.trim() || 'Not set',
    balance: els.balanceValue.textContent,
    txCount: els.txCountValue.textContent,
    score: els.scoreValue.textContent,
    walletType: els.walletTypeValue.textContent,
    firstSeen: els.firstSeenValue.textContent,
    streak: els.streakValue.textContent,
    diversity: els.diversityValue.textContent,
    badge: els.walletBadgeTag.textContent
  };
  return [
    'ArcLume V8 snapshot',
    `Wallet: ${s.wallet}`,
    `Email: ${s.email || 'Not set'}`,
    `Balance: ${s.balance}`,
    `Transactions: ${s.txCount}`,
    `Score: ${s.score}`,
    `Wallet type: ${s.walletType}`,
    `First seen: ${s.firstSeen}`,
    `Activity streak: ${s.streak}`,
    `Diversity: ${s.diversity}`,
    `Wallet badge: ${s.badge}`,
    `Arcscan: ${CONFIG.explorerUrl}/address/${s.wallet && s.wallet.startsWith('0x') ? s.wallet : ''}`
  ].join('\n');
}


// ── Feature 1: Multi-token balance reader ──────────────────────────────────
async function readTokenBalance(walletAddress, tokenAddress) {
  try {
    const provider = new ethers.JsonRpcProvider(ARC_RPC);
    const contract = new ethers.Contract(tokenAddress, ERC20_BALANCE_ABI, provider);
    const [raw, decimals] = await Promise.all([
      contract.balanceOf(walletAddress),
      contract.decimals().catch(() => 6n)
    ]);
    return Number(ethers.formatUnits(raw, decimals)).toFixed(4);
  } catch { return null; }
}

// ── Feature 2: CCTP transfer tracker ────────────────────────────────────────
async function loadCctpTransfers(walletAddress) {
  const feed = document.getElementById("cctpFeed");
  if (!feed) return;
  feed.innerHTML = '<div class="status-row"><span>Loading CCTP transfers...</span></div>';
  try {
    const res = await fetch(`${ARCSCAN_API}/addresses/${walletAddress}/transactions?limit=10`);
    if (!res.ok) throw new Error("Arcscan unavailable");
    const data = await res.json();
    const txs = data.items || [];
    if (!txs.length) {
      feed.innerHTML = '<div class="status-row"><span>No transactions found for this address on Arc testnet.</span></div>';
      return;
    }
    feed.innerHTML = txs.slice(0, 8).map(tx => {
      const value = tx.value ? (Number(tx.value) / 1e6).toFixed(2) : "0";
      const ago = tx.timestamp ? timeAgo(new Date(tx.timestamp)) : "--";
      const short = (addr) => addr ? `${addr.slice(0,8)}...${addr.slice(-4)}` : "--";
      return `<div class="cctp-item">
        <div class="cctp-row">
          <span>Hash</span>
          <strong><a href="https://testnet.arcscan.app/tx/${tx.hash}" target="_blank" rel="noreferrer" class="text-link">${short(tx.hash)}</a></strong>
        </div>
        <div class="cctp-row">
          <span>From → To</span>
          <strong>${short(tx.from?.hash)} → ${short(tx.to?.hash)}</strong>
        </div>
        <div class="cctp-row">
          <span>Value</span><strong>${value} USDC</strong>
        </div>
        <div class="cctp-row">
          <span>Time</span><strong>${ago}</strong>
        </div>
      </div>`;
    }).join("");
  } catch (err) {
    feed.innerHTML = `<div class="status-row"><span>Could not load transfers: ${err.message}</span></div>`;
  }
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

// ── Feature 3: x402 payment header generator ────────────────────────────────
function generateX402Header(url, amount, recipient) {
  const amountInUnits = Math.floor(parseFloat(amount) * 1e6); // USDC 6 decimals
  const nonce = "0x" + crypto.getRandomValues(new Uint8Array(16)).reduce((a, b) => a + b.toString(16).padStart(2, "0"), "");
  const validAfter = Math.floor(Date.now() / 1000);
  const validBefore = validAfter + 3600; // 1 hour

  const header = {
    "x-payment": {
      "scheme": "exact",
      "network": "arc-testnet",
      "chainId": ARC_CHAIN_ID,
      "token": USDC_ADDRESS,
      "amount": amountInUnits.toString(),
      "payTo": recipient,
      "resource": url,
      "nonce": nonce,
      "validAfter": validAfter,
      "validBefore": validBefore,
      "authorization": "EIP-3009-transferWithAuthorization"
    }
  };

  return JSON.stringify(header, null, 2);
}

// ── Feature 4: Arc live feed ─────────────────────────────────────────────────
async function loadArcLiveFeed() {
  const feed = document.getElementById("arcLiveFeed");
  const tag = document.getElementById("feedStatusTag");
  if (!feed) return;
  try {
    const res = await fetch(`${ARCSCAN_API}/transactions?limit=10&sort=desc`);
    if (!res.ok) throw new Error("Feed unavailable");
    const data = await res.json();
    const txs = data.items || [];
    if (!txs.length) { feed.innerHTML = '<div class="status-row"><span>No transactions yet.</span></div>'; return; }
    feed.innerHTML = txs.map(tx => {
      const value = tx.value ? (Number(tx.value) / 1e6).toFixed(4) : "0";
      const ago = tx.timestamp ? timeAgo(new Date(tx.timestamp)) : "--";
      const short = h => h ? `${h.slice(0,10)}...${h.slice(-4)}` : "--";
      return `<div class="feed-item">
        <span class="feed-hash"><a href="https://testnet.arcscan.app/tx/${tx.hash}" target="_blank" rel="noreferrer" class="text-link">${short(tx.hash)}</a></span>
        <span class="feed-amount">${value} USDC</span>
        <span class="feed-time">${ago}</span>
      </div>`;
    }).join("");
    if (tag) { tag.textContent = "Live"; tag.className = "tag tag-success"; }
  } catch {
    if (tag) { tag.textContent = "Offline"; tag.className = "tag"; }
    feed.innerHTML = '<div class="status-row"><span>Could not reach Arcscan API. Try refreshing.</span></div>';
  }
}

// ── Feature 5: Wallet comparison ─────────────────────────────────────────────
async function compareWallets() {
  const addrA = document.getElementById("compareWalletA")?.value?.trim();
  const addrB = document.getElementById("compareWalletB")?.value?.trim();
  const status = document.getElementById("compareStatus");
  const result = document.getElementById("compareResult");

  if (!addrA || !addrB || !ethers.isAddress(addrA) || !ethers.isAddress(addrB)) {
    if (status) { status.textContent = "Please enter two valid 0x wallet addresses."; status.style.display = "block"; }
    return;
  }
  if (status) { status.textContent = "Loading wallet data..."; status.style.display = "block"; }

  const provider = new ethers.JsonRpcProvider(ARC_RPC);

  async function getWalletData(addr) {
    const [usdcBal, eurcBal, txCount, code] = await Promise.all([
      readTokenBalance(addr, USDC_ADDRESS),
      readTokenBalance(addr, EURC_ADDRESS),
      provider.getTransactionCount(addr).catch(() => "--"),
      provider.getCode(addr).catch(() => "0x")
    ]);
    const isContract = code && code !== "0x" && code !== "0x0";
    const score = Math.min(100, Math.floor(Number(txCount || 0) * 3.5 + parseFloat(usdcBal || "0") * 2));
    return { usdc: usdcBal || "--", eurc: eurcBal || "--", tx: txCount, type: isContract ? "Contract" : "EOA", score };
  }

  const [dataA, dataB] = await Promise.all([getWalletData(addrA), getWalletData(addrB)]);

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("compareAAddr", addrA.slice(0,20) + "..." + addrA.slice(-6));
  set("compareAUsdc", dataA.usdc + " USDC");
  set("compareAEurc", dataA.eurc + " EURC");
  set("compareATx", dataA.tx);
  set("compareAType", dataA.type);
  set("compareAScore", dataA.score);
  set("compareBAddr", addrB.slice(0,20) + "..." + addrB.slice(-6));
  set("compareBUsdc", dataB.usdc + " USDC");
  set("compareBEurc", dataB.eurc + " EURC");
  set("compareBTx", dataB.tx);
  set("compareBType", dataB.type);
  set("compareBScore", dataB.score);

  if (result) result.style.display = "grid";
  if (status) status.style.display = "none";
}

// ── Feature 6: AI agent ERC-8004 checker ─────────────────────────────────────
async function checkAgentRegistry() {
  const addr = document.getElementById("agentAddress")?.value?.trim();
  const result = document.getElementById("agentResult");
  if (!addr || !ethers.isAddress(addr)) { showToast("Enter a valid 0x address"); return; }

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  try {
    const provider = new ethers.JsonRpcProvider(ARC_RPC);

    // Check identity registry
    let identityStatus = "Not registered";
    try {
      const identityContract = new ethers.Contract(ERC8004_IDENTITY, IDENTITY_ABI, provider);
      const agent = await identityContract.getAgent(addr);
      if (agent && agent[0] !== ethers.ZeroAddress) identityStatus = "Registered ✓";
    } catch { identityStatus = "Not registered"; }

    // Check reputation count
    let repCount = "0";
    try {
      const repContract = new ethers.Contract(ERC8004_REPUTATION, REPUTATION_ABI, provider);
      const count = await repContract.getEventCount(addr);
      repCount = count.toString();
    } catch { repCount = "0"; }

    // Check validation
    let validationStatus = "Not validated";
    try {
      const valContract = new ethers.Contract(ERC8004_VALIDATION, VALIDATION_ABI, provider);
      const validated = await valContract.isValidated(addr);
      validationStatus = validated ? "Validated ✓" : "Not validated";
    } catch { validationStatus = "Not validated"; }

    set("agentIdentityStatus", identityStatus);
    set("agentReputationCount", repCount + " events");
    set("agentValidationStatus", validationStatus);
    if (result) result.style.display = "block";
  } catch (err) {
    showToast("Registry check failed: " + err.message);
  }
}

// ── Feature 7: Post-quantum badge + EURC/USYC in analyze ─────────────────────
async function loadMultiTokenBalances(walletAddress) {
  const [eurc, usyc] = await Promise.all([
    readTokenBalance(walletAddress, EURC_ADDRESS),
    readTokenBalance(walletAddress, USYC_ADDRESS),
  ]);
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val ?? "--"; };
  setEl("eurcBalanceValue", eurc ? eurc + " EURC" : "0.0000 EURC");
  setEl("usycBalanceValue", usyc ? usyc + " USYC" : "0.0000 USYC");

  // Post-quantum badge: wallet is NOT quantum ready yet (mainnet feature)
  const badge = document.getElementById("readinessBadge");
  if (badge) {
    badge.textContent = "Not yet (mainnet feature)";
    badge.style.color = "var(--muted)";
    badge.title = "Post-quantum wallet signatures arrive at Arc mainnet launch with SLH-DSA-SHA2-128s. Opt-in.";
  }
}

// ── Wallet connect ────────────────────────────────────────────────────────────
async function connectWalletMetaMask() {
  const btn = document.getElementById("walletConnectBtn");
  const label = document.getElementById("walletConnectLabel");
  if (!btn || !label) return;
  if (!window.ethereum) { showToast("No wallet found. Install MetaMask or Rabby."); return; }
  label.textContent = "Connecting..."; btn.disabled = true;
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (!accounts?.[0]) throw new Error("No account returned");
    const address = accounts[0];
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: ARC_CHAIN_ID_HEX }] });
    } catch {
      try {
        await window.ethereum.request({ method: "wallet_addEthereumChain", params: [{ chainId: ARC_CHAIN_ID_HEX, chainName: "Arc Testnet", nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 6 }, rpcUrls: [ARC_RPC], blockExplorerUrls: ["https://testnet.arcscan.app"] }] });
      } catch {}
    }
    if (els.walletInput) els.walletInput.value = address;
    state.wallet = address;
    btn.classList.add("connected");
    label.textContent = address.slice(0, 8) + "..." + address.slice(-4);
    showToast("Wallet connected. Running analysis...");
    await analyzeWallet(address, els.emailInput?.value?.trim() || "");
  } catch (err) {
    label.textContent = "Connect wallet to auto-fill";
    showToast(err.message || "Connection failed.");
  } finally { btn.disabled = false; }
}


function bindEvents() {
  els.profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    analyzeWallet(els.walletInput.value.trim(), els.emailInput.value.trim());
  });
  els.useDemoAddress.addEventListener('click', () => { els.walletInput.value = CONFIG.sampleAddress; updateJourneyAndIdentity(); showToast('Sample wallet loaded'); });
  els.saveProfileBtn.addEventListener('click', saveProfile);
  els.clearProfileBtn.addEventListener('click', clearProfile);
  els.copyShareLink.addEventListener('click', () => copyText(buildShareUrl(), 'Share link copied'));
  els.copySnapshot.addEventListener('click', () => copyText(buildSnapshotText(), 'Summary snapshot copied'));
  els.copyWalletBtn.addEventListener('click', () => copyText(els.walletInput.value.trim(), 'Wallet copied'));
  els.copyArcscanBtn.addEventListener('click', () => copyText(`${CONFIG.explorerUrl}/address/${els.walletInput.value.trim()}`, 'Arcscan link copied'));
  els.copyEmailBtn.addEventListener('click', () => copyText(els.emailInput.value.trim(), 'Email copied'));
  els.modalCopyEmail.addEventListener('click', () => copyText(els.emailInput.value.trim(), 'Email copied'));
  els.modalCopySummary.addEventListener('click', () => copyText(buildSnapshotText(), 'Summary copied'));
  els.refreshCommunityBtn.addEventListener('click', () => loadCommunityData(true));
  els.copyRuntimeConfigBtn.addEventListener('click', copyRuntimeConfig);
  els.copyPlannerSummary.addEventListener('click', copyPlannerSummary);
  els.resetPlanner.addEventListener('click', resetPlanner);
  POINT_RULES.forEach(rule => els[rule.key]?.addEventListener('input', calculatePlanner));
  els.openSignInModal.addEventListener('click', openModal);
  els.openSignInModalHero.addEventListener('click', openModal);
  els.openSignInFromIdentity.addEventListener('click', openModal);
  els.closeSignInModal.addEventListener('click', closeModal);
  els.signInModal.addEventListener('click', (e) => { if (e.target?.dataset?.closeModal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  document.addEventListener('click', (e) => {
    const act = e.target.closest('[data-activity-filter]');
    if (act) {
      state.activityFilter = act.dataset.activityFilter;
      renderActivityFilters();
      renderActivities(els.activityNote.classList.contains('hidden') ? '' : els.activityNote.textContent);
    }
    const com = e.target.closest('[data-community-filter]');
    if (com) {
      state.communityFilter = com.dataset.communityFilter;
      renderCommunityFilters();
      renderCommunity();
    }
  });

  [els.walletInput, els.emailInput].forEach(input => input.addEventListener("input", () => {
    updateJourneyAndIdentity();
    setBanner("", "");
  }));

  // Wallet connect
  document.getElementById("walletConnectBtn")?.addEventListener("click", connectWalletMetaMask);

  // CCTP refresh
  document.getElementById("refreshCctpBtn")?.addEventListener("click", () => {
    if (state.wallet) loadCctpTransfers(state.wallet);
    else showToast("Analyze a wallet first.");
  });

  // Live feed refresh
  document.getElementById("refreshFeedBtn")?.addEventListener("click", loadArcLiveFeed);

  // Wallet compare
  document.getElementById("compareBtn")?.addEventListener("click", compareWallets);

  // x402 simulator
  document.getElementById("x402GenerateBtn")?.addEventListener("click", () => {
    const url = document.getElementById("x402Url")?.value?.trim();
    const amount = document.getElementById("x402Amount")?.value?.trim();
    const recipient = document.getElementById("x402Recipient")?.value?.trim();
    if (!url || !amount) { showToast("Enter a URL and amount."); return; }
    const header = generateX402Header(url, amount, recipient || USDC_ADDRESS);
    const output = document.getElementById("x402Output");
    const headerEl = document.getElementById("x402Header");
    const copyBtn = document.getElementById("x402CopyBtn");
    if (headerEl) headerEl.textContent = header;
    if (output) output.style.display = "block";
    if (copyBtn) copyBtn.style.display = "inline-flex";
  });

  document.getElementById("x402CopyBtn")?.addEventListener("click", () => {
    const header = document.getElementById("x402Header")?.textContent;
    if (header) { navigator.clipboard?.writeText(header); showToast("x402 header copied."); }
  });

  // Agent checker
  document.getElementById("checkAgentBtn")?.addEventListener("click", checkAgentRegistry);

  // Analyze button
  document.getElementById("analyzeBtn")?.addEventListener("click", () => {
    analyzeWallet(els.walletInput?.value?.trim(), els.emailInput?.value?.trim());
  });

  [els.walletInput, els.emailInput].forEach(input => {
    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") analyzeWallet(els.walletInput?.value?.trim(), els.emailInput?.value?.trim());
    });
  });
}

function init() {
  renderActivityFilters();
  renderCommunityFilters();
  renderCommunity();
  loadCommunityData();
  calculatePlanner();
  updateConnectedModeCard();
  updateJourneyAndIdentity();
  resetWalletViews();
  setWalletInsightDefaults();
  refreshNetworkPanel();
  setInterval(refreshNetworkPanel, 30000);
  startLiveFeed();
  bindEvents();

  const params = new URLSearchParams(window.location.search);
  const queryWallet = params.get('address') || '';
  const queryEmail = params.get('email') || '';
  let restored = false;
  if (queryWallet || queryEmail) {
    if (queryWallet) els.walletInput.value = queryWallet;
    if (queryEmail) els.emailInput.value = queryEmail;
    updateJourneyAndIdentity();
    restored = true;
    setBanner('info', 'Loaded profile values from the shared link.');
  } else if (loadSavedProfile()) {
    updateJourneyAndIdentity();
    restored = true;
    setBanner('info', 'Loaded your saved ArcLume profile mode from local storage.');
  }

  if (restored) showToast('Profile restored');
  if (queryWallet && ethers.isAddress(queryWallet)) analyzeWallet(queryWallet, queryEmail);

  // Start live feed on load
  loadArcLiveFeed();
  setInterval(loadArcLiveFeed, 30000);
}

init();
