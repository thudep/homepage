const SESSION = 33; // 主显示届数

function loadmembers(session){
    fetch('./members/Members.json')
        .then(response => response.json())
        .then(members => {
            const Chairman = document.getElementById('chairman')
            const VCS = document.getElementById('vice-chairmans')
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
                            Position.textContent = '主席'
                            Node.appendChild(Position)
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
                            Node.appendChild(Name)
                            // 职务
                            const Position = document.createElement('div')
                            Position.classList.add('position')
                            Position.textContent = '副主席'
                            Node.appendChild(Position)
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
                        }
                        break
                    }
                }
            });
        })
        .catch(error => console.error('Error loading members:', error));

    drawConnections()
}

// 添加悬停效果
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

window.addmemberListener('load', loadmembers(SESSION));
window.addEventListener('resize', drawConnections);
