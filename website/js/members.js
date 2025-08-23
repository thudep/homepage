const MIN_SESSION = 31 // 最小届数
const NOW_SESSION = 33 // 主显示届数
let SESSION = NOW_SESSION

function loadmembers(session){
    return fetch('./members/members.json')
        .then(response => response.json())
        .then(members => {
            let members_num = 0

            const Chairman = document.getElementById('chairman')
            Chairman.innerHTML = ''
            const VCS = document.getElementById('vice-chairmans')
            VCS.innerHTML = ''
            // 宣传口
            const Publicity = document.createElement('div')
            Publicity.classList.add('vc-container')
            const PublicityVC = document.createElement('div')
            PublicityVC.classList.add('vice-chairman')
            Publicity.appendChild(PublicityVC)
            const PublicityMembers = document.createElement('div')
            PublicityMembers.classList.add('officers')
            Publicity.appendChild(PublicityMembers)
            // 赛事口
            const Event = document.createElement('div')
            Event.classList.add('vc-container')
            const EventVC = document.createElement('div')
            EventVC.classList.add('vice-chairman')
            Event.appendChild(EventVC)
            const EventMembers = document.createElement('div')
            EventMembers.classList.add('officers')
            Event.appendChild(EventMembers)
            // 科创口
            const Creation = document.createElement('div')
            Creation.classList.add('vc-container')
            const CreationVC = document.createElement('div')
            CreationVC.classList.add('vice-chairman')
            Creation.appendChild(CreationVC)
            const CreationMembers = document.createElement('div')
            CreationMembers.classList.add('officers')
            Creation.appendChild(CreationMembers)
            // 技术口
            const Tech = document.createElement('div')
            Tech.classList.add('vc-container')
            const TechVC = document.createElement('div')
            TechVC.classList.add('vice-chairman')
            Tech.appendChild(TechVC)
            const TechMembers = document.createElement('div')
            TechMembers.classList.add('officers')
            Tech.appendChild(TechMembers)
            // 常务口
            const Routine = document.createElement('div')
            Routine.classList.add('vc-container')
            const RoutineVC = document.createElement('div')
            RoutineVC.classList.add('vice-chairman')
            Routine.appendChild(RoutineVC)
            const RoutineMembers = document.createElement('div')
            RoutineMembers.classList.add('officers')
            Routine.appendChild(RoutineMembers)
            
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
                            members_num ++
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
                            switch(member[`department${s}`]){
                                case '宣传口':
                                    PublicityVC.appendChild(Node)
                                    VCS.appendChild(Publicity)
                                    break
                                case '赛事口':
                                    EventVC.appendChild(Node)
                                    VCS.appendChild(Event)
                                    break
                                case '科创口':
                                    CreationVC.appendChild(Node)
                                    VCS.appendChild(Creation)
                                    break
                                case '技术口':
                                    TechVC.appendChild(Node)
                                    VCS.appendChild(Tech)
                                    break
                                case '常务口':
                                    RoutineVC.appendChild(Node)
                                    VCS.appendChild(Routine)
                                    break
                                default:
                                    break
                            }
                            members_num ++
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
                            switch(member[`department${s}`]){
                                case '宣传口':
                                    PublicityMembers.appendChild(Officer)
                                    break
                                case '赛事口':
                                    EventMembers.appendChild(Officer)
                                    break
                                case '科创口':
                                    CreationMembers.appendChild(Officer)
                                    break
                                case '技术口':
                                    TechMembers.appendChild(Officer)
                                    break
                                case '常务口':
                                    RoutineMembers.appendChild(Officer)
                                    break
                                default:
                                    break
                            }
                            members_num ++
                        }
                        break
                    }
                }
            });

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
            return members_num
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
        path.setAttribute('stroke', '#3498db');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-dasharray', '5,5');
        
        svg.appendChild(path);
    });
}

function loadAll(){
    SESSION = NOW_SESSION
    document.getElementById('number-session').textContent = NOW_SESSION;
    loadmembers(SESSION).then(members_num => {
        document.getElementById('number-members').textContent = members_num;
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
