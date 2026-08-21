const fs = require('fs');

let server = fs.readFileSync('server.ts', 'utf-8');

// Replace the entire startServer function
const startServerMatch = server.match(/async function startServer\(\) \{[\s\S]*\}[\s\S]*startServer\(\);/);

const newStartServer = `async function startServer() {
  const PORT = 3000;
  
  let viteServer;
  if (process.env.NODE_ENV !== "production") {
    const vite = await import("vite");
    viteServer = await vite.createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
  }

  // Social Media Pre-rendering Interceptor
  app.get('*', async (req, res, next) => {
    // Only intercept paths that could be shared, ignore static assets
    if (!req.path.startsWith('/movie/') && !req.path.startsWith('/tv/') && req.path !== '/') {
      return next();
    }

    try {
      const isMovie = req.path.startsWith('/movie/');
      const isTv = req.path.startsWith('/tv/');
      
      let html = '';
      
      if (process.env.NODE_ENV !== "production") {
        const fsPath = path.resolve(process.cwd(), 'index.html');
        html = fs.readFileSync(fsPath, 'utf-8');
        html = await viteServer.transformIndexHtml(req.originalUrl, html);
      } else {
        const fsPath = path.resolve(process.cwd(), 'dist', 'index.html');
        html = fs.readFileSync(fsPath, 'utf-8');
      }

      let title = "JamBox+ | Watch Movies & TV Shows Streaming";
      let description = "Watch movies and TV shows on JamBox+. Discover your next favorite movie or series.";
      let image = "https://jamboxplusph.dpdns.org/preview.jpg";
      let url = "https://jamboxplusph.dpdns.org" + (req.path === '/' ? '' : req.path);

      if (isMovie || isTv) {
        const parts = req.path.split('/');
        const idStr = parts[parts.length - 1];
        if (idStr) {
           try {
             const type = isMovie ? 'movie' : 'tv';
             const cleanId = idStr.replace(/^(movie|series|tv)-/, '');
             const data = await fetchTmdb(\`/\${type}/\${cleanId}\`);
             if (data && (data.title || data.name)) {
               title = \`\${data.title || data.name} | JamBox+\`;
               description = (data.overview || description).substring(0, 200);
               const backdrop = data.backdrop_path || data.poster_path;
               if (backdrop) {
                 image = \`https://image.tmdb.org/t/p/w1280\${backdrop}\`;
               }
             }
           } catch(e) {
             console.error('Failed to fetch social metadata for', req.path, e.message);
           }
        }
      }

      const escapeAttr = (str) => String(str).replace(/"/g, '&quot;');
      
      html = html.replace(/<title>.*?<\\/title>/, \`<title>\${title}</title>\`);
      
      html = html.replace(/<meta\\s+property="og:title"\\s+content="[^"]*"\\s*\\/>/gi, \`<meta property="og:title" content="\${escapeAttr(title)}" />\`);
      html = html.replace(/<meta\\s+property="og:description"\\s+content="[^"]*"\\s*\\/>/gi, \`<meta property="og:description" content="\${escapeAttr(description)}" />\`);
      html = html.replace(/<meta\\s+property="og:image"\\s+content="[^"]*"\\s*\\/>/gi, \`<meta property="og:image" content="\${escapeAttr(image)}" />\`);
      html = html.replace(/<meta\\s+property="og:url"\\s+content="[^"]*"\\s*\\/>/gi, \`<meta property="og:url" content="\${escapeAttr(url)}" />\`);
      
      html = html.replace(/<meta\\s+name="twitter:title"\\s+content="[^"]*"\\s*\\/>/gi, \`<meta name="twitter:title" content="\${escapeAttr(title)}" />\`);
      html = html.replace(/<meta\\s+name="twitter:description"\\s+content="[^"]*"\\s*\\/>/gi, \`<meta name="twitter:description" content="\${escapeAttr(description)}" />\`);
      html = html.replace(/<meta\\s+name="twitter:image"\\s+content="[^"]*"\\s*\\/>/gi, \`<meta name="twitter:image" content="\${escapeAttr(image)}" />\`);
      
      html = html.replace(/<link\\s+rel="canonical"\\s+href="[^"]*"\\s*\\/>/gi, \`<link rel="canonical" href="\${escapeAttr(url)}" />\`);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      next(e);
    }
  });

  if (process.env.NODE_ENV !== "production") {
    app.use(viteServer.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      maxAge: '1y',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(\`Server running on http://0.0.0.0:\${PORT}\`);
  });
}

startServer();`;

server = server.replace(startServerMatch[0], newStartServer);

fs.writeFileSync('server.ts', server);
console.log('Fixed server.ts');
