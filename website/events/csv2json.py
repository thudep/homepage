"根据 others.csv , events.json , members.json 生成每个赛事的组委会 json"
from collections import defaultdict
import json
import os
import re
import sys
import pandas as pd

def process_events(events_json) -> dict:
    "处理 events.json , 得到所有赛事的 id 词典"
    with open(events_json, "r", encoding="utf-8") as f:
        events = json.load(f)

    event_info = {}
    for event in events:
        title = event["title"]
        cover = event["cover_image"]
        event_id = os.path.splitext(cover)[0]  # 去掉后缀
        event_info[title] = event_id

    return event_info

def extract_session_and_role(work):
    "从工作描述中提取届数和是否为总负责人"
    match = re.search(r"第(\d+)届", work)
    session = int(match.group(1)) if match else None
    is_leader = "总负责人" in work
    return session, is_leader

def process_members(members_json, event_info) -> tuple[dict, defaultdict]:
    "处理 members.json , 得到成员映射表与 member 中记录的组委会成员"
    with open(members_json, "r", encoding="utf-8") as f:
        members = json.load(f)

    # 成员映射表，方便查 website
    name_to_website = {m["name"]: m.get("website", "") for m in members}

    # json 格式
    results = defaultdict(lambda: defaultdict(lambda: {
        "session": None,
        "supervisor": [],
        "leader": [],
        "committee": []
    }))

    for member in members:
        name = member["name"]
        works = [v for k, v in member.items() if k.startswith("work") and v]

        for work in works:
            for title, event_id in event_info.items():
                if title in work:
                    session, is_leader = extract_session_and_role(work)
                    if not session:
                        continue

                    session_data = results[event_id][session]
                    if (any(l["name"] == name for l in session_data["leader"]) or
                        any(c["name"] == name for c in session_data["committee"])):
                        continue #剔除重复人员

                    session_data["session"] = session
                    member_entry = {"name": name}
                    member_entry["website"] = name_to_website[name]

                    if is_leader:
                        session_data["leader"].append(member_entry)
                    else:
                        session_data["committee"].append(member_entry)

    return name_to_website, results

def process_others(others_csv, event_info, name_to_website, results):
    "处理 others.csv , 补全组委会成员"
    others = pd.read_csv(others_csv)
    others_list = others.to_dict(orient='records')

    for member in others_list:
        role = member["身份"]
        name = member["姓名"]
        title = member["赛事"]
        session = int(member["届数"])
        if title not in event_info:
            continue

        event_id = event_info[title]
        session_data = results[event_id][session]
        if (any(l["name"] == name for l in session_data["leader"]) or
            any(c["name"] == name for c in session_data["committee"])):
            continue #剔除重复人员

        session_data["session"] = session
        if role == "教师":
            if not any(s["name"] == name for s in session_data["supervisor"]):
                session_data["supervisor"].append({"name": name})
        else: #学生
            member_entry = {"name": name}
            if name in name_to_website:
                website = name_to_website[name]
                if website:
                    member_entry["website"] = website
            session_data["committee"].append(member_entry)

    return results

def generate_json(others_csv, events_json, members_json):
    "生成每个赛事的组委会 json"
    event_info = process_events(events_json)
    name_to_website, results = process_members(members_json, event_info)
    results = process_others(others_csv, event_info, name_to_website, results)

    output_dir = os.path.join(os.path.dirname(__file__), "event")
    os.makedirs(output_dir, exist_ok=True)

    for _, event_id in event_info.items():
        sessions = sorted(results[event_id].values(), key=lambda x: x["session"])
        if not sessions:
            continue
        out_path = os.path.join(output_dir, f"{event_id}.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(sessions, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    if len(sys.argv) != 4:
        sys.exit(1)
    others_path = sys.argv[1]
    events_path = sys.argv[2]
    members_path = sys.argv[3]
    generate_json(others_path, events_path, members_path)
