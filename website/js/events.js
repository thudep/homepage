document.addEventListener('DOMContentLoaded', function(){    
    fetch('./events/events.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('events-container');
            container.innerHTML = ''; // 清空加载提示
            
            if(data.length === 0){
                container.innerHTML = '<div class="error">暂无赛事数据</div>';
                return;
            }

            // 创建赛事卡片
            data.forEach(event => {
                const card = document.createElement('div');
                card.className = 'event-card';
                card.onclick = () => window.open(event.url, '_blank');
                
                card.innerHTML = `
                    <img src="./events/${event.cover_image}" alt="${event.title}" class="event-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7lm77moIdJbWFnZTwvdGV4dD48L3N2Zz4='">
                    <div class="event-content">
                        <div class="event-title">${event.title}</div>
                    </div>
                `;
                
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error loading events:', error);
            document.getElementById('events-container').innerHTML = `
                <div class="error">
                    加载数据失败: ${error.message}
                </div>
            `;
        });
});