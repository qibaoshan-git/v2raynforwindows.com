// 获取DOM元素
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
const main = document.querySelector('main');

// 点击汉堡菜单按钮时的处理
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
    
    if (window.innerWidth <= 768) {
        if (nav.classList.contains('active')) {
            main.style.transform = 'translateY(400px)';
        } else {
            main.style.transform = 'translateY(0)';
        }
    }
});

// 监听滚动事件（添加节流控制）
let lastScrollTop = 0;
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        return;
    }
    
    scrollTimeout = setTimeout(() => {
        if (window.innerWidth <= 768) {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScroll > lastScrollTop && nav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                main.style.transform = 'translateY(0)';
            }
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        }
        scrollTimeout = null;
    }, 100);
});

// 点击导航链接时关闭菜单
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            main.style.transform = 'translateY(0)';
        }
    });
});

// 监听窗口大小变化（添加节流控制）
let resizeTimeout;
window.addEventListener('resize', () => {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 768) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            main.style.transform = 'translateY(0)';
        }
    }, 100);
});

// 目录生成和切换功能
document.addEventListener('DOMContentLoaded', function() {
    const catalogContainer = document.querySelector('.catalog-container');
    const catalogToggle = document.querySelector('.catalog-toggle');
    const mainContent = document.querySelector('.article-content');
    
    if (catalogToggle && catalogContainer && mainContent) {
        // 切换目录显示/隐藏
        catalogToggle.addEventListener('click', function() {
            const isHidden = catalogContainer.style.display === 'none';
            catalogContainer.style.display = isHidden ? 'block' : 'none';
            catalogToggle.classList.toggle('active');
        });

        // 生成目录
        const headings = mainContent.querySelectorAll('h2, h3');
        if (headings.length > 0) {
            const ul = document.createElement('ul');
            let currentH2Index = 0;
            let currentH3Index = 0;
            let currentH2Item = null;
            let currentH2Ul = null;

            headings.forEach(heading => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                
                // 为每个标题生成唯一ID
                if (!heading.id) {
                    heading.id = heading.textContent.trim().replace(/\s+/g, '-').toLowerCase();
                }
                
                a.href = '#' + heading.id;
                
                // 根据标题层级设置编号和样式
                if (heading.tagName === 'H2') {
                    currentH2Index++;
                    currentH3Index = 0;
                    a.textContent = currentH2Index + '. ' + heading.textContent;
                    li.classList.add('catalog-h2');
                    currentH2Item = li;
                    currentH2Ul = document.createElement('ul');
                    li.appendChild(a);
                    ul.appendChild(li);
                } else if (heading.tagName === 'H3') {
                    currentH3Index++;
                    a.textContent = currentH2Index + '.' + currentH3Index + ' ' + heading.textContent;
                    li.classList.add('catalog-h3');
                    if (currentH2Ul) {
                        currentH2Ul.appendChild(li);
                        if (!currentH2Ul.parentNode) {
                            currentH2Item.appendChild(currentH2Ul);
                        }
                    }
                }
                
                li.appendChild(a);
                
                // 点击目录项时滚动到对应位置
                a.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetHeading = document.querySelector(this.getAttribute('href'));
                    if (targetHeading) {
                        const offset = 80; // 考虑固定导航栏的高度
                        const targetPosition = targetHeading.offsetTop - offset;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        // 移动端自动隐藏目录
                        if (window.innerWidth <= 768) {
                            catalogContainer.style.display = 'none';
                            catalogToggle.classList.remove('active');
                        }
                    }
                });
            });

            catalogContainer.appendChild(ul);
        }
    }
});

// 添加平滑滚动效果
function addSmoothScroll() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.catalog-list a')) {
            e.preventDefault();
            const link = e.target.closest('a');
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
}

// 从导航栏和侧边栏收集所有可能的文章
function collectArticles() {
    const articles = [];
    
    // 定义标题扩展映射
    const titleExtensions = {
        '客户端大全': ' - 最新科学上网工具汇总',
        '使用教程': ' - 详细图文配置说明',
        '下载Surfboard': ' - 安卓最新版本下载',
        '机场推荐': ' - 稳定高速节点推荐',
        '机场优惠码': ' - 最新优惠活动整理',
        '免费节点': ' - 免费节点收集与更新',
        '官网地址': ' - 官方最新地址发布',
        '安卓手机怎么科学上网': ' - 安卓手机翻墙指南',
        '苹果手机怎么科学上网': ' - iPhone翻墙教程',
        'Windows电脑怎么科学上网': ' - PC电脑翻墙方法',
        'Mac电脑怎么科学上网': ' - MacOS翻墙教程',
        'Linux电脑怎么科学上网': ' - Linux系统翻墙指南'
    };
    
    // 收集导航栏链接
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        const baseTitle = link.textContent;
        const extendedTitle = baseTitle + (titleExtensions[baseTitle] || ' - 使用教程');
        articles.push({
            title: extendedTitle,
            url: link.getAttribute('href')
        });
    });
    
    // 收集侧边栏链接
    const sidebarLinks = document.querySelectorAll('.sidebar-list a');
    sidebarLinks.forEach(link => {
        const baseTitle = link.textContent.replace(/👉|👈/g, '').trim();
        const extendedTitle = baseTitle + (titleExtensions[baseTitle] || ' - 详细教程');
        articles.push({
            title: extendedTitle,
            url: link.getAttribute('href')
        });
    });
    
    return articles;
}

// 生成随机相关推荐
function generateRandomRecommendations() {
    const recommendationsList = document.querySelector('.related-articles ul');
    if (!recommendationsList) {
        console.log('未找到相关推荐列表元素');
        return;
    }

    // 获取所有可能的文章
    const allArticles = collectArticles();
    
    // 如果没有收集到文章，添加一些默认推荐
    if (allArticles.length === 0) {
        const defaultArticles = [
            { title: 'Surfboard使用教程 - 详细图文配置说明', url: '#' },
            { title: 'Clash for Android - 安卓翻墙工具推荐', url: '#' },
            { title: 'V2RayNG - 安卓科学上网工具', url: '#' },
            { title: 'NekoBox for Android - 安卓代理工具', url: '#' }
        ];
        
        // 添加到页面
        defaultArticles.forEach(article => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${article.url}">👉 ${article.title}</a>`;
            recommendationsList.appendChild(li);
        });
        
        console.log('使用默认推荐内容');
        return;
    }
    
    // 清空现有推荐
    recommendationsList.innerHTML = '';

    // 随机选择4篇文章
    const shuffled = [...allArticles].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    // 添加到页面
    selected.forEach(article => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${article.url}">👉 ${article.title}</a>`;
        recommendationsList.appendChild(li);
    });
    
    console.log('成功生成相关推荐');
}

// 回到顶部按钮功能
const backToTopButton = document.getElementById('back-to-top');

// 监听滚动事件，控制按钮显示/隐藏
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

// 点击按钮回到顶部
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 页面加载时执行初始化
document.addEventListener('DOMContentLoaded', () => {
    initCatalogToggle();
    addSmoothScroll();
    generateRandomRecommendations();
});

// 页面完全加载后生成二维码
window.addEventListener('load', () => {
    const qrcodeDiv = document.getElementById('qrcode');
    if (qrcodeDiv) {
        // 清除旧的二维码
        qrcodeDiv.innerHTML = '';
        
        // 构建完整的URL
            const baseURL = 'https://v2raynforwindows.com';
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        const currentHash = window.location.hash;
        const currentURL = baseURL + currentPath + currentSearch + currentHash;
        
        // 创建新的二维码
        new QRCode(qrcodeDiv, {
            text: currentURL,
            width: 128,
            height: 128,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
});

// 社交分享功能
function shareToSocial(platform) {
    const url = window.location.href;
    const title = document.title;
    
    switch(platform) {
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
            break;
        case 'twitter':
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
            break;
        case 'telegram':
            window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
            break;
        case 'copy':
            navigator.clipboard.writeText(url).then(() => {
                showToast('链接已复制到剪贴板');
            });
            break;
    }
}

// 显示提示信息
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2000);
}

// 验证码和节点内容处理
document.addEventListener('DOMContentLoaded', function() {
    const verifySection = document.getElementById('verify-section');
    const nodeContent = document.getElementById('node-content');
    const verifyInput = document.getElementById('verify-input');
    const verifySubmit = document.getElementById('verify-submit');
    const refreshButton = document.querySelector('.refresh-button');
    const nodeItems = document.querySelectorAll('.node-item');

    // 验证码提交处理
    verifySubmit.addEventListener('click', function() {
        const code = verifyInput.value.trim().toLowerCase();
        if (code === 'v2raynforwindows.com') {
            // 显示成功提示，需要用户手动点击确定
            const confirmResult = confirm('验证成功！点击确定查看内容');
            if (confirmResult) {
                verifySection.style.display = 'none';
                nodeContent.style.display = 'block';
                // 存储验证状态到本地存储
                localStorage.setItem('nodeVerified', 'true');
            }
        } else {
            alert('验证码错误，请重新输入！');
            verifyInput.value = '';
        }
    });

    // 回车键提交
    verifyInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifySubmit.click();
        }
    });

    // 检查是否已验证
    if (localStorage.getItem('nodeVerified') === 'true') {
        verifySection.style.display = 'none';
        nodeContent.style.display = 'block';
    }

    // 复制节点
    nodeItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.textContent;
            navigator.clipboard.writeText(text).then(() => {
                const originalBg = this.style.backgroundColor;
                this.style.backgroundColor = '#d4edda';
                setTimeout(() => {
                    this.style.backgroundColor = originalBg;
                }, 500);
            }).catch(err => {
                console.error('复制失败:', err);
            });
        });
    });

    // 复制主节点按钮
    if (refreshButton) {
        refreshButton.textContent = '复制所有节点';
        refreshButton.addEventListener('click', function() {
            if (nodeItems.length > 0) {
                const allNodes = Array.from(nodeItems).map(node => node.textContent).join('\n');
                navigator.clipboard.writeText(allNodes).then(() => {
                    const originalText = this.textContent;
                    this.textContent = '已复制！';
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 1000);
                }).catch(err => {
                    console.error('复制失败:', err);
                });
            }
        });
    }

    // 添加toast样式
    const style = document.createElement('style');
    style.textContent = `
        .verify-toast {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 1000;
        }
    `;
    document.head.appendChild(style);
});

// 更新时间显示
function updateDateTime() {
    const updateTimeElement = document.querySelector('.update-time');
    if (updateTimeElement) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        updateTimeElement.textContent = `(最后更新于${year}/${month}/${day})`;
    }
}

// 机场排序功能
function shuffleAirports() {
    const airportContainer = document.querySelector('.article-content');
    if (!airportContainer) return;

    // 获取"Top 10 高速稳定v2rayn节点购买机场推荐"后的所有机场区块
    const allSections = Array.from(airportContainer.querySelectorAll('.article-section'));
    const startIndex = allSections.findIndex(section => {
        const title = section.querySelector('h2');
        return title && title.textContent.includes('Top 10');
    });

    if (startIndex === -1) return;

    // 获取机场区块（从Top 10标题后面开始）
    const airports = allSections.slice(startIndex + 1).filter(section => {
        const title = section.querySelector('h2');
        return title && title.textContent.includes('机场');
    });

    // 如果机场数量少于4个，不需要随机排序
    if (airports.length < 4) return;

    // 定义前三名机场的名称和它们的完整区块
    const topThreeOrder = ['魔法门', '速运梯', '三番云'];
    const topThree = [];
    const remainingAirports = [];

    // 首先找出前三名机场和其他机场
    airports.forEach(airport => {
        const title = airport.querySelector('h2').textContent;
        let found = false;
        for (let i = 0; i < topThreeOrder.length; i++) {
            if (title.includes(topThreeOrder[i])) {
                topThree[i] = airport;
                found = true;
                break;
            }
        }
        if (!found) {
            remainingAirports.push(airport);
        }
    });

    // 检查是否需要重新随机排序
    const lastShuffleTime = localStorage.getItem('lastShuffleTime');
    const currentTime = new Date().getTime();
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // 一周的毫秒数

    if (!lastShuffleTime || (currentTime - parseInt(lastShuffleTime)) > oneWeek) {
        // 随机排序剩余的机场
        for (let i = remainingAirports.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [remainingAirports[i], remainingAirports[j]] = [remainingAirports[j], remainingAirports[i]];
        }

        // 更新最后随机排序时间
        localStorage.setItem('lastShuffleTime', currentTime.toString());

        // 保存随机顺序
        const shuffledOrder = remainingAirports.map(airport => {
            const title = airport.querySelector('h2').textContent;
            return title;
        });
        localStorage.setItem('airportOrder', JSON.stringify(shuffledOrder));
    } else {
        // 使用保存的顺序
        const savedOrder = JSON.parse(localStorage.getItem('airportOrder') || '[]');
        if (savedOrder.length > 0) {
            remainingAirports.sort((a, b) => {
                const titleA = a.querySelector('h2').textContent;
                const titleB = b.querySelector('h2').textContent;
                return savedOrder.indexOf(titleA) - savedOrder.indexOf(titleB);
            });
        }
    }

    // 获取正确的插入位置（Top 10标题的后面）
    const insertPosition = allSections[startIndex];

    // 移除原有的机场区块
    airports.forEach(airport => airport.remove());

    // 按照固定顺序重新添加前三名机场，然后是随机排序的其他机场
    const orderedAirports = [
        ...topThree.filter(Boolean), // 保持前三名的固定顺序
        ...remainingAirports
    ];

    // 在正确的位置按顺序插入所有机场
    orderedAirports.reverse().forEach(airport => {
        if (airport) {
            insertPosition.insertAdjacentElement('afterend', airport);
        }
    });
}

// 自动更新优惠码截至日期
function updateExpiryDate() {
    const today = new Date();
    let expiryDate = new Date();
    
    // 获取当月的15号和月底
    const mid = new Date(today.getFullYear(), today.getMonth(), 15);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // 如果今天是15号之前，截至日期设为15号
    // 如果今天是15号之后，截至日期设为月底
    if (today <= mid) {
        expiryDate = mid;
    } else {
        expiryDate = end;
    }
    
    // 格式化日期为 YYYY/MM/DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    // 更新所有优惠码的截至日期
    const descElements = document.querySelectorAll('.desc');
    descElements.forEach(desc => {
        const text = desc.innerHTML;
        // 只更新非"长期有效"的优惠码
        if (text.includes('截至日期') && !text.includes('长期有效')) {
            const [discountText, dateText] = text.split('<br>');
            desc.innerHTML = `${discountText}<br>截至日期${formatDate(expiryDate)}`;
        }
    });

    // 更新页面顶部的最后更新时间
    const updateTimeElement = document.querySelector('.update-time');
    if (updateTimeElement) {
        updateTimeElement.textContent = `(最后更新于${formatDate(today)})`;
    }

    // 将当前的截至日期保存到localStorage
    localStorage.setItem('lastExpiryDate', formatDate(expiryDate));
}

// 页面加载时执行更新
document.addEventListener('DOMContentLoaded', function() {
    // 从localStorage获取上次保存的截至日期
    const savedExpiryDate = localStorage.getItem('lastExpiryDate');
    
    if (savedExpiryDate) {
        // 如果有保存的日期，使用保存的日期更新页面
        const descElements = document.querySelectorAll('.desc');
        descElements.forEach(desc => {
            const text = desc.innerHTML;
            if (text.includes('截至日期') && !text.includes('长期有效')) {
                const [discountText, dateText] = text.split('<br>');
                desc.innerHTML = `${discountText}<br>截至日期${savedExpiryDate}`;
            }
        });
    } else {
        // 如果没有保存的日期，生成新的日期
        updateExpiryDate();
    }
    
    // 每天检查一次是否需要更新日期
    setInterval(() => {
        const now = new Date();
        // 如果是凌晨0点，更新日期
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            updateExpiryDate();
        }
    }, 60000); // 每分钟检查一次

    // 立即更新一次时间
    updateDateTime();
    
    // 生成相关推荐
    generateRandomRecommendations();
    
    // 检查是否需要更新时间（每分钟检查一次）
    setInterval(() => {
        const now = new Date();
        // 如果是凌晨0点0分，更新时间
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            updateDateTime();
        }
    }, 60000); // 每分钟检查一次

    // 添加机场随机排序
    shuffleAirports();

    // 优惠码复制功能
    document.querySelectorAll('.code-container .copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            // 获取要复制的优惠码
            const code = this.previousElementSibling.textContent.trim();
            
            // 复制到剪贴板
            navigator.clipboard.writeText(code).then(() => {
                // 复制成功后的视觉反馈
                const originalText = this.textContent;
                this.textContent = '已复制!';
                this.style.backgroundColor = '#4CAF50';
                this.style.color = '#fff';
                
                // 2秒后恢复原样
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.backgroundColor = '';
                    this.style.color = '';
                }, 2000);
            }).catch(err => {
                console.error('复制失败:', err);
                alert('复制失败，请手动复制');
            });
        });
    });
});

// 优化内部链接
function optimizeInternalLinks() {
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach(link => {
        // 只为没有title的链接添加title
        if (!link.title) {
            link.title = link.textContent.trim();
        }
    });
}

// 页面加载完成后执行必要的优化
document.addEventListener('DOMContentLoaded', function() {
    optimizeInternalLinks();
    // ... existing code ...
}); 

