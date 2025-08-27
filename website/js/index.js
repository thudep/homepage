document.addEventListener('DOMContentLoaded', function() {
    fetch('./index/show.json')
        .then(response => response.json())
        .then(data => {
            // 初始化轮播图
            initCarousel(data);
        })
        .catch(error => console.error('Error loading news:', error));
    
    function initCarousel(data) {
        const carousel = document.querySelector('.news-carousel');
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        const loadingElement = document.querySelector('.loading');
        
        // 移除加载提示
        if (loadingElement) {
            loadingElement.remove();
        }
        
        // 清空指示器容器
        indicatorsContainer.innerHTML = '';
        
        // 创建轮播项目和指示器
        data.forEach((news, index) => {
            // 创建轮播项目
            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item';
            if (index === 0) carouselItem.classList.add('active');
            
            carouselItem.innerHTML = `
                <a href="${news.url}" class="image-link" target="_blank">
                    <img src="index/${news.cover_image}" alt="" class="news-image">
                </a>
                <div class="title-container">
                    <h2 class="news-title">${news.title}</h2>
                </div>
            `;
            
            carousel.insertBefore(carouselItem, document.querySelector('.carousel-control.next'));
            
            // 创建指示器
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (index === 0) indicator.classList.add('active');
            indicatorsContainer.appendChild(indicator);
        });
        
        // 初始化轮播功能
        initCarouselFunctionality();
    }
    
    function initCarouselFunctionality() {
        const items = document.querySelectorAll('.carousel-item');
        const indicators = document.querySelectorAll('.indicator');
        const prevBtn = document.querySelector('.carousel-control.prev');
        const nextBtn = document.querySelector('.carousel-control.next');
        const carousel = document.querySelector('.news-carousel');

        let currentIndex = 0;
        const interval = 5000; // 总时长 5s
        let autoScroll = null;
        let remaining = interval;
        let startTime = null;

        // 更新轮播状态
        function updateCarousel() {
            items.forEach(item => item.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));

            items[currentIndex].classList.add('active');
            indicators[currentIndex].classList.add('active');
        }

        function scheduleNextSlide(delay) {
            clearTimeout(autoScroll);
            startTime = Date.now();
            autoScroll = setTimeout(() => {
                nextSlide();
            }, delay);
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % items.length;
            updateCarousel();
            scheduleNextSlide(interval);
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            updateCarousel();
            scheduleNextSlide(interval);
        }

        // 点击指示器切换
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
                scheduleNextSlide(interval);
            });
        });

        // 按钮事件
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // 启动
        scheduleNextSlide(interval);

        // 鼠标悬停时暂停
        carousel.addEventListener('mouseenter', () => {
            clearTimeout(autoScroll);
            remaining = interval - (Date.now() - startTime); // 剩余时间
        });

        carousel.addEventListener('mouseleave', () => {
            scheduleNextSlide(remaining);
        });

        // 键盘导航
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });
    }
});
