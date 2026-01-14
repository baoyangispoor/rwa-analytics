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
    connected: false,
    walletType: null // 'metamask', 'okx', 'binance'
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
    
    // Wallet Modal
    walletModal: document.getElementById('wallet-modal'),
    walletModalClose: document.getElementById('wallet-modal-close'),
    
    // Binance QR Modal
    binanceQrModal: document.getElementById('binance-qr-modal'),
    binanceQrClose: document.getElementById('binance-qr-close'),
    binanceQrCode: document.getElementById('binance-qr-code'),
    qrStatus: document.getElementById('qr-status'),
    qrCancel: document.getElementById('qr-cancel'),
    
    // Transaction Modal
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
        elements.connectWalletBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Connect wallet button clicked');
            showWalletModal();
        });
    } else {
        console.error('Connect wallet button not found');
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
        // Use shorter debounce for better UX
        elements.swapFromAmount.addEventListener('input', debounce(handleSwapInput, 300));
        // Also trigger on paste
        elements.swapFromAmount.addEventListener('paste', () => {
            setTimeout(() => handleSwapInput(), 100);
        });
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
    
    // Wallet Modal
    if (elements.walletModalClose) {
        elements.walletModalClose.addEventListener('click', hideWalletModal);
    }
    
    // Wallet Options - Use event delegation for better reliability
    if (elements.walletModal) {
        const walletModalBody = elements.walletModal.querySelector('.modal-body');
        if (walletModalBody) {
            walletModalBody.addEventListener('click', (e) => {
                const walletOption = e.target.closest('.wallet-option');
                if (walletOption) {
                    e.preventDefault();
                    e.stopPropagation();
                    const walletType = walletOption.dataset.wallet;
                    if (walletType) {
                        console.log('Wallet option clicked:', walletType);
                        handleWalletSelection(walletType);
                    }
                }
            });
        }
        
        // Close modal when clicking background
        elements.walletModal.addEventListener('click', (e) => {
            if (e.target === elements.walletModal) {
                hideWalletModal();
            }
        });
    }
    
    // Fallback: bind directly to options after a short delay
    setTimeout(() => {
        const walletOptions = document.querySelectorAll('.wallet-option');
        walletOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const walletType = option.dataset.wallet;
                if (walletType) {
                    console.log('Wallet option clicked (direct):', walletType);
                    handleWalletSelection(walletType);
                }
            });
        });
    }, 300);
    
    // Binance QR Modal
    if (elements.binanceQrClose) {
        elements.binanceQrClose.addEventListener('click', hideBinanceQrModal);
    }
    if (elements.qrCancel) {
        elements.qrCancel.addEventListener('click', hideBinanceQrModal);
    }
    
    // Transaction Modal
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
        // Only auto-connect if user explicitly connected before
        // Don't auto-connect on page load to allow account selection
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0 && userState.connected) {
            // Only reconnect if we were previously connected
            // This prevents auto-connecting on page load
            userState.account = accounts[0];
            if (typeof ethers !== 'undefined') {
                provider = new ethers.providers.Web3Provider(window.ethereum);
                signer = provider.getSigner();
                await updateUserBalances();
            }
            updateUI();
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
            // Step 1: Check existing permissions and revoke if needed
            try {
                const permissions = await window.ethereum.request({
                    method: 'wallet_getPermissions'
                });
                
                // If permissions exist, revoke them first to force fresh selection
                if (permissions && permissions.length > 0) {
                    for (const permission of permissions) {
                        try {
                            await window.ethereum.request({
                                method: 'wallet_revokePermissions',
                                params: [permission]
                            });
                        } catch (revokeError) {
                            console.log('Could not revoke permission:', revokeError);
                            // Continue anyway
                        }
                    }
                    // Small delay to ensure revocation is processed
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            } catch (permCheckError) {
                console.log('Permission check failed:', permCheckError);
                // Continue anyway
            }
            
            // Step 2: Request new permissions (this will show account selection)
            try {
                await window.ethereum.request({
                    method: 'wallet_requestPermissions',
                    params: [{ eth_accounts: {} }]
                });
            } catch (permError) {
                // If user denies permission, handle it
                if (permError.code === 4001) {
                    hideLoading();
                    showNotification('用户取消了连接', 'warning');
                    return;
                }
                console.log('Permission request failed, trying direct account request');
            }
            
            // Step 3: Get accounts (should show selection dialog if multiple accounts)
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            if (accounts.length === 0) {
                throw new Error('未选择账户');
            }
            
            // Use the selected account
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
        
        if (error.code === 4001) {
            showNotification('用户取消了连接', 'warning');
        } else {
            showNotification('连接钱包失败: ' + error.message, 'error');
        }
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
async function disconnectWallet() {
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
    userState.walletType = null;
    signer = null;
    
    // Clear swap inputs
    if (elements.swapFromAmount) elements.swapFromAmount.value = '';
    if (elements.swapToAmount) elements.swapToAmount.value = '';
    resetSwapInfo();
    
    // Try to revoke permissions to ensure fresh connection next time
    if (typeof window.ethereum !== 'undefined') {
        try {
            const permissions = await window.ethereum.request({
                method: 'wallet_getPermissions'
            });
            
            if (permissions && permissions.length > 0) {
                for (const permission of permissions) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_revokePermissions',
                            params: [permission]
                        });
                    } catch (revokeError) {
                        console.log('Could not revoke permission:', revokeError);
                    }
                }
            }
        } catch (error) {
            console.log('Error revoking permissions:', error);
            // Continue anyway - permissions will be revoked on next connect
        }
    }
    
    updateUI();
    showNotification('钱包已断开，下次连接时可重新选择账户', 'warning');
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
        if (!fromToken || !toToken || !amount || amount <= 0) {
            throw new Error('无效的交换参数');
        }
        
        const fromAddress = CONFIG.tokens[fromToken]?.address;
        const toAddress = CONFIG.tokens[toToken]?.address;
        const decimals = CONFIG.tokens[fromToken]?.decimals;
        
        if (!fromAddress || !toAddress || !decimals) {
            throw new Error('代币配置错误');
        }
        
        // Convert amount to wei/smallest unit
        const amountInWei = ethers.utils.parseUnits(amount.toString(), decimals).toString();
        
        // Build 1inch API URL
        const url = `${CONFIG.oneInchApiUrl}/quote?fromTokenAddress=${fromAddress}&toTokenAddress=${toAddress}&amount=${amountInWei}`;
        
        console.log('Fetching quote from 1inch:', { fromToken, toToken, amount });
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            console.error('1inch API error:', response.status, errorText);
            throw new Error(`获取报价失败: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.toTokenAmount) {
            throw new Error('无效的报价响应');
        }
        
        console.log('Quote received:', {
            fromAmount: amount,
            toAmount: ethers.utils.formatUnits(data.toTokenAmount, CONFIG.tokens[toToken].decimals)
        });
        
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
    
    // Clear output if no input
    if (fromAmount <= 0 || isNaN(fromAmount)) {
        elements.swapToAmount.value = '';
        elements.swapBtn.disabled = true;
        resetSwapInfo();
        return;
    }
    
    // Check if same token
    if (fromToken === toToken) {
        elements.swapToAmount.value = fromAmount.toFixed(6);
        elements.swapBtn.disabled = true;
        showNotification('不能交换相同的代币', 'warning');
        return;
    }
    
    // Check balance (only if wallet connected)
    if (userState.connected) {
        const balance = userState.balances[fromToken] || 0;
        if (fromAmount > balance) {
            elements.swapBtn.disabled = true;
            showNotification('余额不足', 'error');
            // Still show quote even if balance insufficient
        }
    }
    
    try {
        // Show loading indicator
        if (elements.swapToAmount) {
            elements.swapToAmount.value = '计算中...';
        }
        
        // Get quote from 1inch API
        const quote = await getQuote(fromToken, toToken, fromAmount);
        
        if (!quote || !quote.toTokenAmount) {
            throw new Error('无法获取报价');
        }
        
        const toDecimals = CONFIG.tokens[toToken].decimals;
        const amountOut = parseFloat(ethers.utils.formatUnits(quote.toTokenAmount, toDecimals));
        
        // Display output amount
        if (elements.swapToAmount) {
            elements.swapToAmount.value = amountOut.toFixed(6);
            elements.swapToAmount.style.color = '';
        }
        
        // Store quote for later use
        swapState.quote = quote;
        
        // Calculate and display price impact
        let priceImpact = 0;
        if (quote.estimatedGas && quote.fromTokenAmount) {
            // More accurate price impact calculation
            const fromAmountWei = ethers.utils.parseUnits(fromAmount.toString(), CONFIG.tokens[fromToken].decimals);
            const expectedOut = parseFloat(ethers.utils.formatUnits(quote.fromTokenAmount, CONFIG.tokens[fromToken].decimals));
            if (expectedOut > 0) {
                priceImpact = Math.abs((fromAmount - expectedOut) / fromAmount * 100);
            }
        }
        
        // Use 1inch's price impact if available
        if (quote.estimatedGas) {
            // Simplified price impact from gas estimate
            priceImpact = Math.min(parseFloat(quote.estimatedGas) / 1000000, 10);
        }
        
        swapState.priceImpact = priceImpact;
        if (elements.priceImpact) {
            elements.priceImpact.textContent = priceImpact.toFixed(2) + '%';
            elements.priceImpact.style.color = priceImpact > 5 ? '#EF4444' : priceImpact > 1 ? '#F59E0B' : '#10B981';
        }
        
        // Min received (1% slippage tolerance)
        const minReceived = amountOut * 0.99;
        if (elements.minReceived) {
            elements.minReceived.textContent = minReceived.toFixed(6) + ' ' + toToken;
        }
        
        // Gas estimate
        let gasEstimate = '~$0';
        if (quote.estimatedGas) {
            try {
                let gasPrice;
                if (provider) {
                    gasPrice = await provider.getGasPrice();
                } else {
                    // Fallback gas price if no provider
                    gasPrice = ethers.utils.parseUnits('20', 'gwei');
                }
                const gasCost = gasPrice.mul(quote.estimatedGas);
                const gasCostEth = parseFloat(ethers.utils.formatEther(gasCost));
                const ethPrice = 2000; // Simplified - would fetch from API
                const gasCostUsd = gasCostEth * ethPrice;
                gasEstimate = `~$${gasCostUsd.toFixed(2)}`;
                swapState.gasEstimate = gasCostEth;
            } catch (gasError) {
                console.log('Could not calculate gas:', gasError);
                gasEstimate = '~$0';
            }
        }
        
        if (elements.gasEstimate) {
            elements.gasEstimate.textContent = gasEstimate;
        }
        
        // Best DEX (from 1inch protocol name)
        let bestDex = '1inch';
        if (quote.protocols && quote.protocols.length > 0) {
            const firstProtocol = quote.protocols[0];
            if (Array.isArray(firstProtocol) && firstProtocol.length > 0) {
                const protocolInfo = firstProtocol[0];
                if (Array.isArray(protocolInfo) && protocolInfo.length > 0) {
                    bestDex = protocolInfo[0]?.name || '1inch';
                }
            }
        }
        
        if (elements.bestDex) {
            elements.bestDex.textContent = bestDex;
        }
        swapState.bestDex = bestDex;
        
        // Enable swap button (only if wallet connected)
        if (elements.swapBtn) {
            elements.swapBtn.disabled = !userState.connected || fromAmount <= 0;
        }
        
    } catch (error) {
        console.error('Error in handleSwapInput:', error);
        
        // Clear output on error
        if (elements.swapToAmount) {
            elements.swapToAmount.value = '';
        }
        
        // Disable swap button
        if (elements.swapBtn) {
            elements.swapBtn.disabled = true;
        }
        
        // Reset swap info
        resetSwapInfo();
        
        // Show error notification (but don't be too intrusive)
        if (error.message && !error.message.includes('用户取消')) {
            showNotification('获取报价失败，请稍后重试', 'error');
        }
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
            const walletName = userState.walletType === 'metamask' ? 'MetaMask' : 
                              userState.walletType === 'okx' ? 'OKX' : 
                              userState.walletType === 'binance' ? '币安' : '钱包';
            elements.walletAddress.textContent = `${walletName}: ${userState.account.slice(0, 6)}...${userState.account.slice(-4)}`;
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

// Show Wallet Selection Modal
function showWalletModal() {
    console.log('showWalletModal called');
    if (elements.walletModal) {
        elements.walletModal.style.display = 'flex';
        console.log('Wallet modal displayed');
        // Ensure modal is on top
        elements.walletModal.style.zIndex = '1000';
    } else {
        console.error('Wallet modal element not found');
    }
}

// Hide Wallet Selection Modal
function hideWalletModal() {
    if (elements.walletModal) {
        elements.walletModal.style.display = 'none';
    }
}

// Handle Wallet Selection
async function handleWalletSelection(walletType) {
    console.log('handleWalletSelection called with:', walletType);
    hideWalletModal();
    
    if (!walletType) {
        showNotification('未选择钱包类型', 'error');
        return;
    }
    
    switch(walletType) {
        case 'metamask':
            await connectMetaMask();
            break;
        case 'okx':
            await connectOKX();
            break;
        case 'binance':
            await connectBinance();
            break;
        default:
            showNotification('未知的钱包类型: ' + walletType, 'error');
    }
}

// Connect MetaMask
async function connectMetaMask() {
    try {
        if (typeof window.ethereum === 'undefined' || !window.ethereum.isMetaMask) {
            showNotification('请安装MetaMask钱包', 'error');
            window.open('https://metamask.io/download/', '_blank');
            return;
        }
        
        showLoading('连接MetaMask中...');
        
        // Step 1: Clear any existing connection state
        userState.account = null;
        userState.connected = false;
        userState.walletType = null;
        provider = null;
        signer = null;
        
        // Step 2: Revoke ALL existing permissions to force account selection
        try {
            const permissions = await window.ethereum.request({
                method: 'wallet_getPermissions'
            });
            
            if (permissions && permissions.length > 0) {
                console.log('Revoking existing permissions...');
                for (const permission of permissions) {
                    try {
                        // Revoke the entire permission object
                        await window.ethereum.request({
                            method: 'wallet_revokePermissions',
                            params: [{ eth_accounts: permission.caveats }]
                        });
                    } catch (revokeError) {
                        // Try alternative revocation method
                        try {
                            await window.ethereum.request({
                                method: 'wallet_revokePermissions',
                                params: [permission]
                            });
                        } catch (altError) {
                            console.log('Could not revoke permission:', altError);
                        }
                    }
                }
                // Wait longer to ensure revocation is processed
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        } catch (permCheckError) {
            console.log('Permission check failed, continuing anyway:', permCheckError);
        }
        
        // Step 3: Clear localStorage cache (if any)
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.includes('metamask') || key.includes('wallet') || key.includes('account')) {
                    localStorage.removeItem(key);
                }
            });
        } catch (storageError) {
            console.log('Could not clear localStorage:', storageError);
        }
        
        // Step 4: Request new permissions (this will show account selection)
        try {
            await window.ethereum.request({
                method: 'wallet_requestPermissions',
                params: [{ eth_accounts: {} }]
            });
        } catch (permError) {
            if (permError.code === 4001) {
                hideLoading();
                showNotification('用户取消了连接', 'warning');
                return;
            }
            console.log('Permission request error, trying direct account request:', permError);
        }
        
        // Step 5: Get accounts (should show selection dialog if multiple accounts)
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        if (accounts.length === 0) {
            throw new Error('未选择账户');
        }
        
        userState.account = accounts[0];
        userState.walletType = 'metamask';
        
        if (typeof ethers !== 'undefined') {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            await updateUserBalances();
        }
        
        userState.connected = true;
        updateUI();
        
        hideLoading();
        showNotification('MetaMask连接成功', 'success');
    } catch (error) {
        hideLoading();
        if (error.code === 4001) {
            showNotification('用户取消了连接', 'warning');
        } else {
            showNotification('连接MetaMask失败: ' + error.message, 'error');
        }
        console.error('MetaMask connection error:', error);
    }
}

// Connect OKX Wallet
async function connectOKX() {
    try {
        if (typeof window.okxwallet === 'undefined') {
            showNotification('请安装OKX钱包', 'error');
            window.open('https://www.okx.com/web3', '_blank');
            return;
        }
        
        showLoading('连接OKX钱包中...');
        
        // Clear existing connection state
        userState.account = null;
        userState.connected = false;
        userState.walletType = null;
        provider = null;
        signer = null;
        
        // Try to revoke permissions if OKX supports it
        try {
            if (window.okxwallet.request) {
                const permissions = await window.okxwallet.request({
                    method: 'wallet_getPermissions'
                }).catch(() => null);
                
                if (permissions && permissions.length > 0) {
                    for (const permission of permissions) {
                        try {
                            await window.okxwallet.request({
                                method: 'wallet_revokePermissions',
                                params: [permission]
                            });
                        } catch (e) {
                            // OKX may not support revocation, continue anyway
                        }
                    }
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }
        } catch (e) {
            // OKX may not support permission management, continue
        }
        
        // Request accounts (should show selection if multiple)
        const accounts = await window.okxwallet.request({ 
            method: 'eth_requestAccounts' 
        });
        
        if (accounts.length === 0) {
            throw new Error('未选择账户');
        }
        
        userState.account = accounts[0];
        userState.walletType = 'okx';
        
        if (typeof ethers !== 'undefined') {
            provider = new ethers.providers.Web3Provider(window.okxwallet);
            signer = provider.getSigner();
            await updateUserBalances();
        }
        
        userState.connected = true;
        updateUI();
        
        hideLoading();
        showNotification('OKX钱包连接成功', 'success');
    } catch (error) {
        hideLoading();
        if (error.code === 4001) {
            showNotification('用户取消了连接', 'warning');
        } else {
            showNotification('连接OKX钱包失败: ' + error.message, 'error');
        }
        console.error('OKX connection error:', error);
    }
}

// Connect Binance Wallet (with QR code)
async function connectBinance() {
    try {
        if (typeof window.BinanceChain === 'undefined') {
            // Show QR code modal for mobile wallet
            showBinanceQrModal();
            return;
        }
        
        // Desktop extension
        showLoading('连接币安钱包中...');
        
        // Clear existing connection state
        userState.account = null;
        userState.connected = false;
        userState.walletType = null;
        provider = null;
        signer = null;
        
        // Request accounts (should show selection if multiple)
        const accounts = await window.BinanceChain.request({ 
            method: 'eth_requestAccounts' 
        });
        
        if (accounts.length === 0) {
            throw new Error('未选择账户');
        }
        
        userState.account = accounts[0];
        userState.walletType = 'binance';
        
        if (typeof ethers !== 'undefined') {
            provider = new ethers.providers.Web3Provider(window.BinanceChain);
            signer = provider.getSigner();
            await updateUserBalances();
        }
        
        userState.connected = true;
        updateUI();
        
        hideLoading();
        showNotification('币安钱包连接成功', 'success');
    } catch (error) {
        hideLoading();
        if (error.code === 4001) {
            showNotification('用户取消了连接', 'warning');
        } else {
            showNotification('连接币安钱包失败: ' + error.message, 'error');
        }
        console.error('Binance connection error:', error);
    }
}

// Show Binance QR Code Modal
async function showBinanceQrModal() {
    if (!elements.binanceQrModal) return;
    
    elements.binanceQrModal.style.display = 'flex';
    if (elements.qrStatus) {
        elements.qrStatus.textContent = '等待扫描...';
        elements.qrStatus.className = 'qr-status';
    }
    
    try {
        // Generate connection URI for WalletConnect or similar
        // For Binance Wallet, we'll use a connection string
        const connectionUri = `bsc:${Date.now()}`;
        
        // Generate QR code
        if (typeof QRCode !== 'undefined' && elements.binanceQrCode) {
            elements.binanceQrCode.innerHTML = '';
            QRCode.toCanvas(elements.binanceQrCode, connectionUri, {
                width: 256,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }, (error) => {
                if (error) {
                    console.error('QR code generation error:', error);
                    if (elements.binanceQrCode) {
                        elements.binanceQrCode.innerHTML = '<p style="color: var(--text-secondary);">二维码生成失败</p>';
                    }
                }
            });
        } else {
            if (elements.binanceQrCode) {
                elements.binanceQrCode.innerHTML = '<p style="color: var(--text-secondary);">请使用币安钱包App扫描连接</p>';
            }
        }
        
        // Poll for connection (simplified - in production use WalletConnect)
        pollBinanceConnection();
    } catch (error) {
        console.error('Error showing QR code:', error);
        showNotification('显示二维码失败', 'error');
    }
}

// Hide Binance QR Modal
function hideBinanceQrModal() {
    if (elements.binanceQrModal) {
        elements.binanceQrModal.style.display = 'none';
    }
}

// Poll for Binance connection
function pollBinanceConnection() {
    let attempts = 0;
    const maxAttempts = 60; // 30 seconds
    
    const pollInterval = setInterval(async () => {
        attempts++;
        
        if (attempts > maxAttempts) {
            clearInterval(pollInterval);
            if (elements.qrStatus) {
                elements.qrStatus.textContent = '连接超时，请重试';
                elements.qrStatus.className = 'qr-status error';
            }
            return;
        }
        
        // Check if Binance wallet is now available
        if (typeof window.BinanceChain !== 'undefined') {
            try {
                const accounts = await window.BinanceChain.request({ 
                    method: 'eth_accounts' 
                });
                
                if (accounts.length > 0) {
                    clearInterval(pollInterval);
                    
                    userState.account = accounts[0];
                    userState.walletType = 'binance';
                    
                    if (typeof ethers !== 'undefined') {
                        provider = new ethers.providers.Web3Provider(window.BinanceChain);
                        signer = provider.getSigner();
                        await updateUserBalances();
                    }
                    
                    userState.connected = true;
                    updateUI();
                    
                    hideBinanceQrModal();
                    showNotification('币安钱包连接成功', 'success');
                }
            } catch (error) {
                console.log('Polling error:', error);
            }
        }
    }, 500);
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
