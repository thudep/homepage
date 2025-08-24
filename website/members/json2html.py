import json
from bs4 import BeautifulSoup

def link(soup, href, icon):
    "链接为 href 的 icon 图标"
    a = soup.new_tag("a", href=href, target="_blank", **{"class": "conduct"})
    i = soup.new_tag("i", **{"class": icon})
    a.append(i)
    return a

def add_item(soup, div, title, content):
    "添加 info-item 对象"
    item = soup.new_tag("div", **{"class": "info-item"})
    p = soup.new_tag("p")
    span = soup.new_tag("span", **{"class": "info-title"})
    if isinstance(title, list):
        span.extend(title)
    else:
        span.append(title)
    p.append(span)
    p.append(content)
    item.append(p)
    div.append(item)

def main():
    # 读取json
    with open('members.json', 'r', encoding='utf-8') as f:
        members = json.load(f)

    # 遍历每个人, 生成对应的网页
    for member in members:
        # 读取 HTML 模板
        with open('member/template.html', 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')

        # 补充个人信息
        div = soup.find(id="information")
        add_item(soup, div, '姓名', member['name'])
        if 'class' in member:
            add_item(soup, div, '班级', member['class'])
        if 'mail' in member:
            add_item(soup, div,
                     ['邮箱', link(soup, f"mailto:{member['mail']}", "fas fa-envelope")],
                     member['mail'])
        if 'GitHub' in member:
            add_item(soup, div,
                     ['GitHub',
                      link(soup, f"https://github.com/{member['GitHub']}", 'fab fa-github'),
                      '用户名'],
                     member['GitHub'])
        # 补充任职情况
        div = soup.find(id="position")
        for s in range(1, 6):
            if f'position{s}' not in member:
                break
            if member[f'position{s}'] == '主席':
                add_item(soup, div, f"第{member[f'session{s}']}届", '科协主席')
            else:
                add_item(soup, div, f"第{member[f'session{s}']}届",
                        f"{member[f'department{s}']}{member[f'position{s}']}")
        # 补充参与工作
        div = soup.find(id="work")
        w = 1
        while f'work{w}' in member:
            add_item(soup, div, '', member[f'work{w}'])
            w += 1

        # 保存结果
        with open(f"member/{member['website']}.html", 'w', encoding='utf-8') as f:
            f.write(soup.prettify())

if __name__ == "__main__":
    main()
