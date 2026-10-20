# חיבור הדומיין (בהמשך, אחרי אישור של אור)

הכתובת המוצעת היא `learn.maaser-plus.com`. השם עדיין לא סופי, ואפשר גם `ma.` או `torah.`. האפליקציה נשארת ב־`maaser-plus.com` בלי שינוי.

## 1. GitHub
1. יוצרים מאגר (repo) חדש בחשבון tur0528, למשל `maaser-plus-site`, ודוחפים אליו את התיקייה הזו. **עוד לא בוצע, ממתין לאישור.**
2. ב־Settings ← Pages ← Source בוחרים **GitHub Actions**. ה־workflow כבר מוכן ב־`.github/workflows/deploy.yml`.
3. ב־Settings ← Pages ← Custom domain כותבים `learn.maaser-plus.com` ושומרים. אחרי שה־DNS מתעדכן, מסמנים **Enforce HTTPS**.
4. מוסיפים לאתר את הקובץ `public/CNAME` עם השורה `learn.maaser-plus.com`. ב־`astro.config.mjs` הכתובת הזו כבר מוגדרת כברירת מחדל.

## 2. Wix (אם הדומיין מנוהל שם)
1. Wix ← Domains ← הדומיין maaser-plus.com ← ⋯ ← **Manage DNS Records**.
2. תחת **CNAME** ← Add Record:
   - Host name: `learn`
   - Value / Points to: `tur0528.github.io`
   - TTL: ברירת מחדל
3. שומרים. ההתעדכנות לוקחת בדרך כלל דקות עד כמה שעות, ולעיתים עד 48 שעות.
4. **לא נוגעים** ברשומות A ו־CNAME הקיימות של `maaser-plus.com` ו־`www`. הן מחברות את האפליקציה ב־Base44.

## 3. אחרי החיבור
- ב־Base44, בקובץ `integrations/base44/shared/community.ts`, מעדכנים את `ALLOWED_ORIGINS` לכתובת הסופית.
- ב־Google Search Console מוסיפים את `learn.maaser-plus.com` ומגישים את `https://learn.maaser-plus.com/sitemap-index.xml`.
- אם הכתובת שונה מ־learn, מעדכנים אותה ב־`astro.config.mjs` (SITE_URL), ב־`public/CNAME` וב־`ALLOWED_ORIGINS`.
