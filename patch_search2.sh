awk '
/app.get\("\/api\/search"/ { in_search = 1 }
/app.get\("\/api\/shows\/:id"/ { in_search = 0 }
in_search && /  \}\);/ { if (!deleted) { deleted = 1; next } }
{ print }
' server.ts > server.ts.tmp && mv server.ts.tmp server.ts
