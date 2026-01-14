// DEX Aggregator Configuration
const CONFIG = {
    chainId: 1, // Ethereum Mainnet
    oneInchApiUrl: 'https://api.1inch.io/v5.0/1',
    tokens: {
        ETH: {
            symbol: 'ETH',
            decimals: 18,
            address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' // ETH native token address
        },
        USDT: {
            symbol: 'USDT',
            decimals: 6,
            address: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
        },
        USDC: {
            symbol: 'USDC',
            decimals: 6,
            address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
        },
        DAI: {
            symbol: 'DAI',
            decimals: 18,
            address: '0x6B175474E89094C44Da98b954EedeAC495271d0F'
        },
        WBTC: {
            symbol: 'WBTC',
            decimals: 8,
            address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
        }
    }
};

// User State
let userState = {
    account: null,
    balances: {},
    connected: false
};

// Swap State
let swapState = {
    quote: null,
    gasEstimate: null,
    bestDex: null,
    priceImpact: 0
};

// Provider and Signer
let provider = null;
let signer = null;

// DOM Elements
const elements = {
    connectWalletBtn: document.getElementById('connect-wallet-btn'),
    walletInfo: document.getElementById('wallet-info'),
    walletAddress: document.getElementById('wallet-address'),
    walletBalance: document.getElementById('wallet-balance'),
    switchWalletBtn: document.getElementById('switch-wallet-btn'),
    disconnectWalletBtn: document.getElementById('disconnect-wallet-btn'),
    
    // Swap
    swapFromAmount: document.getElementById('swap-from-amount'),
    swapFromToken: document.getElementById('swap-from-token'),
    swapToAmount: document.getElementById('swap-to-amount'),
    swapToToken: document.getElementById('swap-to-token'),
    swapFromBalance: document.getElementById('swap-from-balance'),
    swapToBalance: document.getElementById('swap-to-balance'),
    priceImpact: document.getElementById('price-impact'),
    minReceived: document.getElementById('min-received'),
    gasEstimate: document.getElementById('gas-estimate'),
    bestDex: document.getElementById('best-dex'),
    swapBtn: document.getElementById('swap-btn'),
    swapReverseBtn: document.getElementById('swap-reverse-btn'),
    maxFromBtn: document.getElementById('max-from-btn'),
    
    // Modal
    txModal: document.getElementById('tx-modal'),
    modalClose: document.getElementById('modal-close'),
    modalCancel: document.getElementById('modal-cancel'),
    modalConfirm: document.getElementById('modal-confirm'),
    txDetails: document.getElementById('tx-details'),
    
    // Loading
    loadingOverlay: document.getElementById('loading-overlay'),
    loadingText: document.getElementById('loading-text'),
    notification: document.getElementById('notification'),
    
    // Transaction History
    txHistoryCard: document.getElementById('tx-history-card'),
    txList: document.getElementById('tx-list')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Initialize App
function initializeApp() {
    console.log('Initializing DEX Aggregator...');
    
    // Wait for ethers.js to load
    if (typeof ethers === 'undefined') {
        setTimeout(() => {
            if (typeof ethers === 'undefined') {
                enableDemoMode();
            } else {
                initializeApp();
            }
        }, 1000);
        return;
    }
    
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            setupEventListeners();
            checkConnection();
        } catch (error) {
            console.error('Error initializing provider:', error);
            enableDemoMode();
        }
    } else {
        console.log('MetaMask not detected, enabling demo mode');
        enableDemoMode();
    }
    
    updateUI();
}

// Enable Demo Mode
function enableDemoMode() {
    console.log('Enabling demo mode...');
    
    try {
        if (typeof ethers !== 'undefined') {
            provider = new ethers.providers.JsonRpcProvider('https://eth.llamarpc.com');
        }
    } catch (error) {
        console.error('Error creating demo provider:', error);
    }
    
    elements.connectWalletBtn.textContent = '连接钱包 (演示模式)';
    elements.connectWalletBtn.disabled = false;
    
    setupEventListeners();
    
    // Demo balances
    userState.balances = {
        ETH: 10,
        USDT: 10000,
        USDC: 10000,
        DAI: 10000,
        WBTC: 1
    };
    
    showNotification('演示模式：价格查询可用，交易需要真实钱包', 'warning');
}

// Setup Event Listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Wallet connection
    if (elements.connectWalletBtn) {
        elements.connectWalletBtn.addEventListener('click', connectWallet);
    }
    
    // Switch wallet
    if (elements.switchWalletBtn) {
        elements.switchWalletBtn.addEventListener('click', switchWallet);
    }
    
    // Disconnect wallet
    if (elements.disconnectWalletBtn) {
        elements.disconnectWalletBtn.addEventListener('click', disconnectWallet);
    }
    
    // Swap
    if (elements.swapFromAmount) {
        elements.swapFromAmount.addEventListener('input', debounce(handleSwapInput, 500));
    }
    if (elements.swapFromToken) {
        elements.swapFromToken.addEventListener('change', handleSwapInput);
    }
    if (elements.swapToToken) {
        elements.swapToToken.addEventListener('change', handleSwapInput);
    }
    if (elements.swapReverseBtn) {
        elements.swapReverseBtn.addEventListener('click', reverseSwapTokens);
    }
    if (elements.swapBtn) {
        elements.swapBtn.addEventListener('click', showSwapConfirmation);
    }
    if (elements.maxFromBtn) {
        elements.maxFromBtn.addEventListener('click', setMaxAmount);
    }
    
    // Modal
    if (elements.modalClose) {
        elements.modalClose.addEventListener('click', hideModal);
    }
    if (elements.modalCancel) {
        elements.modalCancel.addEventListener('click', hideModal);
    }
    if (elements.modalConfirm) {
        elements.modalConfirm.addEventListener('click', executeSwap);
    }
    
    // MetaMask events
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                disconnectWallet();
            } else {
                connectWallet();
            }
        });
        
        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if already connected
async function checkConnection() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            await connectWallet();
        }
    } catch (error) {
        console.error('Error checking connection:', error);
    }
}

// Connect Wallet
async function connectWallet() {
    try {
        showLoading('连接钱包中...');
        
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            if (accounts.length === 0) {
                throw new Error('未选择账户');
            }
            
            userState.account = accounts[0];
            
            if (typeof ethers !== 'undefined') {
                provider = new ethers.providers.Web3Provider(window.ethereum);
                signer = provider.getSigner();
                await updateUserBalances();
            } else {
                userState.account = '0x' + '0'.repeat(40);
                userState.balances = { ETH: 10, USDT: 10000, USDC: 10000, DAI: 10000, WBTC: 1 };
            }
        } else {
            userState.account = '0x' + '0'.repeat(40);
            userState.balances = { ETH: 10, USDT: 10000, USDC: 10000, DAI: 10000, WBTC: 1 };
            showNotification('演示模式：使用模拟钱包', 'warning');
        }
        
        userState.connected = true;
        updateUI();
        
        hideLoading();
        showNotification('钱包连接成功', 'success');
    } catch (error) {
        hideLoading();
        showNotification('连接钱包失败: ' + error.message, 'error');
        console.error('Wallet connection error:', error);
        
        if (!userState.connected) {
            enableDemoMode();
            userState.account = '0x' + '0'.repeat(40);
            userState.balances = { ETH: 10, USDT: 10000, USDC: 10000, DAI: 10000, WBTC: 1 };
            userState.connected = true;
            updateUI();
        }
    }
}

// Switch Wallet
async function switchWallet() {
    if (!userState.connected) {
        showNotification('请先连接钱包', 'error');
        return;
    }
    
    try {
        showLoading('切换钱包中...');
        
        // Request account switch
        if (typeof window.ethereum !== 'undefined') {
            // Request to switch accounts
            await window.ethereum.request({
                method: 'wallet_requestPermissions',
                params: [{ eth_accounts: {} }]
            });
            
            // Get new accounts
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            if (accounts.length > 0) {
                const oldAccount = userState.account;
                userState.account = accounts[0];
                
                if (typeof ethers !== 'undefined' && provider) {
                    signer = provider.getSigner();
                    await updateUserBalances();
                }
                
                updateUI();
                hideLoading();
                showNotification(`钱包已切换: ${oldAccount.slice(0, 6)}... → ${userState.account.slice(0, 6)}...`, 'success');
            } else {
                hideLoading();
                showNotification('未选择新账户', 'warning');
            }
        } else {
            hideLoading();
            showNotification('请安装MetaMask', 'error');
        }
    } catch (error) {
        hideLoading();
        if (error.code === 4001) {
            showNotification('用户取消了切换', 'warning');
        } else {
            showNotification('切换钱包失败: ' + error.message, 'error');
        }
        console.error('Switch wallet error:', error);
    }
}

// Disconnect Wallet
function disconnectWallet() {
    if (!userState.connected) {
        return;
    }
    
    const confirmed = confirm('确定要断开钱包连接吗？');
    if (!confirmed) {
        return;
    }
    
    userState.account = null;
    userState.connected = false;
    userState.balances = {};
    signer = null;
    
    // Clear swap inputs
    if (elements.swapFromAmount) elements.swapFromAmount.value = '';
    if (elements.swapToAmount) elements.swapToAmount.value = '';
    resetSwapInfo();
    
    updateUI();
    showNotification('钱包已断开', 'warning');
}

// Update User Balances
async function updateUserBalances() {
    if (!userState.connected || !signer) return;
    
    try {
        // Get ETH balance
        const ethBalance = await signer.getBalance();
        userState.balances.ETH = parseFloat(ethers.utils.formatEther(ethBalance));
        
        // Get ERC20 token balances (simplified - would need token contracts)
        // For demo, we'll use simulated balances
        userState.balances.USDT = 10000;
        userState.balances.USDC = 10000;
        userState.balances.DAI = 10000;
        userState.balances.WBTC = 1;
    } catch (error) {
        console.error('Error updating balances:', error);
    }
}

// Get Quote from 1inch API
async function getQuote(fromToken, toToken, amount) {
    try {
        const fromAddress = CONFIG.tokens[fromToken].address;
        const toAddress = CONFIG.tokens[toToken].address;
        const decimals = CONFIG.tokens[fromToken].decimals;
        
        // Convert amount to wei/smallest unit
        const amountInWei = ethers.utils.parseUnits(amount.toString(), decimals).toString();
        
        const url = `${CONFIG.oneInchApiUrl}/quote?fromTokenAddress=${fromAddress}&toTokenAddress=${toAddress}&amount=${amountInWei}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('获取报价失败');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting quote:', error);
        throw error;
    }
}

// Get Swap Data from 1inch API
async function getSwapData(fromToken, toToken, amount, slippage = 1) {
    try {
        const fromAddress = CONFIG.tokens[fromToken].address;
        const toAddress = CONFIG.tokens[toToken].address;
        const decimals = CONFIG.tokens[fromToken].decimals;
        
        const amountInWei = ethers.utils.parseUnits(amount.toString(), decimals).toString();
        
        const url = `${CONFIG.oneInchApiUrl}/swap?fromTokenAddress=${fromAddress}&toTokenAddress=${toAddress}&amount=${amountInWei}&fromAddress=${userState.account}&slippage=${slippage}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('获取交易数据失败');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting swap data:', error);
        throw error;
    }
}

// Handle Swap Input
async function handleSwapInput() {
    const fromAmount = parseFloat(elements.swapFromAmount.value) || 0;
    const fromToken = elements.swapFromToken.value;
    const toToken = elements.swapToToken.value;
    
    if (fromAmount <= 0) {
        elements.swapToAmount.value = '';
        elements.swapBtn.disabled = true;
        resetSwapInfo();
        return;
    }
    
    // Check balance
    const balance = userState.balances[fromToken] || 0;
    if (fromAmount > balance) {
        elements.swapBtn.disabled = true;
        showNotification('余额不足', 'error');
        return;
    }
    
    try {
        showLoading('获取最优报价...');
        
        // Get quote from 1inch
        const quote = await getQuote(fromToken, toToken, fromAmount);
        
        const toDecimals = CONFIG.tokens[toToken].decimals;
        const amountOut = parseFloat(ethers.utils.formatUnits(quote.toTokenAmount, toDecimals));
        
        elements.swapToAmount.value = amountOut.toFixed(6);
        
        // Calculate price impact
        const priceImpact = parseFloat(quote.estimatedGas) / 1000000; // Simplified
        swapState.priceImpact = priceImpact;
        elements.priceImpact.textContent = priceImpact.toFixed(2) + '%';
        elements.priceImpact.style.color = priceImpact > 5 ? '#EF4444' : '#10B981';
        
        // Min received (1% slippage)
        const minReceived = amountOut * 0.99;
        elements.minReceived.textContent = minReceived.toFixed(6) + ' ' + toToken;
        
        // Gas estimate (simplified)
        const gasPrice = await provider.getGasPrice();
        const gasCost = gasPrice.mul(quote.estimatedGas);
        const gasCostEth = parseFloat(ethers.utils.formatEther(gasCost));
        const ethPrice = 2000; // Simplified - would fetch from API
        const gasCostUsd = gasCostEth * ethPrice;
        elements.gasEstimate.textContent = `~$${gasCostUsd.toFixed(2)}`;
        
        // Best DEX (from 1inch protocol name)
        elements.bestDex.textContent = quote.protocols?.[0]?.[0]?.[0]?.name || '1inch';
        
        swapState.quote = quote;
        swapState.gasEstimate = gasCostEth;
        swapState.bestDex = elements.bestDex.textContent;
        
        // Enable swap button
        elements.swapBtn.disabled = !userState.connected || fromAmount <= 0;
        
        hideLoading();
    } catch (error) {
        hideLoading();
        console.error('Error getting quote:', error);
        showNotification('获取报价失败: ' + error.message, 'error');
        elements.swapBtn.disabled = true;
    }
}

// Reset Swap Info
function resetSwapInfo() {
    elements.priceImpact.textContent = '0%';
    elements.minReceived.textContent = '0';
    elements.gasEstimate.textContent = '~$0';
    elements.bestDex.textContent = '-';
    swapState.quote = null;
}

// Reverse Swap Tokens
function reverseSwapTokens() {
    const fromToken = elements.swapFromToken.value;
    const toToken = elements.swapToToken.value;
    const fromAmount = elements.swapFromAmount.value;
    const toAmount = elements.swapToAmount.value;
    
    elements.swapFromToken.value = toToken;
    elements.swapToToken.value = fromToken;
    elements.swapFromAmount.value = toAmount;
    elements.swapToAmount.value = fromAmount;
    
    if (fromAmount) {
        handleSwapInput();
    }
}

// Set Max Amount
function setMaxAmount() {
    const fromToken = elements.swapFromToken.value;
    const balance = userState.balances[fromToken] || 0;
    
    if (balance > 0) {
        // Reserve some for gas if ETH
        const maxAmount = fromToken === 'ETH' ? balance * 0.99 : balance;
        elements.swapFromAmount.value = maxAmount.toFixed(6);
        handleSwapInput();
    }
}

// Show Swap Confirmation Modal
function showSwapConfirmation() {
    if (!userState.connected) {
        showNotification('请先连接钱包', 'error');
        return;
    }
    
    const fromAmount = parseFloat(elements.swapFromAmount.value);
    const fromToken = elements.swapFromToken.value;
    const toAmount = parseFloat(elements.swapToAmount.value);
    const toToken = elements.swapToToken.value;
    
    if (!swapState.quote) {
        showNotification('请先获取报价', 'error');
        return;
    }
    
    // Populate modal
    elements.txDetails.innerHTML = `
        <div class="tx-detail-row">
            <span class="tx-detail-label">从</span>
            <span class="tx-detail-value">${fromAmount} ${fromToken}</span>
        </div>
        <div class="tx-detail-row">
            <span class="tx-detail-label">到</span>
            <span class="tx-detail-value">${toAmount.toFixed(6)} ${toToken}</span>
        </div>
        <div class="tx-detail-row">
            <span class="tx-detail-label">价格影响</span>
            <span class="tx-detail-value">${swapState.priceImpact.toFixed(2)}%</span>
        </div>
        <div class="tx-detail-row">
            <span class="tx-detail-label">最小收到</span>
            <span class="tx-detail-value">${(toAmount * 0.99).toFixed(6)} ${toToken}</span>
        </div>
        <div class="tx-detail-row">
            <span class="tx-detail-label">Gas费用</span>
            <span class="tx-detail-value">~${swapState.gasEstimate.toFixed(6)} ETH</span>
        </div>
        <div class="tx-detail-row">
            <span class="tx-detail-label">最优DEX</span>
            <span class="tx-detail-value">${swapState.bestDex}</span>
        </div>
    `;
    
    elements.txModal.style.display = 'flex';
}

// Hide Modal
function hideModal() {
    elements.txModal.style.display = 'none';
}

// Execute Swap
async function executeSwap() {
    if (!userState.connected || !signer) {
        showNotification('请先连接钱包', 'error');
        return;
    }
    
    const fromAmount = parseFloat(elements.swapFromAmount.value);
    const fromToken = elements.swapFromToken.value;
    const toToken = elements.swapToToken.value;
    
    try {
        hideModal();
        showLoading('执行交易中...');
        
        // Get swap data from 1inch
        const swapData = await getSwapData(fromToken, toToken, fromAmount, 1);
        
        // Execute transaction
        const tx = await signer.sendTransaction({
            to: swapData.tx.to,
            data: swapData.tx.data,
            value: swapData.tx.value || '0x0',
            gasLimit: swapData.tx.gas || 300000,
            gasPrice: swapData.tx.gasPrice
        });
        
        showLoading('等待交易确认...');
        elements.loadingText.textContent = `交易已提交: ${tx.hash}`;
        
        // Wait for confirmation
        const receipt = await tx.wait();
        
        // Update balances
        await updateUserBalances();
        
        // Add to transaction history
        addToTransactionHistory({
            hash: tx.hash,
            from: fromToken,
            to: toToken,
            fromAmount: fromAmount,
            toAmount: parseFloat(elements.swapToAmount.value),
            status: 'success',
            timestamp: Date.now()
        });
        
        // Clear inputs
        elements.swapFromAmount.value = '';
        elements.swapToAmount.value = '';
        resetSwapInfo();
        
        updateUI();
        hideLoading();
        showNotification(`交易成功！哈希: ${tx.hash.slice(0, 10)}...`, 'success');
        
    } catch (error) {
        hideLoading();
        console.error('Swap error:', error);
        
        if (error.code === 4001) {
            showNotification('用户取消了交易', 'warning');
        } else {
            showNotification('交易失败: ' + error.message, 'error');
        }
    }
}

// Add to Transaction History
function addToTransactionHistory(tx) {
    const txItem = document.createElement('div');
    txItem.className = 'tx-item';
    
    const time = new Date(tx.timestamp).toLocaleString('zh-CN');
    
    txItem.innerHTML = `
        <div class="tx-item-info">
            <div class="tx-item-amount">${tx.fromAmount} ${tx.from} → ${tx.toAmount.toFixed(6)} ${tx.to}</div>
            <div class="tx-item-time">${time}</div>
        </div>
        <div class="tx-item-status ${tx.status}">${tx.status === 'success' ? '成功' : tx.status === 'pending' ? '处理中' : '失败'}</div>
    `;
    
    elements.txList.insertBefore(txItem, elements.txList.firstChild);
    elements.txHistoryCard.style.display = 'block';
}

// Update UI
function updateUI() {
    // Wallet info
    if (userState.connected && userState.account) {
        if (elements.connectWalletBtn) {
            elements.connectWalletBtn.style.display = 'none';
        }
        if (elements.walletInfo) {
            elements.walletInfo.style.display = 'flex';
        }
        if (elements.walletAddress) {
            elements.walletAddress.textContent = `${userState.account.slice(0, 6)}...${userState.account.slice(-4)}`;
        }
        const ethBalance = userState.balances.ETH || 0;
        if (elements.walletBalance) {
            elements.walletBalance.textContent = `${ethBalance.toFixed(4)} ETH`;
        }
    } else {
        if (elements.connectWalletBtn) {
            elements.connectWalletBtn.style.display = 'block';
        }
        if (elements.walletInfo) {
            elements.walletInfo.style.display = 'none';
        }
    }
    
    // Swap balances
    const fromToken = elements.swapFromToken.value;
    const toToken = elements.swapToToken.value;
    elements.swapFromBalance.textContent = (userState.balances[fromToken] || 0).toFixed(4);
    elements.swapToBalance.textContent = (userState.balances[toToken] || 0).toFixed(4);
}

// Show Loading
function showLoading(text = '处理中...') {
    elements.loadingText.textContent = text;
    elements.loadingOverlay.style.display = 'flex';
}

// Hide Loading
function hideLoading() {
    elements.loadingOverlay.style.display = 'none';
}

// Show Notification
function showNotification(message, type = 'success') {
    elements.notification.textContent = message;
    elements.notification.className = `notification ${type}`;
    elements.notification.classList.add('show');
    
    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 3000);
}

// Auto-update balances
setInterval(() => {
    if (userState.connected) {
        updateUserBalances();
        updateUI();
    }
}, 30000); // Every 30 seconds

// Initial UI update
updateUI();
