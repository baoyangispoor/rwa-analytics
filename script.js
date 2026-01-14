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

// DOM元素（延迟初始化，确保DOM已加载）
let btcPriceHero, ethPriceHero, btcChangeHero, ethChangeHero;
let totalMarketCapHero, totalChangeHero;
let refreshBtn, autoRefreshCheckbox, rwaTableBody;
let filterButtons = null; // 将在DOM加载后初始化
let currentCategory = 'all';
let rwaProjectsData = []; // 存储所有RWA项目数据

// 初始化DOM元素
function initDOMElements() {
    btcPriceHero = document.getElementById('btc-price-hero');
    ethPriceHero = document.getElementById('eth-price-hero');
    btcChangeHero = document.getElementById('btc-change-hero');
    ethChangeHero = document.getElementById('eth-change-hero');
    totalMarketCapHero = document.getElementById('total-market-cap-hero');
    totalChangeHero = document.getElementById('total-change-hero');
    refreshBtn = document.getElementById('refresh-btn');
    autoRefreshCheckbox = document.getElementById('auto-refresh');
    rwaTableBody = document.getElementById('rwa-table-body');
}

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

// 获取价格数据 - 重写版本，确保数据能显示
async function fetchPrices() {
    if (isRefreshing) return;
    
    isRefreshing = true;
    if (refreshBtn) {
        refreshBtn.classList.add('loading');
        refreshBtn.disabled = true;
    }

    // 立即显示加载状态
    if (btcPriceHero) btcPriceHero.textContent = '加载中...';
    if (ethPriceHero) ethPriceHero.textContent = '加载中...';

    try {
        const params = new URLSearchParams({
            ids: CURRENCIES.join(','),
            vs_currencies: VS_CURRENCY,
            include_24hr_change: 'true'
        });

        // 检查缓存（延长缓存时间到10分钟）
        const now = Date.now();
        if (priceCache.data && (now - priceCache.timestamp) < CACHE_DURATION * 10) {
            console.log('使用缓存的价格数据');
            const cachedData = priceCache.data;
            if (cachedData.bitcoin && cachedData.ethereum) {
                const btc24hChange = cachedData.bitcoin[`${VS_CURRENCY}_24h_change`] || 0;
                const eth24hChange = cachedData.ethereum[`${VS_CURRENCY}_24h_change`] || 0;
                const btcCurrentPrice = cachedData.bitcoin[VS_CURRENCY];
                const ethCurrentPrice = cachedData.ethereum[VS_CURRENCY];
                const btc24hPrice = btc24hChange !== 0 ? btcCurrentPrice / (1 + btc24hChange / 100) : btcCurrentPrice;
                const eth24hPrice = eth24hChange !== 0 ? ethCurrentPrice / (1 + eth24hChange / 100) : ethCurrentPrice;
                updatePriceDisplay('bitcoin', cachedData, btc24hPrice);
                updatePriceDisplay('ethereum', cachedData, eth24hPrice);
                isRefreshing = false;
                if (refreshBtn) {
                    refreshBtn.classList.remove('loading');
                    refreshBtn.disabled = false;
                }
                return;
            }
        }

        // 简化的请求函数，使用更短的超时时间
        const fetchPriceData = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
            
            try {
                const response = await fetch(`${API_URL}?${params}`, {
                    headers: { 'Accept': 'application/json' },
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                clearTimeout(timeoutId);
                throw error;
            }
        };

        // 尝试获取数据，最多重试2次
        let data = null;
        let lastError = null;
        
        for (let attempt = 0; attempt < 2; attempt++) {
            try {
                data = await fetchPriceData();
                break;
            } catch (error) {
                lastError = error;
                console.warn(`价格请求失败 (尝试 ${attempt + 1}/2):`, error.message);
                if (attempt < 1) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        }

        // 如果成功获取数据
        if (data && data.bitcoin && data.ethereum) {
            // 更新缓存
            priceCache.data = data;
            priceCache.timestamp = Date.now();

            // 计算并显示价格
            const btc24hChange = data.bitcoin[`${VS_CURRENCY}_24h_change`] || 0;
            const eth24hChange = data.ethereum[`${VS_CURRENCY}_24h_change`] || 0;
            const btcCurrentPrice = data.bitcoin[VS_CURRENCY];
            const ethCurrentPrice = data.ethereum[VS_CURRENCY];
            const btc24hPrice = btc24hChange !== 0 
                ? btcCurrentPrice / (1 + btc24hChange / 100)
                : btcCurrentPrice;
            const eth24hPrice = eth24hChange !== 0
                ? ethCurrentPrice / (1 + eth24hChange / 100)
                : ethCurrentPrice;

            updatePriceDisplay('bitcoin', data, btc24hPrice);
            updatePriceDisplay('ethereum', data, eth24hPrice);
            return;
        }

        // 如果请求失败，尝试使用缓存
        throw lastError || new Error('无法获取价格数据');

    } catch (error) {
        console.error('获取价格失败:', error);
        
        // 使用缓存数据（即使过期也使用）
        if (priceCache.data && priceCache.data.bitcoin && priceCache.data.ethereum) {
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
        } else {
            // 显示默认值
            if (btcPriceHero) btcPriceHero.textContent = '--';
            if (ethPriceHero) ethPriceHero.textContent = '--';
            if (btcChangeHero) {
                const changeText = btcChangeHero.querySelector('.change-text');
                if (changeText) changeText.textContent = '--';
            }
            if (ethChangeHero) {
                const changeText = ethChangeHero.querySelector('.change-text');
                if (changeText) changeText.textContent = '--';
            }
        }
    } finally {
        isRefreshing = false;
        if (refreshBtn) {
            refreshBtn.classList.remove('loading');
            refreshBtn.disabled = false;
        }
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
    const price = priceData?.usd || null;
    const change24h = priceData?.usd_24h_change !== undefined && priceData?.usd_24h_change !== null ? priceData.usd_24h_change : null;
    const marketCap = marketData?.market_cap?.usd || null;
    
    const row = document.createElement('tr');
    row.dataset.category = project.category || 'other';
    row.style.cursor = 'pointer';
    
    const changeClass = change24h !== null ? (change24h > 0 ? 'positive' : change24h < 0 ? 'negative' : '') : '';
    
    // 格式化价格显示
    const priceDisplay = price !== null ? formatPrice(price) : 'N/A';
    const changeDisplay = change24h !== null ? `${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%` : 'N/A';
    const marketCapDisplay = marketCap !== null ? formatMarketCap(marketCap) : 'N/A';
    
    row.innerHTML = `
        <td class="col-rank">${rank}</td>
        <td class="col-name">
            <div class="project-name">
                <div class="project-logo">${(project.symbol || project.name).charAt(0).toUpperCase()}</div>
                <div class="project-info">
                    <div class="project-title">${project.name || 'N/A'}</div>
                    <div class="project-symbol">${project.symbol || ''}</div>
                </div>
            </div>
        </td>
        <td class="col-category">
            <span class="category-badge">${getCategoryLabel(project.category)}</span>
        </td>
        <td class="col-price">${priceDisplay}</td>
        <td class="col-change">
            <div class="change-cell">
                <span class="change-value ${changeClass}">
                    ${changeDisplay}
                </span>
            </div>
        </td>
        <td class="col-marketcap">${marketCapDisplay}</td>
    `;
    
    // 添加点击事件
    row.addEventListener('click', () => {
        if (project.id) {
            window.open(`https://www.coingecko.com/en/coins/${project.id}`, '_blank');
        }
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

// 获取RWA项目数据 - 重写版本，确保数据能显示
async function fetchRWAProjects() {
    if (!rwaTableBody) {
        console.error('rwaTableBody元素不存在');
        return;
    }

    // 立即显示加载状态
    rwaTableBody.innerHTML = `
        <tr>
            <td colspan="6" class="loading-row">
                <div class="loading-spinner"></div>
                <span>正在加载RWA项目信息...</span>
            </td>
        </tr>
    `;

    // 先创建基本项目列表（不依赖API），确保至少能显示项目
    rwaProjectsData = RWA_PROJECTS.map(project => ({
        project: project,
        priceData: {
            usd: null,
            usd_24h_change: null
        },
        marketData: null
    }));

    // 检查缓存（延长缓存时间到30分钟）
    const now = Date.now();
    if (rwaCache.data && rwaCache.data.projects && (now - rwaCache.timestamp) < CACHE_DURATION * 30) {
        console.log('使用缓存的RWA数据');
        rwaProjectsData = rwaCache.data.projects;
        filterRWAProjects(currentCategory);
        return;
    }

    // 尝试获取API数据（异步，不阻塞显示）
    try {
        // 简化的请求函数
        const fetchBatchData = async (batchIds) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8秒超时
            
            try {
                const priceParams = new URLSearchParams({
                    ids: batchIds,
                    vs_currencies: VS_CURRENCY,
                    include_24hr_change: 'true'
                });

                const [priceResponse] = await Promise.allSettled([
                    fetch(`${API_URL}?${priceParams}`, {
                        headers: { 'Accept': 'application/json' },
                        signal: controller.signal
                    }).then(r => {
                        if (!r.ok) throw new Error(`HTTP ${r.status}`);
                        return r.json();
                    })
                ]);

                clearTimeout(timeoutId);
                
                if (priceResponse.status === 'fulfilled') {
                    return priceResponse.value;
                }
                return null;
            } catch (error) {
                clearTimeout(timeoutId);
                return null;
            }
        };

        // 分批获取数据，每批5个项目
        const batchSize = 5;
        const allPriceData = {};

        for (let i = 0; i < RWA_PROJECTS.length; i += batchSize) {
            const batch = RWA_PROJECTS.slice(i, i + batchSize);
            const batchIds = batch.map(p => p.id).join(',');
            
            try {
                const priceData = await fetchBatchData(batchIds);
                if (priceData) {
                    Object.assign(allPriceData, priceData);
                }
                // 批次间延迟
                await new Promise(resolve => setTimeout(resolve, 300));
            } catch (error) {
                console.warn('批次请求失败:', error);
            }
        }

        // 更新项目数据
        rwaProjectsData = RWA_PROJECTS.map(project => {
            const priceInfo = allPriceData[project.id];
            return {
                project: project,
                priceData: priceInfo || {
                    usd: null,
                    usd_24h_change: null
                },
                marketData: null
            };
        });
        
        // 更新缓存
        rwaCache.data = {
            projects: rwaProjectsData,
            priceData: allPriceData,
            marketData: []
        };
        rwaCache.timestamp = Date.now();

    } catch (error) {
        console.warn('API请求失败，使用基本项目列表:', error);
        // 继续使用基本项目列表
    }

    // 应用当前筛选（无论API是否成功）
    if (rwaProjectsData.length > 0) {
        filterRWAProjects(currentCategory);
    } else {
        rwaTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="loading-row">
                    <span>暂无RWA项目数据</span>
                </td>
            </tr>
        `;
        updateRWAStats([]);
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
function loadResearchData() {
    const tbody = document.getElementById('research-table-body');
    
    try {
        // 检查是否已加载内嵌数据
        if (typeof RESEARCH_DATA !== 'undefined' && RESEARCH_DATA) {
            const data = RESEARCH_DATA;
            
            if (!data || (!data.RWA && !data.DAT && !data.DAPE)) {
                throw new Error('内嵌数据格式不正确或为空');
            }
            
            researchData = {
                RWA: data.RWA || [],
                DAT: data.DAT || [],
                DAPE: data.DAPE || []
            };
            
            // 保存headers信息（如果存在）
            if (data.headers) {
                researchData.headers = data.headers;
            }
            
            console.log('研究数据加载成功（内嵌数据）:', {
                RWA: researchData.RWA.length,
                DAT: researchData.DAT.length,
                DAPE: researchData.DAPE.length
            });
        } else {
            // 如果没有内嵌数据，尝试从JSON文件加载
            console.log('尝试从JSON文件加载数据...');
            loadResearchDataFromFile();
            return;
        }
        
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
        
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="loading-row">
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
        }
        
        // 更新统计为0
        const rwaCountEl = document.getElementById('rwa-count');
        const datCountEl = document.getElementById('dat-count');
        const dapeCountEl = document.getElementById('dape-count');
        if (rwaCountEl) rwaCountEl.textContent = '0';
        if (datCountEl) datCountEl.textContent = '0';
        if (dapeCountEl) dapeCountEl.textContent = '0';
    }
}

// 从JSON文件加载（备用方案）
async function loadResearchDataFromFile() {
    const tbody = document.getElementById('research-table-body');
    
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="loading-row">
                    <div class="loading-spinner"></div>
                    <span>正在从文件加载研究数据...</span>
                </td>
            </tr>
        `;
    }
    
    try {
        // 尝试多个可能的路径
        const possiblePaths = [
            './research_data.json',
            'research_data.json',
            '/research_data.json'
        ];
        
        let response = null;
        
        for (const path of possiblePaths) {
            try {
                response = await fetch(path);
                if (response.ok) {
                    break;
                }
            } catch (e) {
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
        
        console.log('研究数据加载成功（从文件）:', {
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
        console.error('从文件加载研究数据失败:', error);
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="loading-row">
                        <span style="color: var(--accent-red);">⚠️ 无法加载研究数据</span>
                        <br>
                        <span style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem; display: block;">
                            错误: ${error.message}
                        </span>
                    </td>
                </tr>
            `;
        }
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
function createResearchRow(item, index, category = 'RWA') {
    if (!item) {
        console.error('项目数据为空');
        return null;
    }
    
    const row = document.createElement('tr');
    
    // 根据类别获取正确的字段名
    let projectName, platform, status, assetSize;
    
    if (category === 'RWA') {
        projectName = item['项目名称'] || '';
        platform = item['发行方 / 平台'] || '';
        status = item['项目状态'] || item['当前状态'] || '';
        assetSize = formatAssetSize(item['资产规模（USD）'] || item['金库规模（USD）'] || '');
    } else if (category === 'DAT') {
        projectName = item['项目名称'] || '';
        platform = item['公司主体'] || item['发行方 / 平台'] || '';
        status = item['项目状态'] || '';
        assetSize = formatAssetSize(item['金库规模（USD）'] || item['资产规模（USD）'] || '');
    } else if (category === 'DAPE') {
        projectName = item['标的简称'] || item['项目名称'] || '';
        platform = item['投资方'] || item['公司主体'] || item['发行方 / 平台'] || '';
        status = item['项目状态'] || '';
        assetSize = formatAssetSize(item['金额'] || item['募资金额'] || '');
    } else {
        // 默认尝试所有可能的字段
        projectName = item['标的简称'] || item['项目名称'] || '';
        platform = item['公司主体'] || item['发行方 / 平台'] || item['投资方'] || '';
        status = item['项目状态'] || item['当前状态'] || '';
        assetSize = formatAssetSize(item['金额'] || item['募资金额'] || item['资产规模（USD）'] || item['金库规模（USD）'] || '');
    }
    
    // 转换为字符串并处理空值
    projectName = projectName.toString() || 'N/A';
    platform = platform.toString() || 'N/A';
    status = status.toString() || 'N/A';
    assetSize = assetSize.toString() || 'N/A';
    
    // 转义HTML防止XSS
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };
    
    const firstChar = projectName && projectName !== 'N/A' && projectName.length > 0 ? projectName.charAt(0) : '?';
    
    row.innerHTML = `
        <td class="col-rank">${index + 1}</td>
        <td class="col-name">
            <div class="project-name">
                <div class="project-logo">${escapeHtml(firstChar)}</div>
                <div class="project-info">
                    <div class="project-title">${escapeHtml(projectName)}</div>
                </div>
            </div>
        </td>
        <td class="col-platform">${escapeHtml(platform)}</td>
        <td class="col-status">${escapeHtml(status)}</td>
        <td class="col-asset-size">${escapeHtml(assetSize)}</td>
        <td class="col-actions">
            <button class="view-details-btn" data-index="${index}">详情</button>
        </td>
    `;
    
    // 添加详情按钮事件
    const detailBtn = row.querySelector('.view-details-btn');
    if (detailBtn) {
        detailBtn.addEventListener('click', () => {
            showProjectDetails(item, category);
        });
    }
    
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
    
    // 检查数据是否已加载
    if (!researchData || (!researchData.RWA && !researchData.DAT && !researchData.DAPE)) {
        console.warn('研究数据尚未加载，尝试重新加载...');
        loadResearchData();
        return;
    }
    
    let filteredData = [];
    if (category === 'all') {
        filteredData = [
            ...(researchData.RWA || []),
            ...(researchData.DAT || []),
            ...(researchData.DAPE || [])
        ];
    } else {
        filteredData = researchData[category] || [];
    }
    
    const tbody = document.getElementById('research-table-body');
    if (!tbody) {
        console.error('找不到 research-table-body 元素');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (filteredData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="loading-row">
                    <span>该分类下暂无数据</span>
                </td>
            </tr>
        `;
        return;
    }
    
    filteredData.forEach((item, index) => {
        try {
            const row = createResearchRow(item, index, category);
            if (row) {
                tbody.appendChild(row);
            }
        } catch (error) {
            console.error('创建表格行失败:', error, item);
        }
    });
}

// 显示项目详情
function showProjectDetails(item, category = 'RWA') {
    if (!item) {
        console.error('项目数据为空');
        return;
    }
    
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalTitle || !modalBody) {
        console.error('找不到模态框元素');
        return;
    }
    
    // 根据类别获取项目名称
    let projectName;
    if (category === 'DAPE') {
        projectName = (item['标的简称'] || item['项目名称'] || '项目详情').toString();
    } else {
        projectName = (item['项目名称'] || '项目详情').toString();
    }
    modalTitle.textContent = projectName;
    
    // 转义HTML
    const escapeHtml = (text) => {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text.toString();
        return div.innerHTML;
    };
    
    // 创建链接
    const createLink = (url, text) => {
        if (!url || url === 'N/A' || url === '') return escapeHtml(text || 'N/A');
        const urlStr = url.toString();
        if (urlStr.startsWith('http')) {
            return `<a href="${escapeHtml(urlStr)}" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">${escapeHtml(text || urlStr)}</a>`;
        }
        return escapeHtml(text || urlStr);
    };
    
    // 核心必填字段（按照用户要求）
    const coreFields = [
        '项目名称', '发行方 / 平台', '发行时间', '发行地区 / 监管框架（SPV）',
        '底层资产地区', '行业', '资产形态', '权利类型', 'Token 类型',
        '募资金额', '融资币种', '交易所 / 承销', '资产规模（USD）'
    ];
    
    // 其他重要字段
    const additionalFields = [
        '标的简称', '公司主体', '行业赛道', '项目状态', '当前状态',
        '资产类型', '资产说明', '现金流特征', '托管 / 审计方', 
        '托管', '托管机构', '审计方', 'Token 名称 / 符号',
        '经济属性', '投资/消费属性', '收益分配方式', '年化收益率（APY）',
        '币链评分（0-100）', '投资逻辑摘要', '风险点', '复盘结论',
        '链上地址', '可视化仪表盘', '法律文件', '标签', '一句话简介',
        '交易时间', '轮次', '金额', '投资方', '金库规模（USD）',
        '公链 / 合约标准', '辖区（上市/运营）', 'DAT目标', '合规路径'
    ];
    
    // 合并所有字段，核心字段在前
    const allFields = [...coreFields];
    additionalFields.forEach(field => {
        if (!allFields.includes(field)) {
            allFields.push(field);
        }
    });
    
    let html = '<div class="detail-grid">';
    
    // 先显示核心字段
    html += '<div class="detail-section"><h3 style="color: var(--accent-cyan); margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">核心信息</h3></div>';
    
    coreFields.forEach(field => {
        let value = item[field] || '';
        // 对于DAPE类别，特殊处理字段映射
        if (category === 'DAPE' && field === '项目名称' && !value) {
            value = item['标的简称'] || '';
        }
        if (category === 'DAT' && field === '发行方 / 平台' && !value) {
            value = item['公司主体'] || '';
        }
        if (category === 'RWA' && field === '行业' && !value) {
            value = item['行业赛道'] || '';
        }
        
        if (value && value !== 'N/A' && value !== '' && String(value).trim() !== '') {
            value = escapeHtml(value.toString());
            html += `
                <div class="detail-item">
                    <div class="detail-label">${escapeHtml(field)}</div>
                    <div class="detail-value">${value}</div>
                </div>
            `;
        }
    });
    
    // 再显示其他字段
    html += '<div class="detail-section" style="margin-top: 2rem;"><h3 style="color: var(--accent-cyan); margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">其他信息</h3></div>';
    
    additionalFields.forEach(field => {
        let value = item[field] || '';
        if (value && value !== 'N/A' && value !== '' && String(value).trim() !== '') {
            // 特殊处理链接字段
            if (field === '可视化仪表盘' || field === '链上地址' || field === '法律文件' || field === '项目链接' || field === '白皮书') {
                value = createLink(value, value);
            } else {
                value = escapeHtml(value.toString());
            }
            
            html += `
                <div class="detail-item">
                    <div class="detail-label">${escapeHtml(field)}</div>
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
    // 初始化DOM元素
    initDOMElements();
    
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
    
    // 手动刷新按钮
    if (refreshBtn) {
        refreshBtn.addEventListener('click', fetchPrices);
    }
    
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
    
    // 立即加载数据
    fetchPrices();
    fetchRWAProjects();
    loadResearchData();
    
    // 自动刷新控制
    if (autoRefreshCheckbox && autoRefreshCheckbox.checked) {
        startAutoRefresh();
    }
    
    // RWA项目每5分钟刷新一次
    setInterval(fetchRWAProjects, 300000);
});
