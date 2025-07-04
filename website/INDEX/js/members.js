const SESSION = 33; // 主显示届数

function loadmembers(session){
    fetch('./members/Members.json')
        .then(response => response.json())
        .then(members => {
            const Members = document.getElementById('members');
            
            members.forEach(member => {
                for(let s=1; s<=5; s++){
                    if(member[`session${s}`] == session){
                        const Member = document.createElement('div');
                        Member.classList.add('member');
                        switch(member[`posistion${s}`]){
                            case '主席':
                                Member.classList.add('chairman');
                                break;
                            case '副主席':
                                Member.classList.add('vice-chairman');
                                break;
                            default:
                                Member.classList.add('officer');
                                break;
                        }
                        switch(member[`department${s}`]){
                            case '宣传口':
                                Member.classList.add('publicity');
                                break;
                            case '宣传口':
                                Member.classList.add('event');
                                break;
                            case '科创口':
                                Member.classList.add('creation');
                                break;
                            case '技术口':
                                Member.classList.add('tech');
                                break;
                            case '常务口':
                                Member.classList.add('tech');
                                break;
                            default:
                                break;
                        }
                        const link = document.createElement("a");
                        link.href = `members/${member['website']}.html`;
                        link.textContent = member['name'];
                        link.target = '_blank';
                        Member.appendChild(link);
                        Members.appendChild(Member);
                        break;
                    }
                }
            });
        })
        .catch(error => console.error('Error loading members:', error));
}

window.addmemberListener('load', loadmembers(SESSION));
