// 参数表
let parameter = {
    "events" : {
        "dir" : "./events/",
        "json" : "events.json",
        "empty" : '<div class="error">暂无赛事数据</div>',
        "target" : "_self"
    },
    "publicity" : {
        "dir" : "./publicity/",
        "json" : "publicity.json",
        "empty" : '<div class="error">暂无文章数据</div>',
        "target" : "_blank",
        "data" : ""
    }
}

document.addEventListener('DOMContentLoaded', function(){    
    const pageName = window.location.pathname.split("/").pop().replace(/\.html$/i, "");
    para = parameter[pageName]

    fetch(`${para['dir']}${para['json']}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('cards-container');
            container.innerHTML = ''; // 清空加载提示
            
            if(data.length === 0){
                container.innerHTML = para['empty'];
                return;
            }

            if('data' in para){
                // 按日期倒序排序
                data.sort((a, b) => {
                    // 将日期字符串转换为Date对象进行比较
                    const dateA = new Date(a.publish_date);
                    const dateB = new Date(b.publish_date);
                    return dateB - dateA; // 倒序排列
                })
            }

            // 创建卡片
            data.forEach(show => {
                const card = document.createElement('div');
                card.className = 'show-card';
                card.onclick = () => window.open(show.url, para['target']);
                
                if('data' in para){
                    card.innerHTML = `
                        <img src="./publicity/${show.cover_image}" alt="${show.title}" class="show-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7lm77moIdJbWFnZTwvdGV4dD48L3N2Zz4='">
                        <div class="show-content">
                            <div class="show-title">${show.title}</div>
                            <div class="show-date">${show.publish_date}</div>
                        </div>
                    `;
                }
                else{
                    card.innerHTML = `
                        <img src="${para['dir']}${show.cover_image}" alt="${show.title}" class="show-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7lm77moIdJbWFnZTwvdGV4dD48L3N2Zz4='">
                        <div class="show-content">
                            <div class="show-title">${show.title}</div>
                        </div>
                    `;
                }
                
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error loading data:', error);
            document.getElementById('cards-container').innerHTML = `
                <div class="error">
                    加载数据失败: ${error.message}
                </div>
            `;
        });
});