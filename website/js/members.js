const MIN_SESSION = 31 // 最小届数
const NOW_SESSION = 33 // 主显示届数
let SESSION = NOW_SESSION

function loadmembers(session){
    return fetch('./members/members.json')
        .then(response => response.json())
        .then(members => {
            let membersNum = 0
            const DepartmentsName = ['宣传口', '赛事口', '科创口', '技术口', '常务口']
            let DepartmentsLabel = new Array(DepartmentsName.length).fill(0);
            const DepartmentsIndex = DepartmentsName.reduce((acc, name, index) => {
                acc[name] = index;
                return acc;
            }, {});

            // 主席
            const Chairman = document.getElementById('chairman')
            Chairman.innerHTML = ''
            const VCS = document.getElementById('vice-chairmans')
            VCS.innerHTML = ''
            
            // 副主席与干事
            const Deparments = []
            DepartmentsName.forEach((name, index) => {
                const container = document.createElement("div");
                container.classList.add("vc-container");
                const vc = document.createElement("div");
                vc.classList.add("vice-chairman");
                container.appendChild(vc);
                const members = document.createElement("div");
                members.classList.add("officers");
                container.appendChild(members);
                Deparments[index] = {
                    name,
                    container,
                    vc,
                    members
                };
            });
            
            members.forEach(member => {
                for(let s=1; s<=5; s++){
                    // 找到本届成员
                    if(member[`session${s}`] == session){
                        // 找到主席
                        if(member[`position${s}`] === "主席"){
                            // 建立节点
                            const Node = document.createElement('div')
                            Node.classList.add('node')
                            Chairman.appendChild(Node)
                            // 姓名
                            const Name = document.createElement('h2')
                            const link = document.createElement("a")
                            link.href = `members/member/${member['website']}.html`
                            link.innerText = member['name']
                            link.target = '_blank'
                            Name.appendChild(link)
                            Node.appendChild(Name)
                            // 职务
                            const Position = document.createElement('div')
                            Position.classList.add('position')
                            if(session > MIN_SESSION){
                                Position.innerHTML = `第${session}届科协主席
                                    <button class="session-change-btn decrease">
                                        <i class="fas fa-arrow-up"></i>
                                    </button>
                                `
                            }
                            else{
                                Position.innerHTML = `第${session}届科协主席`
                            }
                            Node.appendChild(Position)
                            membersNum ++
                        }
                        
                        // 找到副主席
                        else if(member[`position${s}`] === "副主席"){
                            // 建立节点
                            const Node = document.createElement('div')
                            Node.classList.add('node')
                            // 姓名
                            const Name = document.createElement('h3')
                            const link = document.createElement("a")
                            link.href = `members/member/${member['website']}.html`
                            link.innerText = member['name']
                            link.target = '_blank'
                            Name.appendChild(link)
                            if(member[`position${s+1}`] === "主席"){
                                Name.insertAdjacentHTML("beforeend", `
                                    <button class="session-change-btn increase">
                                        <i class="fas fa-arrow-down"></i>
                                    </button>
                                `)
                            }
                            Node.appendChild(Name)
                            // 部门
                            const Deparment = document.createElement('div')
                            Deparment.classList.add('department')
                            Deparment.textContent = member[`department${s}`]
                            Node.appendChild(Deparment)
                            Deparments[DepartmentsIndex[member[`department${s}`]]].vc.appendChild(Node)
                            DepartmentsLabel[DepartmentsIndex[member[`department${s}`]]] = 1
                            membersNum ++
                        }

                        // 其余干事
                        else{
                            // 建立节点
                            const Officer = document.createElement('div')
                            Officer.classList.add('officer')
                            // 姓名
                            const link = document.createElement("a")
                            link.href = `members/member/${member['website']}.html`
                            link.innerText = member['name']
                            link.target = '_blank'
                            Officer.appendChild(link)
                            // 部门
                            Deparments[DepartmentsIndex[member[`department${s}`]]].members.appendChild(Officer)
                            membersNum ++
                        }
                        break
                    }
                }
            });

            for(let d=0; d<DepartmentsLabel.length; d++){
                if(DepartmentsLabel[d]) VCS.appendChild(Deparments[d].container);
            }

            drawConnections()
            hoverEffect()
            document.querySelectorAll('.decrease').forEach(elem => {
                elem.addEventListener('click', () => {
                    SESSION--
                    reload(SESSION)
                })
            })
            document.querySelectorAll('.increase').forEach(elem => {
                elem.addEventListener('click', () => {
                    SESSION++
                    reload(SESSION);
                })
            })
            return membersNum
        })
        .catch(error => console.error('Error loading members:', error));
}

// 添加悬停效果
function hoverEffect(){
    const nodes = document.querySelectorAll('.node');
    nodes.forEach(node => {
        node.addEventListener('mouseenter', function() {
            this.style.transform = this.classList.contains('chairman') ? 
                'translateY(-8px) rotateX(8deg)' : 
                'translateY(-5px) rotateY(8deg)';
        });
        
        node.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// 绘制曲线连接线
function drawConnections() {
    const svg = document.querySelector('.connections');
    svg.innerHTML = '';
    
    const chairman = document.querySelector('.chairman .node');
    const vcNodes = document.querySelectorAll('.vice-chairman .node');
    
    if (!chairman || vcNodes.length === 0) return;
    
    const chairmanRect = chairman.getBoundingClientRect();
    const orgChartRect = document.querySelector('.org-chart').getBoundingClientRect();
    
    const chairmanX = chairmanRect.left + chairmanRect.width/2 - orgChartRect.left;
    const chairmanY = chairmanRect.top + chairmanRect.height - orgChartRect.top;
    
    vcNodes.forEach(vcNode => {
        const vcRect = vcNode.getBoundingClientRect();
        const vcX = vcRect.left + vcRect.width/2 - orgChartRect.left;
        const vcY = vcRect.top - orgChartRect.top;
        
        // 创建曲线路径
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'curve-path');
        
        // 贝塞尔曲线路径
        const controlY = chairmanY + (vcY - chairmanY) * 0.4;
        const d = `M${chairmanX},${chairmanY} 
                    C${chairmanX},${controlY} 
                    ${vcX},${controlY} 
                    ${vcX},${vcY}`;
        
        path.setAttribute('d', d);
        path.setAttribute('stroke', 'rgb(102, 8, 116)');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-dasharray', '5,5');
        
        svg.appendChild(path);
    });
}

function loadAll(){
    SESSION = NOW_SESSION
    document.getElementById('number-session').textContent = NOW_SESSION;
    loadmembers(SESSION).then(membersNum => {
        document.getElementById('number-members').textContent = membersNum;
    })
}

function reload(session){
    const orgChart = document.querySelector('.org-chart');
    orgChart.classList.add('fade-out');

    setTimeout(() => {
        // 根据SESSION加载不同届数的数据
        loadmembers(session)
        // 动画效果
        orgChart.classList.remove('fade-out');
        orgChart.classList.add('fade-in');        
        setTimeout(() => {
            orgChart.classList.remove('fade-in');
        }, 300);
    }, 300);

}

window.addEventListener('load', loadAll());
window.addEventListener('resize', drawConnections());
