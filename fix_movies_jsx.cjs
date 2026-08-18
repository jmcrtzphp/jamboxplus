const fs = require('fs');
let content = fs.readFileSync('src/components/Movies.tsx', 'utf8');

// Fix 1: dangling /> )}
content = content.replace(/ \/>\n\s+\)}\n\s+<\/div>/, '\n    </div>');

// Fix 2: dangling fetchShowDetails logic
content = content.replace(/fetchShowDetails\(id, country\)\n\s+\.then\(\(res\) => \{\n\s+if \(isMounted\) \{\n\s+setShow\(res\);\n\s+setLoading\(false\);\n\s+\n\s+\}\)\n\s+\.catch/g, 'fetchShowDetails(id, country)\n        .then((res) => {\n          if (isMounted) {\n            setShow(res);\n            setLoading(false);\n          }\n        })\n        .catch');

// There's an extra `}` at line 258. Let's fix the entire FavoriteItem useEffect.
let fixedEffect = `useEffect(() => {
    let isMounted = true;
    fetchShowDetails(id, country)
      .then((res) => {
        if (isMounted) {
          setShow(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [id, country]);`;

content = content.replace(/useEffect\(\(\) => \{\n\s+let isMounted = true;[\s\S]*?\}, \[id, country\]\);/, fixedEffect);

fs.writeFileSync('src/components/Movies.tsx', content);
console.log("Fixed JSX syntax");
