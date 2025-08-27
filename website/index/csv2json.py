import json
import os
import shutil
import sys
import pandas as pd
from website.publicity.csv2json_png import fetch_article_info, title_to_pngname, save_cover_image

def save_img(path, img):
    "保存从csv中读取到的链接指向的图片, 返回图片名"
    src = os.path.join(path, img)
    if not os.path.isfile(src):
        raise FileNotFoundError(f"源文件不存在: {src}")

    dst_dir = os.path.dirname(os.path.abspath(__file__))
    pngname = os.path.basename(src)
    dst = os.path.join(dst_dir, pngname)

    shutil.copy(src, dst)
    return pngname

def main(csv):
    results = []
    parts = os.path.normpath(csv).split(os.sep)
    path = os.path.join(*parts[:-2])
    # 用 pandas 读取 CSV
    shows = pd.read_csv(csv)
    show_list = shows.to_dict(orient='records')

    for show in show_list:
        url = show['url']

        if show['type'] == 'wechat':
            try:
                title, cover_img_url, _ = fetch_article_info(url)
                if not title or not cover_img_url:
                    print(f"无法获取文章信息: {url}")
                    continue
                if pd.notna(show['img']):
                    pngname = save_img(path, show['img'])
                else:
                    pngname = title_to_pngname(title)
                    save_cover_image(cover_img_url, pngname)
                if pd.notna(show['title']):
                    title = show['title']
            except Exception as e:
                print(f"处理失败: {url}, 错误: {e}")

        elif show['type'] == 'content':
            title = show['title']
            pngname = save_img(path, show['img'])

        results.append({
                "title": title,
                "url": url,
                "cover_image": pngname,
            })

    # 保存结果为JSON
    with open("show.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(1)
    csv_path = sys.argv[1]
    main(csv_path)
