// DEX Configuration
const CONFIG = {
    chainId: '0x1', // Ethereum Mainnet (测试时可以使用测试网)
    rpcUrl: 'https://eth.llamarpc.com', // 公共RPC节点
    tokens: {
        ETH: {
            symbol: 'ETH',
            decimals: 18,
            address: '0x0000000000000000000000000000000000000000' // ETH使用零地址
        },
        USDT: {
            symbol: 'USDT',
            decimals: 6,
            address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' // USDT主网地址
        }
    }
};

// AMM Pool State (模拟智能合约状态)
let poolState = {
    reserveETH: 0,
    reserveUSDT: 0,
    totalSupply: 0, // LP代币总供应量
    k: 0 // 恒定乘积 k = x * y
};

// User State
let userState = {
    account: null,
    balanceETH: 0,
    balanceUSDT: 0,
    lpBalance: 0,
    connected: false
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
    
    // Tabs
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Swap
    swapFromAmount: document.getElementById('swap-from-amount'),
    swapFromToken: document.getElementById('swap-from-token'),
    swapToAmount: document.getElementById('swap-to-amount'),
    swapToToken: document.getElementById('swap-to-token'),
    swapFromBalance: document.getElementById('swap-from-balance'),
    swapToBalance: document.getElementById('swap-to-balance'),
    priceImpact: document.getElementById('price-impact'),
    minReceived: document.getElementById('min-received'),
    swapBtn: document.getElementById('swap-btn'),
    swapReverseBtn: document.getElementById('swap-reverse-btn'),
    
    // Liquidity
    liquidityEthAmount: document.getElementById('liquidity-eth-amount'),
    liquidityUsdtAmount: document.getElementById('liquidity-usdt-amount'),
    liquidityEthBalance: document.getElementById('liquidity-eth-balance'),
    liquidityUsdtBalance: document.getElementById('liquidity-usdt-balance'),
    liquidityPrice: document.getElementById('liquidity-price'),
    liquidityShare: document.getElementById('liquidity-share'),
    addLiquidityBtn: document.getElementById('add-liquidity-btn'),
    removeLiquidityCard: document.getElementById('remove-liquidity-card'),
    removeLpAmount: document.getElementById('remove-lp-amount'),
    lpBalance: document.getElementById('lp-balance'),
    removeReceive: document.getElementById('remove-receive'),
    removeLiquidityBtn: document.getElementById('remove-liquidity-btn'),
    
    // Pool
    poolEthReserve: document.getElementById('pool-eth-reserve'),
    poolUsdtReserve: document.getElementById('pool-usdt-reserve'),
    poolTotalLiquidity: document.getElementById('pool-total-liquidity'),
    poolPrice: document.getElementById('pool-price'),
    poolAddBtn: document.getElementById('pool-add-btn'),
    poolRemoveBtn: document.getElementById('pool-remove-btn'),
    
    // Loading
    loadingOverlay: document.getElementById('loading-overlay'),
    loadingText: document.getElementById('loading-text'),
    notification: document.getElementById('notification')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Initialize App
function initializeApp() {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        setupEventListeners();
        checkConnection();
    } else {
        showNotification('请安装MetaMask钱包', 'error');
        elements.connectWalletBtn.textContent = '请安装MetaMask';
        elements.connectWalletBtn.disabled = true;
    }
    
    // Initialize pool with some default liquidity for demo
    initializePool();
    updateUI();
}

// Setup Event Listeners
function setupEventListeners() {
    // Wallet connection
    elements.connectWalletBtn.addEventListener('click', connectWallet);
    
    // Tab switching
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Swap
    elements.swapFromAmount.addEventListener('input', handleSwapInput);
    elements.swapFromToken.addEventListener('change', handleSwapInput);
    elements.swapReverseBtn.addEventListener('click', reverseSwapTokens);
    elements.swapBtn.addEventListener('click', executeSwap);
    
    // Liquidity
    elements.liquidityEthAmount.addEventListener('input', handleLiquidityInput);
    elements.liquidityUsdtAmount.addEventListener('input', handleLiquidityInput);
    elements.addLiquidityBtn.addEventListener('click', addLiquidity);
    elements.removeLpAmount.addEventListener('input', handleRemoveLiquidityInput);
    elements.removeLiquidityBtn.addEventListener('click', removeLiquidity);
    
    // Pool
    elements.poolAddBtn.addEventListener('click', () => switchTab('liquidity'));
    elements.poolRemoveBtn.addEventListener('click', () => {
        switchTab('liquidity');
        elements.removeLiquidityCard.style.display = 'block';
    });
    
    // MetaMask account change
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
        
        // Request account access
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        if (accounts.length === 0) {
            throw new Error('未选择账户');
        }
        
        userState.account = accounts[0];
        signer = provider.getSigner();
        userState.connected = true;
        
        await updateUserBalances();
        updateUI();
        
        hideLoading();
        showNotification('钱包连接成功', 'success');
    } catch (error) {
        hideLoading();
        showNotification('连接钱包失败: ' + error.message, 'error');
        console.error('Wallet connection error:', error);
    }
}

// Disconnect Wallet
function disconnectWallet() {
    userState.account = null;
    userState.connected = false;
    userState.balanceETH = 0;
    userState.balanceUSDT = 0;
    userState.lpBalance = 0;
    updateUI();
    showNotification('钱包已断开', 'warning');
}

// Update User Balances
async function updateUserBalances() {
    if (!userState.connected) return;
    
    try {
        // Get ETH balance
        const ethBalance = await signer.getBalance();
        userState.balanceETH = parseFloat(ethers.utils.formatEther(ethBalance));
        
        // For demo, simulate USDT balance (实际应该从合约读取)
        userState.balanceUSDT = 1000; // 模拟余额
        
        // Calculate LP balance based on user's contribution
        if (poolState.totalSupply > 0) {
            // 简化计算：假设用户持有一定比例的LP代币
            userState.lpBalance = poolState.totalSupply * 0.1; // 10% for demo
        }
    } catch (error) {
        console.error('Error updating balances:', error);
    }
}

// Initialize Pool (模拟初始流动性)
function initializePool() {
    // 设置初始流动性池：10 ETH + 20000 USDT (假设1 ETH = 2000 USDT)
    poolState.reserveETH = 10;
    poolState.reserveUSDT = 20000;
    poolState.totalSupply = Math.sqrt(poolState.reserveETH * poolState.reserveUSDT); // Uniswap V2公式
    poolState.k = poolState.reserveETH * poolState.reserveUSDT;
}

// Uniswap V2 AMM: Get Amount Out (恒定乘积公式)
function getAmountOut(amountIn, reserveIn, reserveOut) {
    if (amountIn === 0 || reserveIn === 0 || reserveOut === 0) {
        return 0;
    }
    
    // Uniswap V2公式: amountOut = (amountIn * 997 * reserveOut) / (reserveIn * 1000 + amountIn * 997)
    // 0.3% 手续费
    const amountInWithFee = amountIn * 997;
    const numerator = amountInWithFee * reserveOut;
    const denominator = reserveIn * 1000 + amountInWithFee;
    return numerator / denominator;
}

// Get Amount In (反向计算)
function getAmountIn(amountOut, reserveIn, reserveOut) {
    if (amountOut === 0 || reserveIn === 0 || reserveOut === 0) {
        return 0;
    }
    
    // amountIn = (reserveIn * amountOut * 1000) / ((reserveOut - amountOut) * 997)
    const numerator = reserveIn * amountOut * 1000;
    const denominator = (reserveOut - amountOut) * 997;
    return numerator / denominator;
}

// Calculate Price Impact
function calculatePriceImpact(amountIn, reserveIn, reserveOut) {
    if (reserveIn === 0 || reserveOut === 0) return 0;
    
    const spotPrice = reserveOut / reserveIn;
    const amountOut = getAmountOut(amountIn, reserveIn, reserveOut);
    const executionPrice = amountOut / amountIn;
    
    return Math.abs((executionPrice - spotPrice) / spotPrice) * 100;
}

// Handle Swap Input
function handleSwapInput() {
    const fromAmount = parseFloat(elements.swapFromAmount.value) || 0;
    const fromToken = elements.swapFromToken.value;
    const toToken = elements.swapToToken.value;
    
    if (fromAmount <= 0) {
        elements.swapToAmount.value = '';
        elements.swapBtn.disabled = true;
        return;
    }
    
    let amountOut = 0;
    let reserveIn, reserveOut;
    
    if (fromToken === 'ETH') {
        reserveIn = poolState.reserveETH;
        reserveOut = poolState.reserveUSDT;
    } else {
        reserveIn = poolState.reserveUSDT;
        reserveOut = poolState.reserveETH;
    }
    
    amountOut = getAmountOut(fromAmount, reserveIn, reserveOut);
    elements.swapToAmount.value = amountOut.toFixed(6);
    
    // Calculate price impact
    const impact = calculatePriceImpact(fromAmount, reserveIn, reserveOut);
    elements.priceImpact.textContent = impact.toFixed(2) + '%';
    elements.priceImpact.style.color = impact > 5 ? '#EF4444' : '#10B981';
    
    // Min received (0.5% slippage)
    const minReceived = amountOut * 0.995;
    elements.minReceived.textContent = minReceived.toFixed(6) + ' ' + toToken;
    
    // Enable/disable swap button
    const fromBalance = fromToken === 'ETH' ? userState.balanceETH : userState.balanceUSDT;
    elements.swapBtn.disabled = fromAmount > fromBalance || fromAmount <= 0;
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
    
    handleSwapInput();
}

// Execute Swap
async function executeSwap() {
    if (!userState.connected) {
        showNotification('请先连接钱包', 'error');
        return;
    }
    
    const fromAmount = parseFloat(elements.swapFromAmount.value);
    const fromToken = elements.swapFromToken.value;
    const toToken = elements.swapToToken.value;
    
    if (fromAmount <= 0) {
        showNotification('请输入有效金额', 'error');
        return;
    }
    
    try {
        showLoading('执行交换中...');
        
        // 模拟交易（实际应该调用智能合约）
        let reserveIn, reserveOut;
        
        if (fromToken === 'ETH') {
            reserveIn = poolState.reserveETH;
            reserveOut = poolState.reserveUSDT;
        } else {
            reserveIn = poolState.reserveUSDT;
            reserveOut = poolState.reserveETH;
        }
        
        const amountOut = getAmountOut(fromAmount, reserveIn, reserveOut);
        
        // 更新池子状态
        if (fromToken === 'ETH') {
            poolState.reserveETH += fromAmount;
            poolState.reserveUSDT -= amountOut;
        } else {
            poolState.reserveUSDT += fromAmount;
            poolState.reserveETH -= amountOut;
        }
        
        poolState.k = poolState.reserveETH * poolState.reserveUSDT;
        
        // 更新用户余额（模拟）
        if (fromToken === 'ETH') {
            userState.balanceETH -= fromAmount;
            userState.balanceUSDT += amountOut;
        } else {
            userState.balanceUSDT -= fromAmount;
            userState.balanceETH += amountOut;
        }
        
        // 清空输入
        elements.swapFromAmount.value = '';
        elements.swapToAmount.value = '';
        
        updateUI();
        hideLoading();
        showNotification(`成功交换 ${fromAmount} ${fromToken} → ${amountOut.toFixed(6)} ${toToken}`, 'success');
        
    } catch (error) {
        hideLoading();
        showNotification('交换失败: ' + error.message, 'error');
        console.error('Swap error:', error);
    }
}

// Handle Liquidity Input
function handleLiquidityInput() {
    const ethAmount = parseFloat(elements.liquidityEthAmount.value) || 0;
    const usdtAmount = parseFloat(elements.liquidityUsdtAmount.value) || 0;
    
    // 如果输入ETH，自动计算USDT
    if (ethAmount > 0 && usdtAmount === 0) {
        const currentPrice = poolState.reserveUSDT / poolState.reserveETH;
        const calculatedUsdt = ethAmount * currentPrice;
        elements.liquidityUsdtAmount.value = calculatedUsdt.toFixed(2);
    }
    // 如果输入USDT，自动计算ETH
    else if (usdtAmount > 0 && ethAmount === 0) {
        const currentPrice = poolState.reserveETH / poolState.reserveUSDT;
        const calculatedEth = usdtAmount * currentPrice;
        elements.liquidityEthAmount.value = calculatedEth.toFixed(6);
    }
    
    // 更新价格显示
    if (ethAmount > 0 && usdtAmount > 0) {
        const price = usdtAmount / ethAmount;
        elements.liquidityPrice.textContent = `1 ETH = ${price.toFixed(2)} USDT`;
    } else if (poolState.reserveETH > 0) {
        const price = poolState.reserveUSDT / poolState.reserveETH;
        elements.liquidityPrice.textContent = `1 ETH = ${price.toFixed(2)} USDT`;
    }
    
    // 计算份额
    if (ethAmount > 0 && poolState.reserveETH > 0) {
        const share = (ethAmount / (poolState.reserveETH + ethAmount)) * 100;
        elements.liquidityShare.textContent = share.toFixed(2) + '%';
    } else {
        elements.liquidityShare.textContent = '0%';
    }
    
    // 启用/禁用按钮
    const hasEth = ethAmount > 0 && ethAmount <= userState.balanceETH;
    const hasUsdt = usdtAmount > 0 && usdtAmount <= userState.balanceUSDT;
    elements.addLiquidityBtn.disabled = !(hasEth && hasUsdt && userState.connected);
}

// Add Liquidity
async function addLiquidity() {
    if (!userState.connected) {
        showNotification('请先连接钱包', 'error');
        return;
    }
    
    const ethAmount = parseFloat(elements.liquidityEthAmount.value);
    const usdtAmount = parseFloat(elements.liquidityUsdtAmount.value);
    
    if (ethAmount <= 0 || usdtAmount <= 0) {
        showNotification('请输入有效金额', 'error');
        return;
    }
    
    if (ethAmount > userState.balanceETH) {
        showNotification('ETH余额不足', 'error');
        return;
    }
    
    if (usdtAmount > userState.balanceUSDT) {
        showNotification('USDT余额不足', 'error');
        return;
    }
    
    try {
        showLoading('添加流动性中...');
        
        // 计算LP代币数量 (Uniswap V2公式)
        let lpAmount = 0;
        
        if (poolState.totalSupply === 0) {
            // 首次添加流动性
            lpAmount = Math.sqrt(ethAmount * usdtAmount);
        } else {
            // 后续添加：按比例计算
            const ethShare = ethAmount / poolState.reserveETH;
            const usdtShare = usdtAmount / poolState.reserveUSDT;
            const share = Math.min(ethShare, usdtShare);
            lpAmount = poolState.totalSupply * share;
        }
        
        // 更新池子状态
        poolState.reserveETH += ethAmount;
        poolState.reserveUSDT += usdtAmount;
        poolState.totalSupply += lpAmount;
        poolState.k = poolState.reserveETH * poolState.reserveUSDT;
        
        // 更新用户余额
        userState.balanceETH -= ethAmount;
        userState.balanceUSDT -= usdtAmount;
        userState.lpBalance += lpAmount;
        
        // 清空输入
        elements.liquidityEthAmount.value = '';
        elements.liquidityUsdtAmount.value = '';
        
        updateUI();
        hideLoading();
        showNotification(`成功添加流动性，获得 ${lpAmount.toFixed(6)} LP代币`, 'success');
        
    } catch (error) {
        hideLoading();
        showNotification('添加流动性失败: ' + error.message, 'error');
        console.error('Add liquidity error:', error);
    }
}

// Handle Remove Liquidity Input
function handleRemoveLiquidityInput() {
    const lpAmount = parseFloat(elements.removeLpAmount.value) || 0;
    
    if (lpAmount <= 0 || poolState.totalSupply === 0) {
        elements.removeReceive.textContent = '0 ETH + 0 USDT';
        elements.removeLiquidityBtn.disabled = true;
        return;
    }
    
    // 计算可以取回的代币数量
    const share = lpAmount / poolState.totalSupply;
    const ethOut = poolState.reserveETH * share;
    const usdtOut = poolState.reserveUSDT * share;
    
    elements.removeReceive.textContent = `${ethOut.toFixed(6)} ETH + ${usdtOut.toFixed(2)} USDT`;
    
    // 启用/禁用按钮
    elements.removeLiquidityBtn.disabled = !(lpAmount > 0 && lpAmount <= userState.lpBalance && userState.connected);
}

// Remove Liquidity
async function removeLiquidity() {
    if (!userState.connected) {
        showNotification('请先连接钱包', 'error');
        return;
    }
    
    const lpAmount = parseFloat(elements.removeLpAmount.value);
    
    if (lpAmount <= 0) {
        showNotification('请输入有效金额', 'error');
        return;
    }
    
    if (lpAmount > userState.lpBalance) {
        showNotification('LP代币余额不足', 'error');
        return;
    }
    
    try {
        showLoading('移除流动性中...');
        
        // 计算可以取回的代币数量
        const share = lpAmount / poolState.totalSupply;
        const ethOut = poolState.reserveETH * share;
        const usdtOut = poolState.reserveUSDT * share;
        
        // 更新池子状态
        poolState.reserveETH -= ethOut;
        poolState.reserveUSDT -= usdtOut;
        poolState.totalSupply -= lpAmount;
        poolState.k = poolState.reserveETH * poolState.reserveUSDT;
        
        // 更新用户余额
        userState.balanceETH += ethOut;
        userState.balanceUSDT += usdtOut;
        userState.lpBalance -= lpAmount;
        
        // 清空输入
        elements.removeLpAmount.value = '';
        
        updateUI();
        hideLoading();
        showNotification(`成功移除流动性，收到 ${ethOut.toFixed(6)} ETH + ${usdtOut.toFixed(2)} USDT`, 'success');
        
    } catch (error) {
        hideLoading();
        showNotification('移除流动性失败: ' + error.message, 'error');
        console.error('Remove liquidity error:', error);
    }
}

// Switch Tab
function switchTab(tabName) {
    elements.tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
    
    // 重置移除流动性卡片显示
    if (tabName !== 'liquidity') {
        elements.removeLiquidityCard.style.display = 'none';
    }
}

// Update UI
function updateUI() {
    // Wallet info
    if (userState.connected) {
        elements.connectWalletBtn.style.display = 'none';
        elements.walletInfo.style.display = 'flex';
        elements.walletAddress.textContent = `${userState.account.slice(0, 6)}...${userState.account.slice(-4)}`;
        elements.walletBalance.textContent = `${userState.balanceETH.toFixed(4)} ETH`;
    } else {
        elements.connectWalletBtn.style.display = 'block';
        elements.walletInfo.style.display = 'none';
    }
    
    // Swap balances
    const fromToken = elements.swapFromToken.value;
    const toToken = elements.swapToToken.value;
    elements.swapFromBalance.textContent = fromToken === 'ETH' ? userState.balanceETH.toFixed(4) : userState.balanceUSDT.toFixed(2);
    elements.swapToBalance.textContent = toToken === 'ETH' ? userState.balanceETH.toFixed(4) : userState.balanceUSDT.toFixed(2);
    
    // Liquidity balances
    elements.liquidityEthBalance.textContent = userState.balanceETH.toFixed(4);
    elements.liquidityUsdtBalance.textContent = userState.balanceUSDT.toFixed(2);
    elements.lpBalance.textContent = userState.lpBalance.toFixed(6);
    
    // Pool stats
    elements.poolEthReserve.textContent = poolState.reserveETH.toFixed(4);
    elements.poolUsdtReserve.textContent = poolState.reserveUSDT.toFixed(2);
    elements.poolTotalLiquidity.textContent = poolState.totalSupply.toFixed(6);
    
    if (poolState.reserveETH > 0) {
        const price = poolState.reserveUSDT / poolState.reserveETH;
        elements.poolPrice.textContent = `${price.toFixed(2)} USDT/ETH`;
    } else {
        elements.poolPrice.textContent = '0 USDT/ETH';
    }
    
    // Show remove liquidity card if user has LP tokens
    if (userState.lpBalance > 0) {
        elements.removeLiquidityCard.style.display = 'block';
    }
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

// Auto-update balances every 10 seconds
setInterval(() => {
    if (userState.connected) {
        updateUserBalances();
        updateUI();
    }
}, 10000);

// Initial UI update
updateUI();
