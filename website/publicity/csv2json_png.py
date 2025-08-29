"从网页链接的 csv 中获取标题与封面图, 并生成对应的 json , 以及封面图的 png"
from io import BytesIO
import json
import os
import re
import shutil
import sys
import pandas as pd
import requests
from bs4 import BeautifulSoup
from PIL import Image
from pypinyin import pinyin, Style

def fetch_article_info(url):
    "从对应的链接中获取文章的标题、封面图链接与日期"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.content, 'html.parser')

    # 提取标题
    title = soup.find('meta', property='og:title') or soup.find('meta', attrs={'name': 'title'})
    if title:
        title = title.get('content', '').strip()
    else:
        title = soup.title.string.strip() if soup.title else "未知标题"

    # 提取封面图
    cover_img = soup.find('meta', property='og:image') or soup.find('meta', attrs={'name': 'image'})
    cover_url = cover_img.get('content', '').strip() if cover_img else None

    # 提取日期
    pattern = r"var createTime\s*=\s*'(\d{4}-\d{2}-\d{2} \d{2}:\d{2})'"
    match = re.search(pattern, response.text)
    full_datetime = match.group(1)
    publish_date = full_datetime.split(' ')[0]  # 提取日期部分

    return title, cover_url, publish_date

def title_to_pngname(title):
    "将标题中的中文字符转化为拼音首字母, 其他字符忽略"
    # 提取中文字符
    chinese_chars = re.findall(r'[\u4e00-\u9fff]', title)
    if not chinese_chars:
        # 如果没有中文，使用前10个字符（去除特殊字符）
        cleaned_text = re.sub(r'[^\w]', '', title)[:10]
        return cleaned_text.lower() if cleaned_text else "unknown"

    # 获取拼音首字母
    initials = []
    for char in chinese_chars:
        try:
            char_pinyin = pinyin(char, style=Style.FIRST_LETTER)
            if char_pinyin:
                initials.append(char_pinyin[0][0].lower())
        except:
            continue

    filename = ''.join(initials) if initials else "unknown"
    return filename + ".png"

def save_cover_image(img_url, pngname, cache):
    "保存封面图"
    response = requests.get(img_url, timeout=10)
    response.raise_for_status()

    img = Image.open(BytesIO(response.content))
    # 转换为RGB模式（处理RGBA图片）
    if img.mode in ('RGBA', 'LA'):
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[-1])
        img = background

    img.save(pngname, "PNG")
    cache_png = os.path.join(cache, pngname)
    img.save(cache_png, "PNG")

def process_wechat_articles(csv, cache):
    "处理微信公众号文章"
    results = []
    # 用 pandas 读取 CSV
    df = pd.read_csv(csv)
    # 读取缓存的 cache.json
    cache_json = os.path.join(cache, "cache.json")
    if os.path.exists(cache_json):
        with open(cache_json, "r", encoding="utf-8") as f:
            cache_data = json.load(f)
    else:
        cache_data = []

    for url in df["url"].dropna():
        # 从缓存中查找
        for data in cache_data:
            if url == data['url']:
                pngname = data['cover_image']
                png_path = os.path.join(cache, pngname)
                if not os.path.isfile(png_path):
                    continue

                dst_dir = os.path.dirname(os.path.abspath(__file__))
                dst = os.path.join(dst_dir, pngname)
                shutil.copy(png_path, dst)
                results.append(data)
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

                results.append({
                    "title": title,
                    "url": url,
                    "cover_image": pngname,
                    "publish_date": publish_date
                })
                cache_data.append({
                    "title": title,
                    "url": url,
                    "cover_image": pngname,
                    "publish_date": publish_date
                })
            except Exception as e:
                print(f"处理失败: {url}, 错误: {e}")

    # 保存结果为JSON
    with open("publicity.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=4)

    # 更新缓存JSON结果
    with open(cache_json, "w", encoding="utf-8") as f:
        json.dump(cache_data, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(1)
    csv_path = sys.argv[1]
    cache_dir = sys.argv[2]
    process_wechat_articles(csv_path, cache_dir)
