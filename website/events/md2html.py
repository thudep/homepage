"从 markdown 中获取标题生成对应的 json , 同时生成对应的 html"
import os
import sys
import json
import subprocess

def extract_title(md_path):
    "获取 markdown 文件的首个一级标题"
    with open(md_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("# "):  # 只取第一个一级标题
                return line[2:].strip()
    return os.path.splitext(os.path.basename(md_path))[0]  # 没有标题就用文件名代替

def md_to_html(md_path, template_path, out_path):
    "将 markdown 转换为 html, 并填充到模板 <main> 部分"
    # 调用 pandoc 把 md 转换成 html 片段(只要 body，不要完整 html)
    result = subprocess.run(
        ["pandoc", "--from=markdown", "--to=html", "--highlight-style=pygments", "--mathjax", md_path],
        capture_output=True,
        text=True,
        check=True
    )
    md_html = result.stdout

    # 读取模板并替换 <main>
    with open(template_path, "r", encoding="utf-8") as f:
        template = f.read()

    before, rest = template.split("<main>", 1)
    inside, after = rest.split("</main>", 1)

    filled_html = before + "<main>\n" + md_html + "\n</main>" + after

    # 写入输出文件
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(filled_html)

def main():
    if len(sys.argv) != 2:
        sys.exit(1)

    events_dir = sys.argv[1]
    markdown_dir = os.path.join(events_dir, "markdown")

    template_path = os.path.join("event", "template.html")
    output_dir = os.path.join("event")

    os.makedirs(output_dir, exist_ok=True)

    events_data = []

    # 遍历 markdown 文件夹
    for md_file in os.listdir(markdown_dir):
        if not md_file.endswith(".md"):
            continue
        md_path = os.path.join(markdown_dir, md_file)
        base_name = os.path.splitext(md_file)[0]

        # 获取一级标题
        title = extract_title(md_path)

        # 转换为 HTML
        out_html_path = os.path.join(output_dir, f"{base_name}.html")
        md_to_html(md_path, template_path, out_html_path)

        # 添加到 events.json
        events_data.append({
            "title": title,
            "url": f"events/event/{base_name}.html",
            "cover_image": f"{base_name}.png"
        })

    # 写入 events.json
    with open("events.json", "w", encoding="utf-8") as f:
        json.dump(events_data, f, indent=4, ensure_ascii=False)


if __name__ == "__main__":
    main()
