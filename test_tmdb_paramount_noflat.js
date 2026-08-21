async function check() {
  const params = new URLSearchParams({
    with_watch_providers: '531',
    watch_region: 'PH',
    sort_by: 'popularity.desc'
  });
  const res = await fetch(`http://localhost:3000/api/movies?catalogs=531&country=PH&show_type=series`);
  const data = await res.json();
  console.log("PH TV (current):", data?.shows?.length || 0);
}
check();
