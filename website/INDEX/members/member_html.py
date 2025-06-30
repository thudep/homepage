from pypinyin import lazy_pinyin, load_phrases_dict
import json
from bs4 import BeautifulSoup

# 多音字的名字处理
homophone = {
    '吕晟昊' : [['lv'], ['Sheng'], ['Hao']]
}
load_phrases_dict(homophone)

def name_to_pinyin(name: str) -> str:
    '''
    把人名转化为拼音, 保证每个字首字母大写
    '''
    pinyins = lazy_pinyin(name)
    capitalized = [p.capitalize() for p in pinyins] #首字母大写
    return ''.join(capitalized)

def class_to_initials(class_name: str) -> str:
    '''
    把班级名转化为大写首字母加数字的格式
    '''
    result = []
    for char in class_name:
        if char.isdigit():
            result.append(char) #直接保留数字
        else:
            py = lazy_pinyin(char)[0]
            result.append(py[0].upper()) #拼音首字母大写
    return ''.join(result)

def html_name(member: dict) -> str:
    '''
    使用姓名与班级作为网页名
    '''
    if 'class' in member:
        return name_to_pinyin(member['name']) + '-' + class_to_initials(member['class'])
    else:
        return name_to_pinyin(member['name'])

# 读取json
with open('Members.json', 'r', encoding='utf-8') as f:
    members = json.load(f)

def html_add_p(soup, section_tag, text: str) -> None:
    '''
    添加<p>对象
    '''
    p_tag = soup.new_tag('p')
    p_tag.string = text
    section_tag.append(p_tag)

def position(soup, section_tag, member: dict) -> None:
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
        html_add_p(soup, section_tag, f"邮箱: {member['mail']}")
    if 'GitHub' in member:
        html_add_p(soup, section_tag, f"GitHub账号: {member['GitHub']}")
    # 添加职务信息
    position(soup, section_tag, member)
    # 添加工作信息
    w = 1
    while f'work{w}' in member:
        html_add_p(soup, section_tag, member[f'work{w}'])
        w += 1
    # 插入到 <main> 最后
    soup.main.append(section_tag)
    # 保存结果
    with open(f'member/{html_name(member)}.html', 'w', encoding='utf-8') as f:
        f.write(str(soup))
