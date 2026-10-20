# הקמת שרת הקהילה ב־Base44 (פורום + טופס סיפורים)

זה מה שצריך מאור, בערך 20–30 דקות. אני יכול להדריך תוך כדי.

1. ב־Base44 יוצרים **אפליקציה חדשה ונפרדת**, למשל `maaser-community`. היא לא האפליקציה של מעשר+, כדי שהנתונים לא יתערבבו.
2. **ישויות (Data):** יוצרים את `ForumTopic`, ‏`ForumReply` ו־`StorySubmission`, לפי `entities.json`. בכל אחת מגדירים הרשאות **בלי קריאה או כתיבה ציבורית**. רק ה־functions ניגשות לנתונים.
3. **Backend functions:**
   - מעתיקים את 5 הקבצים שב־`functions/`, ואת `shared/community.ts` ל־`base44/shared/`.
   - אם אין תמיכה בקבצים משותפים, מדביקים את התוכן של `community.ts` בראש כל function.
   - הקבצים הם `forumList`, ‏`forumGetTopic`, ‏`forumCreateTopic`, ‏`forumCreateReply`, ‏`submitStory`.
4. ב־`shared/community.ts` משנים 3 דברים:
   - `NOTIFY_EMAIL`: המייל שאליו יגיעו ההתראות.
   - `SALT`: מחרוזת אקראית כלשהי.
   - `ALLOWED_ORIGINS`: הכתובת הסופית של האתר.
5. **פרסום (Publish)** של האפליקציה. מעתיקים את הכתובת שלה, למשל `https://maaser-community.base44.app`.
6. באתר, ב־Pages CMS ← **הגדרות האתר וניסוחים** ← **כתובת שרת הקהילה**, מדביקים את הכתובת ושומרים. אפשר גם ישירות בקובץ `src/data/site.json` ← `community_api_base`.
7. בודקים: פותחים נושא באתר ← מגיע מייל ← ב־Base44 משנים את הסטטוס ל־`approved` ← הנושא מופיע.

**בדיקה מקומית בלי Base44:** מריצים `node tools/mock-community.mjs`, מגדירים `community_api_base` ל־`http://localhost:8787` ומריצים build. זה שרת דמה עם אותו API.

> לא בדקתי את ה־functions על Base44 אמיתי, כי אין לי גישה לחשבון של אור. הקוד נכתב לפי התיעוד הרשמי (createClientFromRequest, asServiceRole, entities.filter/create, Core.SendEmail), אבל ייתכן שיידרשו התאמות קטנות בהקמה. למשל אם Base44 מטפל ב־CORS בעצמו, או אם המיון לפי `created_date` נקרא אצלם אחרת.
