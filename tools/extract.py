"""Pull 10 Better Choice articles (docx + images) into site/data/articles.json."""
import docx, json, re, os, html, shutil
from PIL import Image

SRC = r'F:\سایت انتخاب بهتر\مقاله‌ها'
SITE = os.path.join(os.path.dirname(__file__), '..', 'site')
md = re.compile(r'\[([^\]]+)\]\((https?://[^)]+)\)')

PICK = [  # folder, category slug, test-issue section
    ('۷۰', 'mental'), ('۷۱', 'self'), ('۷۴', 'relations'), ('۷۶', 'mental'), ('۷۹', 'parenting'),
    ('۸۶', 'self'), ('۸۷', 'mental'), ('۹۱', 'parenting'), ('۹۲', 'relations'), ('۹۳', 'work'),
]

def inl(t):
    t = html.escape(t, quote=False)
    return md.sub(lambda m: f'<a href="{m.group(2)}" target="_blank" rel="noopener">{m.group(1)}</a>', t)

def conv(folder):
    d = os.path.join(SRC, folder)
    f = [x for x in os.listdir(d) if x.endswith('.docx')][0]
    paras = [p.text.strip() for p in docx.Document(os.path.join(d, f)).paragraphs if p.text.strip()]
    i = 0
    while paras[i].startswith('•') or re.match(r'^(کلیدواژه|عنوان سئو|متا|نشانی|خوشه|URL|Slug)', paras[i]): i += 1
    title, brief, body = paras[i], paras[i + 1], paras[i + 2:]
    out, lst, items, refs, inref, faq, nxt = [], None, [], [], False, False, False
    def close():
        nonlocal lst, items
        if lst: out.append(f'<{lst}>' + ''.join(items) + f'</{lst}>')
        lst, items = None, []
    for t in body:
        if t == 'منابع': close(); inref = True; continue
        if inref: refs.append(inl(t.lstrip('• '))); continue
        if t == 'قدم بعدی شما': close(); nxt = True; out.append('<h2 class="next">قدم بعدی شما</h2><div class="next-box">'); continue
        if nxt:
            out.append(f'<p>{inl(t.lstrip("• "))}</p>'); continue
        if t.startswith('•') or re.match(r'^[\d۰-۹]+[.)]\s', t):
            kind = 'ul' if t.startswith('•') else 'ol'
            if lst != kind: close(); lst = kind
            s = t.lstrip('• ') if kind == 'ul' else re.sub(r'^[\d۰-۹]+[.)]\s*', '', t)
            items.append(f'<li>{inl(s)}</li>'); continue
        close()
        heading = len(t) < 95 and not re.search(r'[.؛:»…!]$', t)
        if t == 'پرسش‌های پرتکرار': faq = True
        if heading:
            out.append(f'<h3>{inl(t)}</h3>' if faq and t.endswith('؟') else f'<h2>{inl(t)}</h2>')
        else:
            out.append(f'<p>{inl(t)}</p>')
    close()
    if nxt: out.append('</div>')
    words = sum(len(re.sub('<[^>]+>', ' ', x).split()) for x in out)
    return title, brief, ''.join(out), refs, max(3, round(words / 200))

arts = []
os.makedirs(os.path.join(SITE, 'img', 'articles'), exist_ok=True)
for n, (folder, cat) in enumerate(PICK, 1):
    title, brief, body, refs, mins = conv(folder)
    src = os.path.join(SRC, folder)
    for name, key in (('cloddse-water.jpg', 'cover'), ('dd_home.jpg', 'thumb')):
        im = Image.open(os.path.join(src, name)).convert('RGB')
        im.save(os.path.join(SITE, 'img', 'articles', f'a{n}-{key}.jpg'), quality=82, optimize=True)
    arts.append({'id': f'a{n}', 'title': title, 'brief': brief, 'category': cat, 'minutes': mins,
                 'author': 'تحریریهٔ مجله', 'reviewer': 'شورای علمی انتخاب بهتر',
                 'date': '۱۴۰۵/۰۸/' + '۰۱۲۳۴۵۶۷۸۹'[min(n, 9)].rjust(2, '۰') if n < 10 else '۱۴۰۵/۰۸/۱۰',
                 'cover': f'img/articles/a{n}-cover.jpg', 'thumb': f'img/articles/a{n}-thumb.jpg',
                 'body': body, 'refs': refs, 'featured': n in (1, 3, 9)})
    print(n, title, mins, len(refs))
json.dump(arts, open(os.path.join(SITE, 'data', 'articles.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
