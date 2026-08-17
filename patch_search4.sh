awk '
/app.get\("\/api\/movies"/ { if (!appended) { appended = 1; exit } }
{ print }
' server.ts > server.ts.tmp && mv server.ts.tmp server.ts
