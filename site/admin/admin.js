(() => {
const C = window.MAG_CONFIG || {};
const root = document.getElementById('root');
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CATS = { self: 'خودشناسی', relations: 'روابط', parenting: 'فرزندپروری', mental: 'سلامت روان', work: 'کار و زندگی', approach: 'رویکردها' };
const ROLES = { owner: 'مالک', admin: 'مدیر', editor: 'ویراستار' };

if (!C.SUPABASE_URL || !C.SUPABASE_ANON_KEY) {
  root.innerHTML = `<div class="setup"><h2>پنل مدیریت هنوز به پایگاه داده وصل نشده است</h2>
  <p>برای فعال شدن ورود با ایمیل و رمز عبور، یک پروژهٔ رایگان Supabase بسازید و دو مقدار <code>Project URL</code> و <code>anon public key</code> را در فایل <code>js/config.js</code> بگذارید. راهنمای کامل در فایل README مخزن است.</p>
  <p><a href="../">بازگشت به سایت</a></p></div>`;
  return;
}
const sb = supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY);
let me = null, tab = 'articles';

function loginView(msg = '') {
  root.innerHTML = `<div class="login"><form class="box" id="f">
    <h1>ورود مدیران</h1><p>مجلهٔ روان‌شناسی انتخاب بهتر</p>
    <label>ایمیل</label><input id="em" type="email" required autocomplete="username">
    <label>رمز عبور</label><input id="pw" type="password" required autocomplete="current-password" minlength="8">
    <div class="row" style="margin-top:18px"><button class="btn" id="go">ورود</button><button type="button" class="btn ghost" id="su">ساخت رمز (کاربر دعوت‌شده)</button></div>
    <div class="err" id="er">${esc(msg)}</div><p style="margin-top:14px"><a href="#" id="fg">رمز را فراموش کرده‌ام</a></p></form></div>`;
  const v = () => [document.getElementById('em').value.trim(), document.getElementById('pw').value];
  const er = t => document.getElementById('er').textContent = t;
  document.getElementById('f').onsubmit = async e => {
    e.preventDefault(); const [email, password] = v();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) er('ایمیل یا رمز عبور درست نیست.'); else start();
  };
  document.getElementById('su').onclick = async () => {
    const [email, password] = v(); if (!email || password.length < 8) return er('ایمیل و رمز حداقل ۸ نویسه را وارد کنید.');
    const { error } = await sb.auth.signUp({ email, password });
    er(error ? 'ثبت انجام نشد: ' + error.message : 'ثبت شد. اگر ایمیل تأیید آمد، آن را تأیید کنید و سپس وارد شوید.');
  };
  document.getElementById('fg').onclick = async e => {
    e.preventDefault(); const email = document.getElementById('em').value.trim(); if (!email) return er('اول ایمیل را بنویسید.');
    await sb.auth.resetPasswordForEmail(email, { redirectTo: location.href }); er('پیوند بازیابی رمز به ایمیل فرستاده شد.');
  };
}

async function start() {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return loginView();
  const { data: m } = await sb.from('members').select('*').eq('email', user.email.toLowerCase()).maybeSingle();
  if (!m) { await sb.auth.signOut(); return loginView('این ایمیل دسترسی مدیریت ندارد. از مالک سایت بخواهید شما را اضافه کند.'); }
  me = { ...m, uid: user.id }; shell();
}

function shell() {
  root.innerHTML = `<div class="top"><b>پنل مدیریت مجله</b><span>${esc(me.email)} · ${ROLES[me.role]}</span><a href="../" target="_blank">مشاهدهٔ سایت</a><button class="btn ghost" id="out">خروج</button></div>
    <div class="tabs"><button data-t="articles">مقاله‌ها</button><button data-t="edit">مقالهٔ جدید</button>${me.role !== 'editor' ? '<button data-t="users">کاربران و دسترسی</button>' : ''}<button data-t="account">حساب من</button></div><div class="panel" id="p"></div>`;
  document.getElementById('out').onclick = async () => { await sb.auth.signOut(); loginView(); };
  document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => go(b.dataset.t));
  go(tab);
}
function go(t, arg) {
  tab = t; document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.t === t));
  ({ articles, edit, users, account })[t](arg);
}
const P = () => document.getElementById('p');

async function articles() {
  P().innerHTML = 'در حال بارگذاری…';
  const { data, error } = await sb.from('articles').select('id,title,category,published,featured,updated_at').order('created_at', { ascending: false });
  if (error) return P().innerHTML = `<div class="err">${esc(error.message)}</div>`;
  P().innerHTML = `<div class="row" style="justify-content:space-between"><h3 style="margin:0">${data.length} مقاله</h3><button class="btn" id="nw">+ مقالهٔ جدید</button></div>
  <table><tr><th>عنوان</th><th>بخش</th><th>وضعیت</th><th></th></tr>${data.map(a => `<tr><td>${esc(a.title)}${a.featured ? ' ⭐' : ''}</td><td>${CATS[a.category] || ''}</td>
  <td><span class="pill ${a.published ? '' : 'off'}">${a.published ? 'منتشرشده' : 'پیش‌نویس'}</span></td><td><button class="btn ghost" data-e="${a.id}">ویرایش</button></td></tr>`).join('')}</table>`;
  document.getElementById('nw').onclick = () => go('edit');
  P().querySelectorAll('[data-e]').forEach(b => b.onclick = () => go('edit', b.dataset.e));
}

async function edit(id) {
  let a = { id: '', title: '', brief: '', category: 'self', minutes: 5, author: 'تحریریهٔ مجله', reviewer: 'شورای علمی انتخاب بهتر', date: '', cover: '', thumb: '', body: '', refs: [], featured: false, published: false };
  if (id) { const { data } = await sb.from('articles').select('*').eq('id', id).single(); if (data) a = data; }
  P().innerHTML = `<form id="ef" class="grid">
    <div class="full"><label>عنوان</label><input name="title" required value="${esc(a.title)}"></div>
    <div class="full"><label>خلاصه (روتیتر)</label><textarea name="brief" style="min-height:90px">${esc(a.brief)}</textarea></div>
    <div><label>بخش</label><select name="category">${Object.entries(CATS).map(([k, v]) => `<option value="${k}" ${a.category === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
    <div><label>زمان مطالعه (دقیقه)</label><input name="minutes" type="number" min="1" value="${a.minutes}"></div>
    <div><label>نویسنده</label><input name="author" value="${esc(a.author)}"></div>
    <div><label>بازبین علمی</label><input name="reviewer" value="${esc(a.reviewer)}"></div>
    <div><label>تاریخ انتشار (شمسی)</label><input name="date" value="${esc(a.date)}" placeholder="۱۴۰۵/۰۹/۰۱"></div>
    <div><label>تصویر اصلی</label><input type="file" id="img" accept="image/*"><input name="cover" value="${esc(a.cover)}" placeholder="یا نشانی تصویر">${a.cover ? `<img class="prev" src="${esc(/^https?:/.test(a.cover) ? a.cover : '../' + a.cover)}">` : ''}</div>
    <div class="full"><label>متن مقاله (HTML: &lt;h2&gt; برای میان‌تیتر، &lt;p&gt; برای پاراگراف، &lt;ul&gt;&lt;li&gt; برای فهرست)</label><textarea name="body">${esc(a.body)}</textarea></div>
    <div class="full"><label>منابع (هر منبع در یک خط)</label><textarea name="refs" style="min-height:100px;direction:ltr">${esc((a.refs || []).join('\n'))}</textarea></div>
    <div class="full row"><label><input type="checkbox" name="featured" ${a.featured ? 'checked' : ''} style="width:auto"> مقالهٔ برگزیده</label>
      <label><input type="checkbox" name="published" ${a.published ? 'checked' : ''} style="width:auto"> منتشر شود</label></div>
    <div class="full row"><button class="btn">ذخیره</button>${id ? '<button type="button" class="btn red" id="del">حذف</button>' : ''}<span class="err" id="msg"></span></div></form>`;
  const f = document.getElementById('ef'), msg = t => document.getElementById('msg').textContent = t;
  if (id) document.getElementById('del').onclick = async () => {
    if (!confirm('این مقاله برای همیشه حذف شود؟')) return;
    const { error } = await sb.from('articles').delete().eq('id', id); error ? msg(error.message) : go('articles');
  };
  f.onsubmit = async e => {
    e.preventDefault(); msg('در حال ذخیره…');
    const d = Object.fromEntries(new FormData(f));
    const file = document.getElementById('img').files[0];
    if (file) {
      const path = `covers/${Date.now()}-${file.name.replace(/[^\w.]/g, '')}`;
      const up = await sb.storage.from('images').upload(path, file);
      if (up.error) return msg('بارگذاری تصویر ناموفق بود: ' + up.error.message);
      d.cover = sb.storage.from('images').getPublicUrl(path).data.publicUrl;
    }
    const row = { title: d.title, brief: d.brief, category: d.category, minutes: +d.minutes || 5, author: d.author, reviewer: d.reviewer, date: d.date,
      cover: d.cover, thumb: d.cover === a.cover ? (a.thumb || d.cover) : d.cover, body: d.body,
      refs: d.refs.split('\n').map(s => s.trim()).filter(Boolean), featured: f.featured.checked, published: f.published.checked, updated_at: new Date().toISOString() };
    if (!id) row.id = 'a' + Date.now().toString(36);
    const { error } = id ? await sb.from('articles').update(row).eq('id', id) : await sb.from('articles').insert(row);
    if (error) return msg(error.message);
    msg('ذخیره شد.'); if (!id) go('articles');
  };
}

async function users() {
  const { data } = await sb.from('members').select('*').order('created_at');
  P().innerHTML = `<h3 style="margin-top:0">کاربرانی که به پنل دسترسی دارند</h3>
  <table><tr><th>ایمیل</th><th>نقش</th><th></th></tr>${(data || []).map(u => `<tr><td>${esc(u.email)}</td><td>${ROLES[u.role]}</td>
  <td>${u.role === 'owner' ? '' : `<button class="btn ghost" data-d="${esc(u.email)}">حذف دسترسی</button>`}</td></tr>`).join('')}</table>
  <h3>افزودن کاربر</h3><form id="uf" class="row"><input name="email" type="email" required placeholder="ایمیل کاربر" style="max-width:280px">
  <select name="role" style="max-width:160px"><option value="editor">ویراستار (فقط مقاله)</option><option value="admin">مدیر (مقاله و کاربران)</option></select>
  <button class="btn">افزودن</button><span class="err" id="um"></span></form>
  <p style="color:var(--muted);font-size:14px">پس از افزودن، کاربر به صفحهٔ ورود همین پنل می‌رود و با دکمهٔ «ساخت رمز» برای همین ایمیل رمز می‌سازد.</p>`;
  document.getElementById('uf').onsubmit = async e => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(e.target));
    const { error } = await sb.from('members').insert({ email: d.email.trim().toLowerCase(), role: d.role });
    error ? document.getElementById('um').textContent = error.message : users();
  };
  P().querySelectorAll('[data-d]').forEach(b => b.onclick = async () => {
    if (!confirm(`دسترسی ${b.dataset.d} برداشته شود؟`)) return;
    await sb.from('members').delete().eq('email', b.dataset.d); users();
  });
}

function account() {
  P().innerHTML = `<h3 style="margin-top:0">تغییر رمز عبور</h3><form id="pf" class="row"><input id="np" type="password" minlength="8" required placeholder="رمز جدید (حداقل ۸ نویسه)" style="max-width:300px"><button class="btn">ذخیره</button><span class="err" id="pm"></span></form>`;
  document.getElementById('pf').onsubmit = async e => {
    e.preventDefault(); const { error } = await sb.auth.updateUser({ password: document.getElementById('np').value });
    document.getElementById('pm').textContent = error ? error.message : 'رمز تغییر کرد.';
  };
}

sb.auth.onAuthStateChange(ev => { if (ev === 'PASSWORD_RECOVERY') { me && shell(); } });
start();
})();
