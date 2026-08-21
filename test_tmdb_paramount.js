async function check() {
  const res = await fetch('http://localhost:3000/api/movies?catalogs=531&country=PH');
  const data = await res.json();
  console.log("PH Movies:", data?.shows?.length || 0);

  const res2 = await fetch('http://localhost:3000/api/movies?catalogs=531&country=US');
  const data2 = await res2.json();
  console.log("US Movies:", data2?.shows?.length || 0);
}
check();
