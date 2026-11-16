# مجلهٔ روان‌شناسی انتخاب بهتر

سایت ایستای مجله (پوشهٔ `site`) که با GitHub Pages منتشر می‌شود، به‌اضافهٔ پنل مدیریت در `site/admin`.

## ساختار
- `site/index.html`، `site/css`، `site/js/app.js`: سایت (صفحهٔ اول، دسته‌ها، مقاله، شمارهٔ ماهانه، ابزارها، دربارهٔ ما)
- `site/data/articles.json`: ده مقالهٔ آزمایشی؛ تا وقتی پایگاه داده وصل نشده، سایت از این فایل می‌خواند
- `site/admin`: پنل مدیریت با ورود ایمیل و رمز عبور (Supabase)
- `supabase/schema.sql` و `supabase/seed_articles.sql`: ساخت جدول‌ها و ورود ده مقاله
- `tools/extract.py`: استخراج مقاله از فایل‌های Word انتخاب بهتر

## فعال کردن پنل مدیریت
1. در supabase.com یک پروژهٔ رایگان بسازید.
2. در `schema.sql` به‌جای `OWNER_EMAIL` ایمیل مالک را بگذارید و آن را در SQL Editor اجرا کنید؛ سپس `seed_articles.sql` را اجرا کنید.
3. از Project Settings → API مقدار Project URL و anon public key را در `site/js/config.js` بگذارید و push کنید.
4. در Authentication → URL Configuration نشانی سایت را به‌عنوان Site URL بگذارید.
5. مالک در `/admin` با دکمهٔ «ساخت رمز» برای ایمیل خودش رمز می‌سازد و وارد می‌شود؛ کاربران دیگر را از زبانهٔ «کاربران و دسترسی» اضافه می‌کند.
