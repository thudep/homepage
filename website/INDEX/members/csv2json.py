import pandas as pd
import json
from pypinyin import lazy_pinyin, load_phrases_dict

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

# 导入csv数据与预处理
csv_file = '../../../content/members/members.csv'
df = pd.read_csv(csv_file)
members_list = df.to_dict(orient='records')

members_json = []

# 遍历每个成员, 提取所需信息
for member in members_list:
    member_json = {}
    # 基本信息
    member_json['name'] = member['姓名']
    if pd.notna(member['班级']):
        member_json['class'] = member['班级']
    if pd.notna(member['邮箱']):
        member_json['mail'] = member['邮箱']
    if pd.notna(member['GitHub账号']):
        member_json['GitHub'] = member['GitHub账号']
    # 职务信息
    for s in range(1, 6):
        if pd.isna(member[f'届{s}']):
            break
        member_json[f'session{s}'] = int(member[f'届{s}'])
        if member[f'职务{s}'] == '主席':
            member_json[f'position{s}'] = member[f'职务{s}']
        else:
            member_json[f'department{s}'] = member[f'部门{s}']
            if pd.isna(member[f'职务{s}']):
                member_json[f'position{s}'] = '干事'
            elif member[f'职务{s}'] == '已毕业':
                member_json[f'position{s}'] = '干事（已毕业）'
            else:
                member_json[f'position{s}'] = member[f'职务{s}']
    # 工作信息
    w = 1
    while pd.notna(member[f'工作{w}']):
        member_json[f'work{w}'] = member[f'工作{w}']
        w += 1
    # 网页名称
    member_json['website'] = html_name(member_json)
    # 存储
    members_json.append(member_json)

# 将列表写入JSON文件
with open('members.json', 'w', encoding='utf-8') as f:
    json.dump(members_json, f, ensure_ascii=False, indent=4)
