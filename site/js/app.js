(() => {
const CATS = {
  self:      { name: 'خودشناسی',    color: '#3FA65E', desc: 'هیجان‌ها، شخصیت، عزت‌نفس، معنا و انگیزه.', subs: ['هیجان‌ها','شخصیت','عزت‌نفس','معنا و انگیزه','عادت‌ها'] },
  relations: { name: 'روابط',       color: '#e8834a', desc: 'زوج و ازدواج، دوستی، خانواده و ارتباط مؤثر.', subs: ['زوج و ازدواج','دوستی','خانواده','ارتباط مؤثر'] },
  parenting: { name: 'فرزندپروری',  color: '#2c7fb8', desc: 'کودک، نوجوان، مدرسه و والدگری.', subs: ['کودک','نوجوان','مدرسه','والدگری'] },
  mental:    { name: 'سلامت روان',  color: '#7b5ea7', desc: 'اضطراب، افسردگی، استرس، سوگ و خواب.', subs: ['اضطراب','افسردگی','استرس','سوگ','خواب'] },
  work:      { name: 'کار و زندگی', color: '#c9a227', desc: 'شغل، بهره‌وری، فرسودگی و پول.', subs: ['شغل','بهره‌وری','فرسودگی شغلی','پول و روان'] },
  approach:  { name: 'رویکردها',    color: '#183459', desc: 'تئوری انتخاب، ACT، CBT، ذهن‌آگاهی و روان‌شناسی مثبت.', subs: ['تئوری انتخاب','ACT','CBT','ذهن‌آگاهی'] },
};
const NAV = [['#/','خانه'],['#/c/self','خودشناسی'],['#/c/relations','روابط'],['#/c/parenting','فرزندپروری'],['#/c/mental','سلامت روان'],['#/c/work','کار و زندگی'],['#/c/approach','رویکردها'],['#/tools','ابزارها'],['#/issue','مجله'],['#/about','دربارهٔ ما']];
const fa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const $ = s => document.querySelector(s);
let ARTS = [];

async function load() {
  const c = window.MAG_CONFIG || {};
  if (c.SUPABASE_URL && c.SUPABASE_ANON_KEY) {
    try {
      const r = await fetch(`${c.SUPABASE_URL}/rest/v1/articles?select=*&published=eq.true&order=created_at.desc`,
        { headers: { apikey: c.SUPABASE_ANON_KEY, Authorization: `Bearer ${c.SUPABASE_ANON_KEY}` } });
      if (r.ok) { const d = await r.json(); if (d.length) { ARTS = d; return; } }
    } catch (e) {}
  }
  ARTS = await (await fetch('data/articles.json')).json();
}

const catOf = a => CATS[a.category] || CATS.self;
const card = (a, i = 0) => `
  <a class="card rv" style="transition-delay:${(i % 3) * 120}ms" href="#/a/${a.id}">
    <div class="im"><img loading="lazy" src="${esc(a.thumb || a.cover)}" alt=""><span class="tag on-img" style="color:${catOf(a).color}">${catOf(a).name}</span></div>
    <div class="bd"><h3>${esc(a.title)}</h3><p>${esc(a.brief)}</p>
    <div class="meta"><span>⏱ ${fa(a.minutes || 5)} دقیقه</span><span>${esc(a.author)}</span></div></div></a>`;
const soon = (ic, t, d, extra = '') => `<div class="soon rv z"><span class="pill">به‌زودی</span><div class="ic">${ic}</div><h3>${t}</h3><p>${d}</p>${extra}</div>`;
const head = (t, link, sub) => `<div class="shead rv"><div><h2>${t}</h2>${sub ? `<p>${sub}</p>` : ''}</div>${link ? `<a href="${link[0]}">${link[1]} ←</a>` : ''}</div>`;

function home() {
  const feat = ARTS.filter(a => a.featured).concat(ARTS).filter((a, i, s) => s.indexOf(a) === i);
  const lead = ARTS[0];
  const chips = Object.entries(CATS).map(([k, c]) => `<a class="chip" href="#/c/${k}"><i style="background:${c.color}"></i>${c.name}</a>`).join('');
  return `
  <section class="hero">
    <div class="blob b1"></div><div class="blob b2"></div>
    <div class="wrap hgrid">
      <div class="issue">
        <div class="cover3d rv r"><div class="cv"><span class="mast">انتخاب بهتر</span><img src="${esc(lead.cover)}" alt=""><div class="ct"><span>شمارهٔ ۱ · آذر ۱۴۰۵</span><b>ذهن آرام در روزهای پرتنش</b></div></div></div>
        <div class="rv">
          <span class="kicker">پروندهٔ ویژهٔ این ماه</span>
          <h1>ذهن آرام در روزهای پرتنش</h1>
          <p>از اضطراب و تنهایی تا فرسودگی شغلی؛ دانش معتبر روان‌شناسی، به زبان ساده و کاربردی.</p>
          <div class="acts"><a class="btn" href="#/issue">خواندن این شماره</a><a class="btn ghost" href="#/a/${lead.id}">مقالهٔ اصلی</a></div>
        </div>
      </div>
      <aside class="editor rv l">
        <h3>یادداشت سردبیر</h3>
        <blockquote>ما این مجله را ساختیم تا دانش روان‌شناسی از کتاب‌ها و کلاس‌ها بیرون بیاید و به زندگی روزمره برسد؛ دقیق، منبع‌دار و مهربان.</blockquote>
        <div class="sig">سردبیر مجله</div>
        <div class="stats"><div><b data-count="${ARTS.length}">۰</b><span>مقاله</span></div><div><b data-count="6">۰</b><span>بخش</span></div><div><b data-count="1">۰</b><span>شماره</span></div></div>
      </aside>
    </div>
    <svg class="wave" viewBox="0 0 1440 60" preserveAspectRatio="none"><path fill="#fbfcfd" d="M0,30 C240,70 480,0 720,25 C960,50 1200,10 1440,35 L1440,60 L0,60Z"><animate attributeName="d" dur="9s" repeatCount="indefinite" values="M0,30 C240,70 480,0 720,25 C960,50 1200,10 1440,35 L1440,60 L0,60Z;M0,35 C240,5 480,60 720,30 C960,0 1200,55 1440,25 L1440,60 L0,60Z;M0,30 C240,70 480,0 720,25 C960,50 1200,10 1440,35 L1440,60 L0,60Z"/></path></svg>
  </section>

  <section class="s"><div class="wrap">${head('مقاله‌های برگزیده', ['#/c/self', 'همهٔ مقاله‌ها'])}
    <div class="grid3">${feat.slice(0, 3).map(card).join('')}</div></div></section>

  <div class="wrap"><div class="cats rv"><div class="track">${chips}${chips}</div><div class="track" aria-hidden="true">${chips}${chips}</div></div></div>

  <section class="s"><div class="wrap duo">
    <div class="feature g rv r"><div class="ring"></div><span class="lbl">تمرین امروز · ۵ دقیقه</span><h3>سه چیز خوب امروز</h3><p>پیش از خواب، سه اتفاق خوب امروز را بنویسید و بگویید چرا رخ داد.</p><a class="btn" href="#/tools">انجام بده</a></div>
    <div class="feature n rv l"><div class="ring"></div><span class="lbl">آزمون هفته · ۱۰ پرسش</span><h3>سبک دلبستگی شما چیست؟</h3><p>با یک خودسنجی کوتاه، الگوی رابطه‌تان را بهتر بشناسید.</p><a class="btn" href="#/tools">شروع آزمون</a></div>
  </div></section>

  <section class="s" style="padding-top:0"><div class="wrap split">
    <div>${head('تازه‌ترین مقاله‌ها', null)}<div class="list rv">${ARTS.slice(3, 8).map(a => `<a href="#/a/${a.id}"><img loading="lazy" src="${esc(a.thumb)}" alt=""><div><span class="tag">${catOf(a).name}</span><h4>${esc(a.title)}</h4></div></a>`).join('')}</div></div>
    <div>${head('پربازدیدها', null)}<div class="list rv">${ARTS.slice(0, 5).map((a, i) => `<a href="#/a/${a.id}"><span class="num">${fa(i + 1)}</span><h4>${esc(a.title)}</h4></a>`).join('')}</div></div>
  </div></section>

  <section class="s band"><div class="wrap">${head('پروندهٔ ویژه: رابطه‌ها و ریشه‌ها', null, 'چهار مقاله دربارهٔ اینکه گذشته و دلبستگی چطور رابطه‌های امروز ما را می‌سازند.')}
    <div class="dossier"><div class="intro rv r"><div class="ring" style="position:absolute;left:-50px;bottom:-50px;width:200px;height:200px;border:30px solid rgba(63,166,94,.25);border-radius:50%;animation:spin 20s linear infinite"></div><span class="kicker">پرونده</span><h3>رابطه‌ها و ریشه‌ها</h3><p>چرا در عشق این‌طور رفتار می‌کنیم و چطور می‌توانیم الگو را تغییر دهیم؟</p></div>
    <div class="mini">${['a9','a6','a3','a8'].map(id => ARTS.find(a => a.id === id)).filter(Boolean).map((a, i) => `<a class="rv" style="transition-delay:${i*100}ms" href="#/a/${a.id}"><img loading="lazy" src="${esc(a.thumb)}" alt=""><b>${esc(a.title)}</b></a>`).join('')}</div></div></div></section>

  <section class="s"><div class="wrap grid3">
    ${soon('<div class="wave-ic"><i></i><i></i><i></i><i></i><i></i></div>', 'پادکست مجله', 'هر هفته گفت‌وگویی کوتاه با یک متخصص.')}
    ${soon('🎬', 'ویدیو', 'توضیح مفاهیم روان‌شناسی در ویدیوهای کوتاه.')}
    ${soon('💬', 'گفت‌وگوی ماه', 'گفت‌وگو با یک روان‌شناس دربارهٔ موضوع پرونده.')}
  </div></section>

  <section class="s" style="padding-top:0"><div class="wrap grid3">
    ${soon('🔤', 'واژهٔ ماه: تاب‌آوری', 'توان بازگشت به تعادل پس از سختی؛ مهارتی که یاد گرفتنی است.')}
    ${soon('📚', 'معرفی کتاب', 'هر ماه سه کتاب خواندنی روان‌شناسی.')}
    ${soon('🗓', 'تقویم بهزیستی ماه', 'سی تمرین کوچک برای سی روز ماه.')}
  </div></section>

  <section class="s band"><div class="wrap">${head('مشاوران', ['#/about', 'همهٔ مشاوران'], 'متخصصان تأییدشدهٔ موسسهٔ انتخاب بهتر')}
    <div class="grid4">${[1,2,3,4].map(i => `<div class="soon rv z" style="transition-delay:${i*90}ms;align-items:center;text-align:center"><div class="avatar"></div><h3>نام متخصص</h3><p>روان‌شناس بالینی</p></div>`).join('')}</div></div></section>

  <section class="s"><div class="wrap"><div class="join rv z">
    <div><h2>هر هفته، یک ذهن روشن‌تر</h2><p>خلاصهٔ بهترین مقاله‌ها و تمرین‌های هفته را در ایمیلتان بگیرید.</p>
    <div class="chans"><a href="#/join">کانال تلگرام</a><a href="#/join">اینستاگرام</a><a href="#/join">دانلود اپ</a></div></div>
    <form onsubmit="event.preventDefault();this.innerHTML='<b style=&quot;color:#183459;padding:10px 16px&quot;>ثبت شد؛ ممنون!</b>'"><input type="email" required placeholder="ایمیل شما"><button class="btn">عضویت</button></form>
  </div></div></section>

  <section class="s" style="padding-top:0"><div class="wrap">${head('چرا به ما اعتماد کنید', ['#/about', 'فرایند ویرایشی'])}
    <div class="trust">${[['شورای علمی','هر مقاله را یک متخصص بازبینی می‌کند.'],['منبع‌دهی شفاف','فهرست منابع علمی در پایان هر مقاله.'],['زبان ساده','دانش دقیق، بدون اصطلاح‌های پیچیده.'],['بازبینی دوره‌ای','مقاله‌ها هر دو سال به‌روز می‌شوند.']].map((t, i) => `<div class="rv" style="transition-delay:${i*100}ms"><b>${t[0]}</b><span>${t[1]}</span></div>`).join('')}</div></div></section>`;
}

function category(k) {
  const c = CATS[k]; if (!c) return notFound();
  const list = ARTS.filter(a => a.category === k);
  return `<section class="chead"><div class="wrap"><div class="crumb"><a href="#/">خانه</a> › ${c.name}</div>
    <h1 class="rv" style="color:${c.color}">${c.name}</h1><p class="rv">${c.desc}</p>
    <div class="subs rv">${c.subs.map(s => `<span>${s}</span>`).join('')}</div></div></section>
    <section class="s" style="padding-top:20px"><div class="wrap">${list.length ? `<div class="grid3">${list.map(card).join('')}</div>` :
      `<div class="grid3">${soon('✍️', 'به‌زودی', 'مقاله‌های این بخش در حال آماده‌سازی است.')}</div>`}</div></section>`;
}

function article(id) {
  const a = ARTS.find(x => x.id === id); if (!a) return notFound();
  const c = catOf(a);
  const rel = ARTS.filter(x => x.id !== a.id && x.category === a.category).concat(ARTS.filter(x => x.id !== a.id)).filter((x, i, s) => s.indexOf(x) === i).slice(0, 3);
  return `<div class="ahead"><div class="blob b1" style="position:absolute;width:380px;height:380px;border-radius:50%;filter:blur(70px);opacity:.45;background:${c.color};top:-140px;left:-60px"></div>
    <div class="wrap" style="position:relative"><div class="crumb"><a href="#/">خانه</a> › <a href="#/c/${a.category}">${c.name}</a></div>
    <span class="tag" style="background:#fff;color:${c.color}">${c.name}</span> <span style="color:#9fb2c9;font-size:14px">⏱ ${fa(a.minutes || 5)} دقیقه مطالعه</span>
    <h1>${esc(a.title)}</h1><div class="lede">${esc(a.brief)}</div>
    <div class="byline"><span>نویسنده: <b>${esc(a.author)}</b></span><span>بازبینی علمی: <b>${esc(a.reviewer || 'شورای علمی')}</b></span><span>انتشار: ${esc(a.date || '')}</span></div></div></div>
    <div class="wrap acover rv z"><img src="${esc(a.cover)}" alt=""></div>
    <div class="wrap alayout">
      <aside class="side"><div class="toc"><h4>در این مقاله</h4><div id="toc"></div></div>
        <div class="share"><button onclick="navigator.clipboard&&navigator.clipboard.writeText(location.href);this.textContent='کپی شد'">پیوند</button><button onclick="window.print()">چاپ</button></div></aside>
      <article class="prose">
        <div class="keybox"><h4>نکته‌های کلیدی</h4><ul id="keys"></ul></div>
        <div id="body">${a.body}</div>
        <div class="helpbox"><b>کی باید از متخصص کمک بگیرم؟</b><br>اگر این نشانه‌ها چند هفته ادامه دارد یا زندگی روزمره‌تان را مختل کرده، با یک روان‌شناس یا مشاور گفت‌وگو کنید. <a href="#/about">فهرست مشاوران</a></div>
        ${a.refs && a.refs.length ? `<div class="refs"><h4>منابع</h4><ol>${a.refs.map(r => `<li>${r}</li>`).join('')}</ol></div>` : ''}
        <div class="authorbox"><div class="avatar"></div><div><b>${esc(a.author)}</b><br><span style="color:var(--muted);font-size:14px">تحریریهٔ مجلهٔ انتخاب بهتر؛ بازبینی‌شده به‌دست ${esc(a.reviewer || 'شورای علمی')}.</span></div></div>
      </article></div>
    <section class="s"><div class="wrap">${head('مقاله‌های مرتبط', null)}<div class="grid3">${rel.map(card).join('')}</div></div></section>`;
}

function afterArticle() {
  const body = $('#body'); if (!body) return;
  const hs = [...body.querySelectorAll('h2')].filter(h => !h.classList.contains('next'));
  $('#toc').innerHTML = hs.map((h, i) => { h.id = 'h' + i; return `<a href="javascript:void 0" data-t="h${i}">${h.textContent}</a>`; }).join('');
  $('#toc').onclick = e => { const t = e.target.dataset.t; if (t) document.getElementById(t).scrollIntoView({ behavior: 'smooth' }); };
  const keys = hs.slice(0, 4).map(h => `<li>${h.textContent}</li>`).join('');
  $('#keys').innerHTML = keys || '<li>این مقاله را تا پایان بخوانید.</li>';
  body.querySelectorAll('p,h2,h3,ul,ol,.next-box').forEach(el => el.classList.add('rv'));
  const links = [...$('#toc').children];
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(l => l.classList.toggle('on', l.dataset.t === e.target.id)); }), { rootMargin: '-20% 0px -70% 0px' });
  hs.forEach(h => io.observe(h));
}

function issue() {
  const cols = ['سرمقاله','پروندهٔ ویژه','گفت‌وگو با متخصص','پژوهش‌های تازهٔ ماه','پژوهش ایرانی به زبان ساده','راهنمای عملی','روایت یک زندگی','روان‌شناسی در ادبیات و سینما','معرفی کتاب','پرسش خوانندگان','آزمون ماه','تقویم تمرین ماه','واژهٔ ماه','پوستر ماه','اشتباه رایج'];
  return `<section class="hero" style="padding-bottom:70px"><div class="blob b1"></div><div class="wrap issue">
    <div class="cover3d rv r"><div class="cv"><span class="mast">انتخاب بهتر</span><img src="${esc(ARTS[0].cover)}" alt=""><div class="ct"><span>شمارهٔ ۱ · آذر ۱۴۰۵</span><b>ذهن آرام در روزهای پرتنش</b></div></div></div>
    <div class="rv"><span class="kicker">شمارهٔ ۱ · آذر ۱۴۰۵</span><h1>ذهن آرام در روزهای پرتنش</h1><p>${fa(ARTS.length)} مقاله دربارهٔ اضطراب، رابطه، فرزندپروری و کار.</p><div class="acts"><a class="btn" href="#/a/${ARTS[0].id}">شروع خواندن</a><span class="btn ghost">دانلود PDF (به‌زودی)</span></div></div></div></section>
    <section class="s"><div class="wrap">${head('فهرست مطالب این شماره', null)}<div class="grid3">${ARTS.map(card).join('')}</div></div></section>
    <section class="s band"><div class="wrap">${head('ستون‌های ثابت هر شماره', null)}<div class="subs rv">${cols.map(c => `<span>${c}</span>`).join('')}</div></div></section>`;
}

function tools() {
  return `<section class="chead"><div class="wrap"><h1 class="rv">ابزارها</h1><p class="rv">آزمون‌های خودسنجی، تمرین‌های علمی و تقویم بهزیستی. آزمون‌ها جایگزین تشخیص تخصصی نیستند.</p></div></section>
    <section class="s" style="padding-top:20px"><div class="wrap">${head('آزمون‌های خودسنجی', null)}<div class="grid4">${['اضطراب','افسردگی','عزت‌نفس','هوش هیجانی','سبک دلبستگی','سبک فرزندپروری','استرس','شادکامی'].map(t => soon('📝', 'آزمون ' + t, 'خودسنجی کوتاه با تفسیر ساده.')).join('')}</div>
    <div style="height:40px"></div>${head('تمرین‌ها', null)}<div class="grid3">${[['🙏','قدردانی','سه چیز خوب امروز'],['🌿','ذهن‌آگاهی','تنفس سه‌دقیقه‌ای'],['💚','شفقت به خود','نامه‌ای مهربان به خودتان']].map(t => soon(t[0], t[1], t[2])).join('')}</div></div></section>`;
}

function about() {
  return `<section class="chead"><div class="wrap"><h1 class="rv">دربارهٔ ما</h1><p class="rv">مجلهٔ روان‌شناسی انتخاب بهتر رسانه‌ای علمی‌ـ‌ترویجی است که دانش معتبر روان‌شناسی را به زبان ساده برای زندگی روزمره منتشر می‌کند.</p></div></section>
  <section class="s" style="padding-top:20px"><div class="wrap">${head('فرایند ویرایشی', null)}
  <div class="trust">${[['۱. نوشتن','نویسندهٔ متخصص بر پایهٔ منابع علمی می‌نویسد.'],['۲. بازبینی علمی','یک عضو شورای علمی درستی محتوا را بررسی می‌کند.'],['۳. ویرایش','ویراستار متن را ساده و روان می‌کند.'],['۴. بازبینی دوره‌ای','مقاله‌ها هر دو سال به‌روز می‌شوند.']].map((t, i) => `<div class="rv" style="transition-delay:${i*100}ms"><b>${t[0]}</b><span>${t[1]}</span></div>`).join('')}</div>
  <div style="height:40px"></div>${head('هیئت تحریریه و شورای علمی', null)}<div class="grid4">${[1,2,3,4].map(() => `<div class="soon rv z" style="align-items:center;text-align:center"><div class="avatar"></div><h3>نام عضو</h3><p>سمت</p></div>`).join('')}</div>
  <div style="height:40px"></div><div class="duo">${soon('✍️', 'همکاری با ما', 'راهنمای نوشتن برای مجله و فرم ارسال مقاله.')}${soon('✉️', 'تماس با ما', 'فرم تماس، نشانی و ایمیل.')}</div></div></section>`;
}

const join = () => `<section class="s"><div class="wrap"><div class="join rv z"><div><h2>همراه ما باشید</h2><p>کانال تلگرام، صفحهٔ اینستاگرام و اپلیکیشن مجله به‌زودی راه‌اندازی می‌شود.</p></div><div class="chans"><a>کانال تلگرام</a><a>اینستاگرام</a><a>اپلیکیشن</a></div></div></div></section>`;
const notFound = () => `<section class="chead"><div class="wrap"><h1>صفحه پیدا نشد</h1><p><a class="btn" href="#/">بازگشت به خانه</a></p></div></section>`;

function reveal() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll('.rv:not(.in)').forEach(el => io.observe(el));
  document.querySelectorAll('[data-count]').forEach(el => {
    const n = +el.dataset.count; let i = 0; const t = setInterval(() => { i++; el.textContent = fa(Math.min(i, n)); if (i >= n) clearInterval(t); }, 60);
  });
  document.querySelectorAll('.card').forEach(c => {
    c.onmousemove = e => { const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `translateY(-8px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`; };
    c.onmouseleave = () => c.style.transform = '';
  });
}

function route() {
  const h = location.hash.replace(/^#/, '') || '/';
  const [, p, id] = h.split('/');
  const html = !p ? home() : p === 'c' ? category(id) : p === 'a' ? article(id) : p === 'issue' ? issue() : p === 'tools' ? tools() : p === 'about' ? about() : p === 'join' ? join() : p === 'login' ? loginPage() : p === 'signup' ? signupPage() : notFound();
  const app = $('#app'); app.style.animation = 'none'; app.offsetHeight; app.style.animation = '';
  app.innerHTML = html; window.scrollTo(0, 0);
  if (p === 'a') afterArticle();
  if (p === 'login' || p === 'signup') bindAuth(p);
  document.querySelectorAll('nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + h || (p === 'c' && a.getAttribute('href') === '#/c/' + id)));
  const ddb = document.querySelector('nav .ddb'); if (ddb) ddb.classList.toggle('on', p === 'c');
  $('#nav').classList.remove('open');
  document.title = (p === 'a' ? (ARTS.find(a => a.id === id) || {}).title + ' | ' : '') + 'مجلهٔ روان‌شناسی انتخاب بهتر';
  reveal();
}

addEventListener('scroll', () => {
  const d = document.documentElement; $('#progress').style.width = (d.scrollTop / (d.scrollHeight - d.clientHeight) * 100) + '%';
  $('#top').classList.toggle('scrolled', d.scrollTop > 20);
}, { passive: true });
$('#menuBtn').onclick = () => $('#nav').classList.toggle('open');
$('#searchBtn').onclick = () => { $('#search').classList.add('open'); $('#q').focus(); };
$('#search').onclick = e => { if (e.target.id === 'search') e.target.classList.remove('open'); };
$('#q').oninput = e => { const q = e.target.value.trim(); $('#sres').innerHTML = q ? ARTS.filter(a => (a.title + a.brief).includes(q)).map(a => `<a href="#/a/${a.id}" onclick="document.getElementById('search').classList.remove('open')">${esc(a.title)}</a>`).join('') || '<p style="padding:10px">نتیجه‌ای پیدا نشد.</p>' : ''; };
addEventListener('keydown', e => { if (e.key === 'Escape') $('#search').classList.remove('open'); });
const lk = ([h, t]) => `<a href="${h}">${t}</a>`;
$('#nav').innerHTML = lk(NAV[0]) + `<div class="dd"><button type="button" class="ddb" aria-haspopup="true" aria-expanded="false">دسته‌بندی‌ها <span>▾</span></button><div class="ddm">${NAV.slice(1, 7).map(lk).join('')}</div></div>` + NAV.slice(7).map(lk).join('');
const dd = $('#nav .dd');
dd.querySelector('.ddb').onclick = e => { e.stopPropagation(); const o = dd.classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', o); };
addEventListener('click', () => dd.classList.remove('open'));
dd.querySelectorAll('.ddm a').forEach(a => a.addEventListener('click', () => { dd.classList.remove('open'); $('#nav').classList.remove('open'); }));

// ---- ورود و ثبت‌نام کاربران (Supabase Auth) ----
const CFG = window.MAG_CONFIG || {};
const SB = (CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY && window.supabase) ? supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY) : null;
const fld = (n, l, t, ex = '') => `<label class="af"><span>${l}</span><input name="${n}" type="${t}" required ${ex}></label>`;
const authShell = (title, sub, body, foot) => `<section class="wrap authpg"><div class="authcard rv in"><h1>${title}</h1><p class="asub">${sub}</p>${body}<p class="amsg" id="amsg" role="status"></p><p class="afoot">${foot}</p></div></section>`;
function loginPage() {
  return authShell('ورود به حساب', 'خوش برگشتید؛ ایمیل و رمز عبورتان را وارد کنید.',
    `<form id="authForm" novalidate>${fld('email', 'ایمیل', 'email', 'autocomplete="email" dir="ltr"')}${fld('password', 'رمز عبور', 'password', 'autocomplete="current-password" dir="ltr"')}<button class="btn" type="submit">ورود</button></form>`,
    'حساب ندارید؟ <a href="#/signup">ثبت‌نام کنید</a>');
}
function signupPage() {
  return authShell('ساخت حساب کاربری', 'برای ساخت حساب، اطلاعات زیر را کامل کنید.',
    `<form id="authForm" novalidate><div class="af2">${fld('first', 'نام', 'text', 'autocomplete="given-name"')}${fld('last', 'نام خانوادگی', 'text', 'autocomplete="family-name"')}</div>${fld('phone', 'شمارهٔ تلفن همراه', 'tel', 'autocomplete="tel" dir="ltr" placeholder="09xxxxxxxxx" inputmode="numeric"')}${fld('email', 'ایمیل', 'email', 'autocomplete="email" dir="ltr"')}${fld('password', 'رمز عبور (دست‌کم ۸ نویسه)', 'password', 'autocomplete="new-password" dir="ltr" minlength="8"')}<button class="btn" type="submit">ساخت حساب</button></form>`,
    'حساب دارید؟ <a href="#/login">وارد شوید</a>');
}
const toEn = v => v.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).trim();
function bindAuth(kind) {
  const f = $('#authForm'), m = $('#amsg');
  const say = (t, ok) => { m.textContent = t; m.className = 'amsg ' + (ok ? 'ok' : 'err'); };
  f.onsubmit = async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)); Object.keys(d).forEach(k => d[k] = k === 'password' ? d[k] : toEn(d[k]));
    if (kind === 'signup') {
      if (!d.first || !d.last) return say('نام و نام خانوادگی را وارد کنید.');
      if (!/^09\d{9}$/.test(d.phone)) return say('شمارهٔ تلفن باید ۱۱ رقم و با ۰۹ شروع شود.');
    }
    if (!/^\S+@\S+\.\S+$/.test(d.email)) return say('ایمیل معتبر نیست.');
    if (kind === 'signup' && d.password.length < 8) return say('رمز عبور باید دست‌کم ۸ نویسه باشد.');
    if (!d.password) return say('رمز عبور را وارد کنید.');
    if (!SB) return say('سامانهٔ حساب کاربری هنوز به پایگاه داده وصل نشده است.');
    const b = f.querySelector('button'); b.disabled = true;
    try {
      if (kind === 'signup') {
        const { data, error } = await SB.auth.signUp({ email: d.email, password: d.password,
          options: { data: { first_name: d.first, last_name: d.last, full_name: d.first + ' ' + d.last, phone: d.phone } } });
        if (error) throw error;
        if (data.session) { say('حساب ساخته شد و وارد شدید.', 1); setTimeout(() => location.hash = '#/', 900); }
        else say('حساب ساخته شد. برای فعال شدن، روی پیوندی که به ایمیلتان فرستادیم بزنید.', 1);
      } else {
        const { error } = await SB.auth.signInWithPassword({ email: d.email, password: d.password });
        if (error) throw error;
        say('وارد شدید.', 1); setTimeout(() => location.hash = '#/', 700);
      }
    } catch (err) {
      const t = String(err.message || err);
      say(/Invalid login/i.test(t) ? 'ایمیل یا رمز عبور درست نیست.' : /registered/i.test(t) ? 'با این ایمیل قبلاً حساب ساخته شده است.' : /confirm/i.test(t) ? 'ایمیلتان هنوز تأیید نشده است.' : 'خطا: ' + t);
    } finally { b.disabled = false; }
  };
}
async function paintAuth() {
  const box = $('#authBox'); if (!SB || !box) return;
  const { data } = await SB.auth.getSession(); const u = data.session && data.session.user;
  if (!u) { box.innerHTML = '<a class="btn small ghost2" href="#/login">ورود</a><a class="btn small" href="#/signup">ثبت‌نام</a>'; return; }
  box.innerHTML = `<span class="uname">${esc((u.user_metadata || {}).first_name || u.email)}</span><button class="btn small ghost2" id="logoutBtn">خروج</button>`;
  $('#logoutBtn').onclick = () => SB.auth.signOut();
}
if (SB) SB.auth.onAuthStateChange(() => paintAuth());
paintAuth();
addEventListener('hashchange', route);
load().then(route);
})();
