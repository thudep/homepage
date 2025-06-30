import pandas as pd
import json

# 导入excel数据与预处理
excel_file = 'Members.xlsx'
df = pd.read_excel(excel_file)
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
    # 存储
    members_json.append(member_json)

# 将列表写入JSON文件
with open('Members.json', 'w', encoding='utf-8') as f:
    json.dump(members_json, f, ensure_ascii=False, indent=4)
