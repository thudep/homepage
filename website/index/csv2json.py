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

def main(csv, cache):
    results = []
    parts = os.path.normpath(csv).split(os.sep)
    path = os.path.join(*parts[:-2])
    # 用 pandas 读取 CSV
    shows = pd.read_csv(csv)
    show_list = shows.to_dict(orient='records')
    # 读取缓存的 cache.json
    cache_json = os.path.join(cache, "cache.json")
    if os.path.exists(cache_json):
        with open(cache_json, "r", encoding="utf-8") as f:
            cache_data = json.load(f)
    else:
        cache_data = []

    for show in show_list:
        url = show['url']

        if show['type'] == 'wechat': #微信公众号文章
            # 从缓存中查找
            for data in cache_data:
                if url == data['url']:
                    title = data['title']
                    pngname = data['cover_image']
                    png_path = os.path.join(cache, pngname)
                    if not os.path.isfile(png_path):
                        continue

                    dst_dir = os.path.dirname(os.path.abspath(__file__))
                    dst = os.path.join(dst_dir, pngname)
                    shutil.copy(png_path, dst)
                    break

            # 从网站中获取
            else:
                try:
                    print(f"正在获取新文章信息: {url}")
                    title, cover_img_url, publish_date = fetch_article_info(url)
                    if not title or not cover_img_url:
                        print(f"无法获取文章信息: {url}")
                        continue

                    pngname = title_to_pngname(title)
                    save_cover_image(cover_img_url, pngname, cache)

                    cache_data.append({
                        "title": title,
                        "url": url,
                        "cover_image": pngname,
                        "publish_date": publish_date
                    })
                except Exception as e:
                    print(f"处理失败: {url}, 错误: {e}")
                    continue

            # 处理指定的标题或图片
            if pd.notna(show['title']):
                title = show['title']
            if pd.notna(show['img']):
                if os.path.exists(pngname):
                    os.remove(pngname)
                pngname = save_img(path, show['img'])

        elif show['type'] == 'content': #其它页面
            title = show['title']
            pngname = save_img(path, show['img'])

        results.append({
                "title": title,
                "url": url,
                "cover_image": pngname
            })

    # 保存结果为JSON
    with open("show.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=4)

    # 更新缓存JSON结果
    with open(cache_json, "w", encoding="utf-8") as f:
        json.dump(cache_data, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(1)
    csv_path = sys.argv[1]
    cache_dir = sys.argv[2]
    main(csv_path, cache_dir)
