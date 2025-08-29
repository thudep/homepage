document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const directoryMenu = document.querySelector('.directory-menu');
    const overlay = document.querySelector('.overlay');
    const menuItems = document.querySelector('.menu-items');
    const closeBtn = document.querySelector('.close-btn');
    
    // 收集所有链接
    const navLinks = document.querySelector('.nav-links');
    const allLinks = navLinks.querySelectorAll('a');
    const collectedLinks = [];
    
    // 去重并收集链接
    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent;
        
        // 检查是否已经收集过该链接
        if (href && text && !collectedLinks.some(item => item.href === href)) {
            collectedLinks.push({
                href: href,
                text: text
            });
        }
    });
    
    // 生成菜单项
    collectedLinks.forEach(link => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        
        a.href = link.href;
        a.innerHTML = `<i class="fas fa-link"></i> ${link.text}`;
        
        li.appendChild(a);
        menuItems.appendChild(li);
    });
    
    // 切换菜单显示
    menuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        directoryMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // 阻止事件冒泡
        event.stopPropagation();
    });
    
    // 点击关闭按钮关闭菜单
    closeBtn.addEventListener('click', function() {
        menuBtn.classList.remove('active');
        directoryMenu.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // 点击覆盖层关闭菜单
    overlay.addEventListener('click', function() {
        menuBtn.classList.remove('active');
        directoryMenu.classList.remove('active');
        this.classList.remove('active');
    });
    
    // 点击菜单项关闭菜单
    menuItems.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            menuBtn.classList.remove('active');
            directoryMenu.classList.remove('active');
            overlay.classList.remove('active');
        }
    });
    
    // 点击菜单外部关闭菜单
    document.addEventListener('click', function(e) {
        if (!directoryMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            menuBtn.classList.remove('active');
            directoryMenu.classList.remove('active');
            overlay.classList.remove('active');
        }
    });
});