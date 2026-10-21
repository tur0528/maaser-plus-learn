# מעשר+ · אתר התוכן "עשר כדי שתתעשר"

אתר סטטי ב־Astro 5, בעברית ומימין לשמאל, שנבנה למובייל קודם. העיצוב לפי `../design/final/` (README, tokens.css, reference/home-A.html).

**סטטוס:** נבנה מקומית בלבד. **לא נדחף ל־GitHub ולא פורסם**, וזה ממתין לאישור של אור.

## מבנה
| נתיב | מה יש בו |
|---|---|
| `src/pages/` | דף הבית, מאמרים (כולל סינון לפי נושא), סיפורים ושליחת סיפור, התייעצויות (פורום), על הפרויקט, פרטיות, נגישות, 404, robots.txt, manifest |
| `src/content/articles/`, `src/content/stories/` | קובצי Markdown. ב־frontmatter יש `summary` (לכרטיסים), וגוף הקובץ הוא העמוד המלא |
| `src/content.config.ts` | הסכמה של שני האוספים |
| `src/data/site.json` | ניסוחים שניתנים לעריכה: 3 השורות שממתינות לאישור, שם הרב ותאריך הבדיקה (placeholder), כתובת האפליקציה וכתובת שרת הקהילה |
| `.pages.yml` | הגדרות Pages CMS (עורך בדפדפן) |
| `src/scripts/community.ts` | **נקודת החיבור** לשרת הקהילה ב־Base44 |
| `integrations/base44/` | ישויות, backend functions והוראות הקמה |
| `tools/og.mjs` | יצירת תמונות og לכל מאמר וסיפור מהתבנית של סקיי |
| `tools/shots.py` | צילומי מסך |
| `tools/mock-community.mjs` | שרת דמה לבדיקת הפורום והטפסים |
| `docs/` | `HOW-TO-ADD-ARTICLE.md` (לאור), `FORUM-CHOICE.md`, `DNS.md` |

## פקודות
```bash
npm install
node tools/og.mjs     # כשנוספו או השתנו כותרות (צריך google-chrome + python3-Pillow)
npm run build         # → dist/
npm run preview       # http://localhost:4321
python3 tools/shots.py
```

## תוכן
- אין תוכן לדוגמה: אור מעלה את המאמרים והסיפורים בעצמו דרך Pages CMS (ראו `docs/HOW-TO-ADD-ARTICLE.md`).
- כשאוסף ריק, העמודים מציגים מצב ריק ("מאמרים יעלו בקרוב" / "סיפורים יעלו בקרוב"). התיקיות נשמרות עם `.gitkeep`.
- השדה `example` עדיין קיים בסכמה: אם מסמנים אותו, מופיעה תגית "תוכן לדוגמה" והעמוד מקבל noindex.

## פרטיות וביצועים
- הגופנים נטענים מהשרת של האתר (fontsource), בלי Google Fonts.
- אין עוגיות ואין סקריפטים של צד שלישי.
- JS רק בתפריט המובייל ובטפסים.
