document.addEventListener('DOMContentLoaded', function(){    
    fetch('./publicity/publicity.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('tweets-container');
            container.innerHTML = ''; // 清空加载提示
            
            if(data.length === 0){
                container.innerHTML = '<div class="error">暂无文章数据</div>';
                return;
            }
            
            // 按日期倒序排序
            data.sort((a, b) => {
                // 将日期字符串转换为Date对象进行比较
                const dateA = new Date(a.publish_date);
                const dateB = new Date(b.publish_date);
                return dateB - dateA; // 倒序排列
            });

            // 创建推文卡片
            data.forEach(tweet => {
                const card = document.createElement('div');
                card.className = 'tweet-card';
                card.onclick = () => window.open(tweet.url, '_blank');
                
                card.innerHTML = `
                    <img src="./publicity/${tweet.cover_image}" alt="${tweet.title}" class="tweet-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7lm77moIdJbWFnZTwvdGV4dD48L3N2Zz4='">
                    <div class="tweet-content">
                        <div class="tweet-title">${tweet.title}</div>
                        <div class="tweet-date">${tweet.publish_date}</div>
                    </div>
                `;
                
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error loading tweets:', error);
            document.getElementById('tweets-container').innerHTML = `
                <div class="error">
                    加载数据失败: ${error.message}
                </div>
            `;
        });
});