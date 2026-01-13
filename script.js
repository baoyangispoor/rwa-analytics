// API配置
const API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const CURRENCIES = ['bitcoin', 'ethereum'];
const VS_CURRENCY = 'usd';
const UPDATE_INTERVAL = 30000; // 30秒

// RWA项目配置 - 基于RWA.xyz数据
const RWA_PROJECTS = [
    // 政府证券
    { id: 'blackrock-usd-institutional-digital-liquidity-fund', name: 'BUIDL', symbol: 'BUIDL', category: 'treasuries', description: 'BlackRock美元机构数字流动性基金' },
    { id: 'usd-yield', name: 'USYC', symbol: 'USYC', category: 'treasuries', description: 'USD Yield Coin' },
    { id: 'benji', name: 'BENJI', symbol: 'BENJI', category: 'treasuries', description: 'Benji Treasury Token' },
    { id: 'ousd', name: 'OUSG', symbol: 'OUSG', category: 'treasuries', description: 'Ondo Short-Term US Government Bond' },
    { id: 'usdy', name: 'USDY', symbol: 'USDY', category: 'treasuries', description: 'Ondo USD Yield' },
    { id: 'ustb', name: 'USTB', symbol: 'USTB', category: 'treasuries', description: 'US Treasury Bond Token' },
    
    // 稳定币
    { id: 'tether', name: 'Tether', symbol: 'USDT', category: 'stablecoins', description: '最大的稳定币，由现实资产支持' },
    { id: 'usd-coin', name: 'USD Coin', symbol: 'USDC', category: 'stablecoins', description: 'Circle发行的美元稳定币' },
    { id: 'stably-usd', name: 'Stably USD', symbol: 'USDS', category: 'stablecoins', description: 'Stably发行的稳定币' },
    { id: 'ethena-usd', name: 'Ethena USD', symbol: 'USDe', category: 'stablecoins', description: 'Ethena发行的合成美元' },
    { id: 'paypal-usd', name: 'PayPal USD', symbol: 'PYUSD', category: 'stablecoins', description: 'PayPal发行的稳定币' },
    { id: 'first-digital-usd', name: 'First Digital USD', symbol: 'USD1', category: 'stablecoins', description: 'First Digital发行的稳定币' },
    { id: 'usdf', name: 'USDF', symbol: 'USDF', category: 'stablecoins', description: 'USDF稳定币' },
    { id: 'rlusd', name: 'RLUSD', symbol: 'RLUSD', category: 'stablecoins', description: 'RLUSD稳定币' },
    { id: 'usdg', name: 'USDG', symbol: 'USDG', category: 'stablecoins', description: 'USDG稳定币' },
    { id: 'true-usd', name: 'TrueUSD', symbol: 'TUSD', category: 'stablecoins', description: '由现实世界资产支持的稳定币' },
    
    // 商品/贵金属
    { id: 'tether-gold', name: 'Tether Gold', symbol: 'XAUT', category: 'commodities', description: '由实物黄金支持的代币' },
    { id: 'pax-gold', name: 'PAX Gold', symbol: 'PAXG', category: 'commodities', description: 'Paxos发行的黄金代币' },
    { id: 'matrixdock-gold', name: 'Matrixdock Gold', symbol: 'XAUm', category: 'commodities', description: 'Matrixdock黄金代币' },
    { id: 'cgo', name: 'CGO', symbol: 'CGO', category: 'commodities', description: '商品代币' },
    { id: 'txau', name: 'TXAU', symbol: 'TXAU', category: 'commodities', description: '代币化黄金' },
    
    // 股票
    { id: 'exodus', name: 'Exodus', symbol: 'EXOD', category: 'stocks', description: 'Exodus股票代币' },
    { id: 'tesla-xstock', name: 'Tesla xStock', symbol: 'TSLAx', category: 'stocks', description: '特斯拉股票代币' },
    { id: 'spy-on', name: 'SPY on', symbol: 'SPYon', category: 'stocks', description: 'SPY ETF代币' },
    { id: 'crcl-x', name: 'CRCL x', symbol: 'CRCLx', category: 'stocks', description: 'CRCL股票代币' },
    { id: 'qqq-on', name: 'QQQ on', symbol: 'QQQon', category: 'stocks', description: 'QQQ ETF代币' },
    { id: 'nvidia-xstock', name: 'NVIDIA xStock', symbol: 'NVDAx', category: 'stocks', description: '英伟达股票代币' },
    { id: 'google-on', name: 'Google on', symbol: 'GOOGLon', category: 'stocks', description: '谷歌股票代币' },
    
    // 债券
    { id: 'eutbl', name: 'EUTBL', symbol: 'EUTBL', category: 'bonds', description: '欧洲债券代币' },
    { id: 'nrw1', name: 'NRW1', symbol: 'NRW1', category: 'bonds', description: '债券代币' },
    { id: 'cammf', name: 'CAMMF', symbol: 'CAMMF', category: 'bonds', description: '债券代币' },
    
    // 机构基金
    { id: 'jaaa', name: 'JAAA', symbol: 'JAAA', category: 'funds', description: '机构基金代币' },
    { id: 'bcap', name: 'BCAP', symbol: 'BCAP', category: 'funds', description: '机构基金代币' },
    { id: 'uscc', name: 'USCC', symbol: 'USCC', category: 'funds', description: '机构基金代币' },
    
    // 平台代币
    { id: 'ondo-finance', name: 'Ondo Finance', symbol: 'ONDO', category: 'platforms', description: '机构级RWA代币化平台' },
    { id: 'centrifuge', name: 'Centrifuge', symbol: 'CFG', category: 'platforms', description: '去中心化资产融资协议' },
    { id: 'maker', name: 'MakerDAO', symbol: 'MKR', category: 'platforms', description: '去中心化稳定币和RWA协议' },
    { id: 'maple', name: 'Maple Finance', symbol: 'MPL', category: 'platforms', description: '机构级借贷和RWA平台' },
    { id: 'goldfinch', name: 'Goldfinch', symbol: 'GFI', category: 'platforms', description: '去中心化信贷协议' },
    { id: 'tokenized-real-estate', name: 'RealT', symbol: 'REALT', category: 'platforms', description: '房地产代币化平台' }
];

// 状态管理
let autoRefreshInterval = null;
let isRefreshing = false;

// 缓存配置
const CACHE_DURATION = 60000; // 缓存60秒
const priceCache = {
    data: null,
    timestamp: 0
};
const rwaCache = {
    data: null,
    timestamp: 0
};

// 重试配置
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2秒后重试

// DOM元素
const btcPriceHero = document.getElementById('btc-price-hero');
const ethPriceHero = document.getElementById('eth-price-hero');
const btcChangeHero = document.getElementById('btc-change-hero');
const ethChangeHero = document.getElementById('eth-change-hero');
const totalMarketCapHero = document.getElementById('total-market-cap-hero');
const totalChangeHero = document.getElementById('total-change-hero');
const refreshBtn = document.getElementById('refresh-btn');
const autoRefreshCheckbox = document.getElementById('auto-refresh');
const rwaTableBody = document.getElementById('rwa-table-body');
let filterButtons = null; // 将在DOM加载后初始化
let currentCategory = 'all';
let rwaProjectsData = []; // 存储所有RWA项目数据

// 存储上次价格用于计算变化
let lastPrices = {
    btc: null,
    eth: null
};

// 格式化价格
function formatPrice(price) {
    if (price === null || price === undefined) return 'N/A';
    return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
}

// 格式化百分比
function formatPercent(value) {
    if (value === null || value === undefined) return '--';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
}

// 格式化变化值
function formatChange(value) {
    if (value === null || value === undefined) return '--';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${formatPrice(Math.abs(value))}`;
}

// 更新价格显示（新设计）
function updatePriceDisplay(crypto, data, price24h) {
    const price = data[crypto][`${VS_CURRENCY}`];
    const priceChange = price - price24h;
    const percentChange = price24h > 0 ? ((priceChange / price24h) * 100) : 0;

    let priceElement, changeElement;

    if (crypto === 'bitcoin') {
        priceElement = btcPriceHero;
        changeElement = btcChangeHero;
    } else {
        priceElement = ethPriceHero;
        changeElement = ethChangeHero;
    }

    // 更新价格
    priceElement.textContent = formatPrice(price);

    // 更新变化
    const changeIndicator = changeElement.querySelector('.change-indicator');
    const changeText = changeElement.querySelector('.change-text');

    changeText.textContent = `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%`;

    // 更新样式
    changeElement.className = 'stat-change';
    if (percentChange > 0) {
        changeElement.classList.add('positive');
    } else if (percentChange < 0) {
        changeElement.classList.add('negative');
    }

    // 保存当前价格
    lastPrices[crypto === 'bitcoin' ? 'btc' : 'eth'] = price;
}

// 获取价格数据
async function fetchPrices() {
    if (isRefreshing) return;
    
    isRefreshing = true;
    refreshBtn.classList.add('loading');
    refreshBtn.disabled = true;

    try {
        const params = new URLSearchParams({
            ids: CURRENCIES.join(','),
            vs_currencies: VS_CURRENCY,
            include_24hr_change: 'true'
        });

        // 检查缓存
        const now = Date.now();
        if (priceCache.data && (now - priceCache.timestamp) < CACHE_DURATION) {
            console.log('使用缓存的价格数据');
            const cachedData = priceCache.data;
            const btc24hChange = cachedData.bitcoin[`${VS_CURRENCY}_24h_change`] || 0;
            const eth24hChange = cachedData.ethereum[`${VS_CURRENCY}_24h_change`] || 0;
            const btcCurrentPrice = cachedData.bitcoin[VS_CURRENCY];
            const ethCurrentPrice = cachedData.ethereum[VS_CURRENCY];
            const btc24hPrice = btc24hChange !== 0 ? btcCurrentPrice / (1 + btc24hChange / 100) : btcCurrentPrice;
            const eth24hPrice = eth24hChange !== 0 ? ethCurrentPrice / (1 + eth24hChange / 100) : ethCurrentPrice;
            updatePriceDisplay('bitcoin', cachedData, btc24hPrice);
            updatePriceDisplay('ethereum', cachedData, eth24hPrice);
            return;
        }

        // 带重试的请求函数
        const fetchWithRetry = async (url, options, retries = MAX_RETRIES) => {
            for (let i = 0; i < retries; i++) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20秒超时
                    
                    const response = await fetch(url, {
                        ...options,
                        signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    return response;
                } catch (error) {
                    if (i === retries - 1) throw error;
                    console.log(`请求失败，${RETRY_DELAY/1000}秒后重试 (${i + 1}/${retries})...`);
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                }
            }
        };

        const response = await fetchWithRetry(`${API_URL}?${params}`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        const data = await response.json();
        
        // 更新缓存
        priceCache.data = data;
        priceCache.timestamp = Date.now();

        // 获取24小时前的价格（通过24小时变化百分比计算）
        const btc24hChange = data.bitcoin[`${VS_CURRENCY}_24h_change`] || 0;
        const eth24hChange = data.ethereum[`${VS_CURRENCY}_24h_change`] || 0;
        
        const btcCurrentPrice = data.bitcoin[VS_CURRENCY];
        const ethCurrentPrice = data.ethereum[VS_CURRENCY];
        
        // 计算24小时前的价格
        const btc24hPrice = btc24hChange !== 0 
            ? btcCurrentPrice / (1 + btc24hChange / 100)
            : btcCurrentPrice;
        const eth24hPrice = eth24hChange !== 0
            ? ethCurrentPrice / (1 + eth24hChange / 100)
            : ethCurrentPrice;

        // 更新显示
        updatePriceDisplay('bitcoin', data, btc24hPrice);
        updatePriceDisplay('ethereum', data, eth24hPrice);

    } catch (error) {
        console.error('获取价格失败:', error);
        
        // 如果缓存有数据，使用缓存
        if (priceCache.data) {
            console.log('使用缓存数据作为备用');
            const cachedData = priceCache.data;
            const btc24hChange = cachedData.bitcoin[`${VS_CURRENCY}_24h_change`] || 0;
            const eth24hChange = cachedData.ethereum[`${VS_CURRENCY}_24h_change`] || 0;
            const btcCurrentPrice = cachedData.bitcoin[VS_CURRENCY];
            const ethCurrentPrice = cachedData.ethereum[VS_CURRENCY];
            const btc24hPrice = btc24hChange !== 0 ? btcCurrentPrice / (1 + btc24hChange / 100) : btcCurrentPrice;
            const eth24hPrice = eth24hChange !== 0 ? ethCurrentPrice / (1 + eth24hChange / 100) : ethCurrentPrice;
            updatePriceDisplay('bitcoin', cachedData, btc24hPrice);
            updatePriceDisplay('ethereum', cachedData, eth24hPrice);
            
            // 显示提示
            const btcChange = btcChangeHero.querySelector('.change-text');
            const ethChange = ethChangeHero.querySelector('.change-text');
            if (btcChange) btcChange.textContent = '(缓存数据)';
            if (ethChange) ethChange.textContent = '(缓存数据)';
            return;
        }
        
        let errorMsg = '无法获取价格数据';
        if (error.name === 'AbortError') {
            errorMsg = '请求超时';
        } else if (error.message.includes('Failed to fetch')) {
            errorMsg = '网络连接失败';
        }
        
        // 显示错误信息
        btcPriceHero.textContent = '--';
        ethPriceHero.textContent = '--';
        
        // 不显示alert，改为在控制台记录
        console.warn(errorMsg + '，请检查网络连接或稍后重试');
    } finally {
        isRefreshing = false;
        refreshBtn.classList.remove('loading');
        refreshBtn.disabled = false;
    }
}

// 手动刷新
refreshBtn.addEventListener('click', fetchPrices);

// 自动刷新控制
function startAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    autoRefreshInterval = setInterval(fetchPrices, UPDATE_INTERVAL);
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

autoRefreshCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
        startAutoRefresh();
    } else {
        stopAutoRefresh();
    }
});

// 页面可见性变化时控制自动刷新
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoRefresh();
    } else if (autoRefreshCheckbox.checked) {
        startAutoRefresh();
        fetchPrices(); // 立即刷新一次
    }
});

// ========== RWA项目模块 ==========

// 格式化市值
function formatMarketCap(value) {
    if (!value || value === 0) return 'N/A';
    if (value >= 1e9) {
        return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
        return `$${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
        return `$${(value / 1e3).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
}

// 获取项目图标（使用CoinGecko的图标API）
function getProjectIcon(projectId) {
    return `https://assets.coingecko.com/coins/images/${getCoinImageId(projectId)}/small/${projectId}.png`;
}

// 获取币种图片ID（简化版，实际应该从API获取）
function getCoinImageId(projectId) {
    const imageMap = {
        'ondo-finance': '2645',
        'centrifuge': '4702',
        'maker': '1364',
        'maple': '15806',
        'trueusd': '2604',
        'pax-gold': '4058',
        'tokenized-real-estate': '0',
        'goldfinch': '15877'
    };
    return imageMap[projectId] || '0';
}

// 获取分类标签
function getCategoryLabel(category) {
    const labels = {
        'treasuries': '政府证券',
        'stablecoins': '稳定币',
        'commodities': '商品/贵金属',
        'stocks': '股票',
        'bonds': '债券',
        'funds': '机构基金',
        'platforms': '平台代币'
    };
    return labels[category] || category;
}

// 创建表格行
function createTableRow(project, priceData, marketData, rank) {
    const price = priceData?.usd || 0;
    const change24h = priceData?.usd_24h_change || 0;
    const marketCap = marketData?.market_cap?.usd || 0;
    
    const row = document.createElement('tr');
    row.dataset.category = project.category || 'other';
    row.style.cursor = 'pointer';
    
    const changeClass = change24h > 0 ? 'positive' : change24h < 0 ? 'negative' : '';
    
    row.innerHTML = `
        <td class="col-rank">${rank}</td>
        <td class="col-name">
            <div class="project-name">
                <div class="project-logo">${project.symbol.charAt(0)}</div>
                <div class="project-info">
                    <div class="project-title">${project.name}</div>
                    <div class="project-symbol">${project.symbol}</div>
                </div>
            </div>
        </td>
        <td class="col-category">
            <span class="category-badge">${getCategoryLabel(project.category)}</span>
        </td>
        <td class="col-price">${formatPrice(price)}</td>
        <td class="col-change">
            <div class="change-cell">
                <span class="change-value ${changeClass}">
                    ${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%
                </span>
            </div>
        </td>
        <td class="col-marketcap">${formatMarketCap(marketCap)}</td>
    `;
    
    // 添加点击事件
    row.addEventListener('click', () => {
        window.open(`https://www.coingecko.com/en/coins/${project.id}`, '_blank');
    });
    
    return row;
}

// 更新统计信息
function updateRWAStats(filteredProjects) {
    const totalProjects = filteredProjects.length;
    let totalMarketCap = 0;
    let totalChange = 0;
    let validChanges = 0;

    filteredProjects.forEach(item => {
        if (item.marketData?.market_cap?.usd) {
            totalMarketCap += item.marketData.market_cap.usd;
        }
        if (item.priceData?.usd_24h_change !== undefined && item.priceData.usd_24h_change !== null) {
            totalChange += item.priceData.usd_24h_change;
            validChanges++;
        }
    });

    const avgChange = validChanges > 0 ? totalChange / validChanges : 0;

    document.getElementById('total-projects').textContent = totalProjects;
    
    const marketCapElement = document.getElementById('total-market-cap');
    marketCapElement.textContent = formatMarketCap(totalMarketCap);
    
    const changeElement = document.getElementById('total-change');
    changeElement.textContent = `${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}%`;
    changeElement.className = `stat-box-value ${avgChange > 0 ? 'positive' : avgChange < 0 ? 'negative' : ''}`;
    
    // 更新Hero区域的总市值
    totalMarketCapHero.textContent = formatMarketCap(totalMarketCap);
    const totalChangeIndicator = totalChangeHero.querySelector('.change-indicator');
    const totalChangeText = totalChangeHero.querySelector('.change-text');
    totalChangeText.textContent = `${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}%`;
    totalChangeHero.className = 'stat-change';
    if (avgChange > 0) {
        totalChangeHero.classList.add('positive');
    } else if (avgChange < 0) {
        totalChangeHero.classList.add('negative');
    }
}

// 筛选RWA项目
function filterRWAProjects(category) {
    currentCategory = category;
    
    // 更新筛选按钮状态
    if (filterButtons) {
        filterButtons.forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // 筛选项目
    const filtered = category === 'all' 
        ? rwaProjectsData 
        : rwaProjectsData.filter(item => item.project.category === category);

    // 清空表格
    rwaTableBody.innerHTML = '';

    if (filtered.length === 0) {
        rwaTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="loading-row">
                    <span>该分类下暂无项目数据</span>
                </td>
            </tr>
        `;
        updateRWAStats([]);
        return;
    }

    // 按市值排序
    filtered.sort((a, b) => {
        const capA = a.marketData?.market_cap?.usd || 0;
        const capB = b.marketData?.market_cap?.usd || 0;
        return capB - capA;
    });

    // 创建表格行
    filtered.forEach((item, index) => {
        const row = createTableRow(item.project, item.priceData, item.marketData, index + 1);
        rwaTableBody.appendChild(row);
    });

    // 更新统计信息
    updateRWAStats(filtered);
}

// 获取RWA项目数据
async function fetchRWAProjects() {
    try {
        rwaTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="loading-row">
                    <div class="loading-spinner"></div>
                    <span>正在加载RWA项目信息...</span>
                </td>
            </tr>
        `;

        // 获取所有RWA项目的ID列表
        const rwaIds = RWA_PROJECTS.map(p => p.id).join(',');

        // 获取价格数据
        const priceParams = new URLSearchParams({
            ids: rwaIds,
            vs_currencies: VS_CURRENCY,
            include_24hr_change: 'true'
        });

        // 获取市场数据（包括市值）
        const marketParams = new URLSearchParams({
            ids: rwaIds,
            vs_currency: VS_CURRENCY,
            order: 'market_cap_desc',
            per_page: RWA_PROJECTS.length,
            page: 1,
            sparkline: false
        });

        // 检查缓存
        const now = Date.now();
        if (rwaCache.data && (now - rwaCache.timestamp) < CACHE_DURATION) {
            console.log('使用缓存的RWA数据');
            const cachedData = rwaCache.data;
            rwaProjectsData = cachedData.projects;
            filterRWAProjects(currentCategory);
            return;
        }

        // 带重试的请求函数
        const fetchWithRetry = async (url, options, retries = MAX_RETRIES) => {
            for (let i = 0; i < retries; i++) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25秒超时
                    
                    const response = await fetch(url, {
                        ...options,
                        signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    return response;
                } catch (error) {
                    if (i === retries - 1) throw error;
                    console.log(`请求失败，${RETRY_DELAY/1000}秒后重试 (${i + 1}/${retries})...`);
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                }
            }
        };
        
        const [priceResponse, marketResponse] = await Promise.all([
            fetchWithRetry(`${API_URL}?${priceParams}`, {
                headers: { 'Accept': 'application/json' }
            }),
            fetchWithRetry(`${COINGECKO_API}/coins/markets?${marketParams}`, {
                headers: { 'Accept': 'application/json' }
            })
        ]);

        if (!priceResponse.ok || !marketResponse.ok) {
            throw new Error('获取RWA数据失败');
        }

        const priceData = await priceResponse.json();
        const marketData = await marketResponse.json();

        // 创建市场数据映射
        const marketMap = {};
        marketData.forEach(coin => {
            marketMap[coin.id] = coin;
        });

        // 存储所有项目数据
        rwaProjectsData = [];

        // 为每个项目收集数据
        RWA_PROJECTS.forEach(project => {
            const priceInfo = priceData[project.id];
            const marketInfo = marketMap[project.id];

            if (priceInfo) {
                rwaProjectsData.push({
                    project: project,
                    priceData: priceInfo,
                    marketData: marketInfo
                });
            }
        });
        
        // 更新缓存
        rwaCache.data = {
            projects: rwaProjectsData,
            priceData: priceData,
            marketData: marketData
        };
        rwaCache.timestamp = Date.now();

        // 如果没有数据，显示提示
        if (rwaProjectsData.length === 0) {
            rwaTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="loading-row">
                        <span>暂无RWA项目数据，请稍后重试</span>
                    </td>
                </tr>
            `;
            updateRWAStats([]);
        } else {
            // 应用当前筛选
            filterRWAProjects(currentCategory);
        }

    } catch (error) {
        console.error('获取RWA项目失败:', error);
        
        // 如果缓存有数据，使用缓存
        if (rwaCache.data && rwaCache.data.projects) {
            console.log('使用缓存数据作为备用');
            rwaProjectsData = rwaCache.data.projects;
            filterRWAProjects(currentCategory);
            
            // 显示提示
            const firstRow = rwaTableBody.querySelector('tr');
            if (firstRow) {
                const notice = document.createElement('div');
                notice.style.cssText = 'text-align: center; padding: 10px; color: var(--text-secondary); font-size: 0.85rem;';
                notice.textContent = '⚠️ 当前显示的是缓存数据，可能不是最新';
                rwaTableBody.insertBefore(notice, firstRow);
            }
            return;
        }
        
        let errorMessage = '无法加载RWA项目信息';
        if (error.name === 'AbortError') {
            errorMessage = '请求超时，已自动重试但失败';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = '网络连接失败，请检查网络设置';
        } else if (error.message.includes('429')) {
            errorMessage = 'API请求过于频繁，请稍后再试';
        }
        
        rwaTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="loading-row">
                    <span>${errorMessage}</span>
                    <br>
                    <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: var(--accent-blue); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        重新加载
                    </button>
                </td>
            </tr>
        `;
    }
}

// 公司Logo配置
const COMPANY_LOGO_URL = 'http://117.24.217.163:10015/website/images/common/logo.png';

// ========== 币链资本行研数据库模块 ==========

let researchData = {
    RWA: [],
    DAT: [],
    DAPE: []
};
let currentResearchCategory = 'all';

// 加载研究数据
async function loadResearchData() {
    const tbody = document.getElementById('research-table-body');
    
    try {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="loading-row">
                    <div class="loading-spinner"></div>
                    <span>正在加载研究数据...</span>
                </td>
            </tr>
        `;
        
        // 尝试多个可能的路径
        const possiblePaths = [
            './research_data.json',
            'research_data.json',
            '/research_data.json'
        ];
        
        let response = null;
        let lastError = null;
        
        for (const path of possiblePaths) {
            try {
                response = await fetch(path);
                if (response.ok) {
                    break;
                }
            } catch (e) {
                lastError = e;
                continue;
            }
        }
        
        if (!response || !response.ok) {
            throw new Error(`无法加载研究数据文件。状态: ${response ? response.status : '网络错误'}`);
        }
        
        const data = await response.json();
        
        if (!data || (!data.RWA && !data.DAT && !data.DAPE)) {
            throw new Error('数据格式不正确或为空');
        }
        
        researchData = {
            RWA: data.RWA || [],
            DAT: data.DAT || [],
            DAPE: data.DAPE || []
        };
        
        console.log('研究数据加载成功:', {
            RWA: researchData.RWA.length,
            DAT: researchData.DAT.length,
            DAPE: researchData.DAPE.length
        });
        
        // 更新统计
        const rwaCountEl = document.getElementById('rwa-count');
        const datCountEl = document.getElementById('dat-count');
        const dapeCountEl = document.getElementById('dape-count');
        
        if (rwaCountEl) rwaCountEl.textContent = researchData.RWA.length;
        if (datCountEl) datCountEl.textContent = researchData.DAT.length;
        if (dapeCountEl) dapeCountEl.textContent = researchData.DAPE.length;
        
        // 显示数据
        filterResearchData(currentResearchCategory);
    } catch (error) {
        console.error('加载研究数据失败:', error);
        console.error('错误详情:', {
            message: error.message,
            stack: error.stack
        });
        
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="loading-row">
                    <span style="color: var(--accent-red);">⚠️ 无法加载研究数据</span>
                    <br>
                    <span style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem; display: block;">
                        错误: ${error.message}
                    </span>
                    <br>
                    <button onclick="loadResearchData()" style="margin-top: 10px; padding: 8px 16px; background: var(--accent-blue); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        重试加载
                    </button>
                </td>
            </tr>
        `;
        
        // 更新统计为0
        const rwaCountEl = document.getElementById('rwa-count');
        const datCountEl = document.getElementById('dat-count');
        const dapeCountEl = document.getElementById('dape-count');
        if (rwaCountEl) rwaCountEl.textContent = '0';
        if (datCountEl) datCountEl.textContent = '0';
        if (dapeCountEl) dapeCountEl.textContent = '0';
    }
}

// 格式化资产规模
function formatAssetSize(value) {
    if (!value || value === '' || value === 'N/A') return 'N/A';
    const num = parseFloat(value.toString().replace(/,/g, ''));
    if (isNaN(num)) return value;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
}

// 创建研究数据表格行
function createResearchRow(item, index) {
    const row = document.createElement('tr');
    const projectName = item['项目名称'] || 'N/A';
    const platform = item['发行方 / 平台'] || 'N/A';
    const status = item['当前状态'] || 'N/A';
    const assetType = item['资产类型'] || 'N/A';
    const assetSize = formatAssetSize(item['资产规模（USD）']);
    const score = item['币链评分（0-100）'] || 'N/A';
    
    row.innerHTML = `
        <td class="col-rank">${index + 1}</td>
        <td class="col-name">
            <div class="project-name">
                <div class="project-logo">${projectName.charAt(0)}</div>
                <div class="project-info">
                    <div class="project-title">${projectName}</div>
                </div>
            </div>
        </td>
        <td class="col-platform">${platform}</td>
        <td class="col-status">${status}</td>
        <td class="col-asset-type">${assetType}</td>
        <td class="col-asset-size">${assetSize}</td>
        <td class="col-score">${score}</td>
        <td class="col-actions">
            <button class="view-details-btn" data-index="${index}">详情</button>
        </td>
    `;
    
    // 添加详情按钮事件
    const detailBtn = row.querySelector('.view-details-btn');
    detailBtn.addEventListener('click', () => {
        showProjectDetails(item);
    });
    
    return row;
}

// 筛选研究数据
function filterResearchData(category) {
    currentResearchCategory = category;
    
    // 更新筛选按钮状态
    document.querySelectorAll('.research-filter').forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    let filteredData = [];
    if (category === 'all') {
        filteredData = [...researchData.RWA, ...researchData.DAT, ...researchData.DAPE];
    } else {
        filteredData = researchData[category] || [];
    }
    
    const tbody = document.getElementById('research-table-body');
    tbody.innerHTML = '';
    
    if (filteredData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="loading-row">
                    <span>该分类下暂无数据</span>
                </td>
            </tr>
        `;
        return;
    }
    
    filteredData.forEach((item, index) => {
        const row = createResearchRow(item, index);
        tbody.appendChild(row);
    });
}

// 显示项目详情
function showProjectDetails(item) {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = item['项目名称'] || '项目详情';
    
    // 重要字段列表
    const importantFields = [
        '项目名称', '发行方 / 平台', '发行时间', '发行地区 / 监管框架',
        '当前状态', '资产类型', '资产说明', '资产规模（USD）',
        '现金流特征', '托管 / 审计方', 'Token 名称 / 符号', 'Token 类型',
        '经济属性', '投资/消费属性', '收益分配方式', '年化收益率（APY）',
        '币链评分（0-100）', '投资逻辑摘要', '风险点', '复盘结论',
        '链上地址', '可视化仪表盘', '法律文件', '标签'
    ];
    
    let html = '<div class="detail-grid">';
    importantFields.forEach(field => {
        const value = item[field] || '';
        if (value && value !== 'N/A' && value !== '') {
            html += `
                <div class="detail-item">
                    <div class="detail-label">${field}</div>
                    <div class="detail-value">${value}</div>
                </div>
            `;
        }
    });
    html += '</div>';
    
    modalBody.innerHTML = html;
    modal.classList.add('show');
}


// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化RWA项目筛选按钮
    filterButtons = document.querySelectorAll('.filter-chip:not(.research-filter)');
    
    // RWA筛选按钮事件监听
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            filterRWAProjects(category);
        });
    });
    
    // 研究数据筛选按钮
    document.querySelectorAll('.research-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            filterResearchData(category);
        });
    });
    
    // 模态框关闭事件
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }
    
    // 点击背景关闭模态框
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
    
    // 加载数据
    fetchPrices();
    fetchRWAProjects();
    loadResearchData();
    
    if (autoRefreshCheckbox.checked) {
        startAutoRefresh();
    }
    
    // RWA项目每5分钟刷新一次
    setInterval(fetchRWAProjects, 300000);
});
