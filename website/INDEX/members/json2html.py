import json
from bs4 import BeautifulSoup

def html_add_p(soup, section_tag, text: str) -> None:
    '''
    添加<p>对象
    '''
    p_tag = soup.new_tag('p')
    p_tag.string = text
    section_tag.append(p_tag)

def html_add_pa(soup, section_tag, a, text: str) -> None:
    '''
    添加<p>对象, 内部为<a>
    '''
    p_tag = soup.new_tag('p')
    p_tag.append(a)
    p_tag.append(text)
    section_tag.append(p_tag)

def add_mail(soup, section_tag, mail: str) -> None:
    '''
    把邮箱信息作为链接添加<a>对象
    '''
    a = soup.new_tag("a", href=f"mailto:{mail}", **{"class": "conduct"})
    i = soup.new_tag("i", **{"class": "fas fa-envelope"})
    a.append(i)
    html_add_pa(soup, section_tag, a, f": {mail}")

def add_github(soup, section_tag, github: str) -> None:
    '''
    把github信息作为链接添加<a>对象
    '''
    a = soup.new_tag("a",
                     href=f"https://github.com/{github}",
                     target="_blank",
                     **{"class": "conduct"})
    i = soup.new_tag("i", **{"class": "fab fa-github"})
    a.append(i)
    html_add_pa(soup, section_tag, a, f": {github}")

def add_position(soup, section_tag, member: dict) -> None:
    '''
    获取成员职务信息, 并作为文本添加<p>对象
    '''
    for s in range(1, 6):
        if f'position{s}' not in member:
            return
        if member[f'position{s}'] == '主席':
            html_add_p(soup, section_tag, 
                       f"第{member[f'session{s}']}届主席")
        else:
            html_add_p(soup, section_tag, 
                       f"第{member[f'session{s}']}届{member[f'department{s}']}{member[f'position{s}']}")

def main():
    # 读取json
    with open('members.json', 'r', encoding='utf-8') as f:
        members = json.load(f)
    
    # 遍历每个人, 生成对应的网页
    for member in members:
        # 读取 HTML 模板
        with open('member/template.html', 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')
        # 创建 <section class="content">
        section_tag = soup.new_tag('section', **{'class': 'content'})
        # 添加基本信息
        html_add_p(soup, section_tag, f"姓名: {member['name']}")
        if 'class' in member:
            html_add_p(soup, section_tag, f"班级: {member['class']}")
        if 'mail' in member:
            add_mail(soup, section_tag, member['mail'])
        if 'GitHub' in member:
            add_github(soup, section_tag, member['GitHub'])
        # 添加职务信息
        add_position(soup, section_tag, member)
        # 添加工作信息
        w = 1
        while f'work{w}' in member:
            html_add_p(soup, section_tag, member[f'work{w}'])
            w += 1
        # 插入到 <main> 最后
        soup.main.append(section_tag)
        # 保存结果
        with open(f"member/{member['website']}.html", 'w', encoding='utf-8') as f:
            f.write(soup.prettify())

if __name__ == "__main__":
    main()
