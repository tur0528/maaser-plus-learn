# כתובת האתר ודומיין

## עכשיו: תצוגה מקדימה ב־GitHub Pages
- כתובת: **https://tur0528.github.io/maaser-plus-learn/**
- ריפו: https://github.com/tur0528/maaser-plus-learn (ענף `main`)
- כל push ל־`main` (כולל שמירה ב־Pages CMS) בונה ומפרסם מחדש דרך `.github/workflows/deploy.yml`, תוך דקה־שתיים.
- ב־`astro.config.mjs`: ‏`SITE_URL = https://tur0528.github.io`, ‏`BASE_PATH = /maaser-plus-learn`. כל הקישורים הפנימיים עוברים דרך `u()` שב־`src/lib.ts`, ולכן מתאימים את עצמם ל־BASE_PATH.

## בהמשך: learn.maaser-plus.com (אחרי אישור של אור)
האפליקציה נשארת ב־`maaser-plus.com` בלי שינוי.

### 1. Wix (שם מנוהל הדומיין)
1. Wix ← Domains ← הדומיין maaser-plus.com ← ⋯ ← **Manage DNS Records**.
2. תחת **CNAME** ← Add Record:
   - Host name: `learn`
   - Value / Points to: `tur0528.github.io`
   - TTL: ברירת מחדל
3. שומרים. ההתעדכנות לוקחת בדרך כלל דקות עד כמה שעות, ולעיתים עד 48 שעות.
4. **לא נוגעים** ברשומות A ו־CNAME הקיימות של `maaser-plus.com` ו־`www`. הן מחברות את האפליקציה ב־Base44.

### 2. באתר (שינוי אחד בקוד)
1. יוצרים את הקובץ `public/CNAME` עם השורה היחידה: `learn.maaser-plus.com`
2. ב־`astro.config.mjs` משנים את ברירות המחדל:
   - `SITE_URL` ← `https://learn.maaser-plus.com`
   - `BASE_PATH` ← `/`
3. commit + push. (קישורים לתמונות במאמרים, `/media/...`, ממשיכים לעבוד לבד.)

### 3. GitHub
1. ריפו ← Settings ← Pages ← Custom domain: כותבים `learn.maaser-plus.com` ← Save.
2. אחרי שה־DNS מתעדכן ו־GitHub מנפיק תעודה, מסמנים **Enforce HTTPS**.
3. הכתובת הישנה `tur0528.github.io/maaser-plus-learn/` תפנה אוטומטית לחדשה.

### 4. אחרי החיבור
- ב־Base44, בקובץ `integrations/base44/shared/community.ts`, ב־`ALLOWED_ORIGINS` כבר מופיע `https://learn.maaser-plus.com`.
- ב־Google Search Console מוסיפים את `learn.maaser-plus.com` ומגישים את `https://learn.maaser-plus.com/sitemap-index.xml`.
- אם הכתובת שונה מ־learn, מעדכנים אותה ב־`public/CNAME`, ב־`astro.config.mjs` וב־`ALLOWED_ORIGINS`.
