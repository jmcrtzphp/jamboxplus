async function check() {
  const res = await fetch(`https://api.themoviedb.org/3/watch/providers/movie?api_key=4e44d9029b1270a757cddc766a1bcb63`);
  const data = await res.json();
  const prov = data.results.filter(p => p.provider_name.toLowerCase().includes('paramount'));
  console.log("Global Paramount Providers:", prov);
}
check();
