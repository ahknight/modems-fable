// Development aid: search Wikimedia Commons and print each hit's licence metadata,
// straight from the API, so that nothing is used on a guess.
// Usage: node tools/commons.mjs "search words" [limit]
//        node tools/commons.mjs --title "File:Exact name.jpg"

const [first, second] = process.argv.slice(2);
const api = 'https://commons.wikimedia.org/w/api.php';
const headers = { 'User-Agent': 'modem-history-research/1.0 (static educational site build)' };
const strip = (html = '') => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function call(params) {
  const response = await fetch(`${api}?${new URLSearchParams({ format: 'json', origin: '*', ...params })}`, { headers });
  if (!response.ok) throw new Error(`Commons API ${response.status}`);
  return response.json();
}

let titles;
if (first === '--title') titles = [second];
else {
  const found = await call({ action: 'query', list: 'search', srnamespace: '6', srlimit: second || '8', srsearch: first });
  titles = found.query.search.map((hit) => hit.title);
}
for (let i = 0; i < titles.length; i += 20) {
  const info = await call({ action: 'query', prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '1600', titles: titles.slice(i, i + 20).join('|') });
  for (const page of Object.values(info.query.pages)) {
    const ii = page.imageinfo?.[0];
    if (!ii) continue;
    const m = ii.extmetadata;
    console.log(JSON.stringify({
      title: page.title,
      license: m.LicenseShortName?.value,
      licenseUrl: m.LicenseUrl?.value,
      artist: strip(m.Artist?.value),
      credit: strip(m.Credit?.value),
      date: strip(m.DateTimeOriginal?.value),
      size: `${ii.width}x${ii.height}`,
      mime: ii.mime,
      page: ii.descriptionurl,
      thumb: ii.thumburl,
      description: strip(m.ImageDescription?.value).slice(0, 160),
    }));
  }
}
