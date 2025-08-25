"从网页链接的 csv 中获取标题与封面图, 并生成对应的 json , 以及封面图的 png"
from io import BytesIO
import json
import re
import sys
import pandas as pd
import requests
from bs4 import BeautifulSoup
from PIL import Image
from pypinyin import pinyin, Style

def fetch_article_info(url):
    "从对应的链接中获取文章的标题与封面图链接"
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

    return title, cover_url

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

def save_cover_image(img_url, pngname):
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

def process_wechat_articles(csv):
    "处理微信公众号文章"
    results = []
    # 用 pandas 读取 CSV
    df = pd.read_csv(csv)

    for url in df["url"].dropna():
        try:
            title, cover_img_url = fetch_article_info(url)
            if not title or not cover_img_url:
                print(f"无法获取文章信息: {url}")
                continue

            pngname = title_to_pngname(title)
            save_cover_image(cover_img_url, pngname)

            results.append({
                "title": title,
                "url": url,
                "cover_image": pngname
            })
        except Exception as e:
            print(f"处理失败: {url}, 错误: {e}")

    # 保存结果为JSON
    with open("publicity.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(1)
    csv_path = sys.argv[1]
    process_wechat_articles(csv_path)
