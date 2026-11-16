// Build the local geographic catalog from the official published CSV; no hand-maintained lists.
const fs = require('fs');
const crypto = require('crypto');
const input = fs.readFileSync('data/ubigeos-inei.csv');
const rows = input.toString('utf8').replace(/^\uFEFF/, '').trim().split(/\r?\n/).slice(1).map(line => {
  const [code, department, province, district] = line.split(';').map(value => value.trim().replace(/^"|"$/g, ''));
  if (!/^\d{6}$/.test(code) || !department || !province || !district) throw Error('Invalid ubigeo row: ' + line);
  return { code, department, province, district };
});
const departments = new Map();
const limaDistricts = [];
for (const row of rows) {
  const departmentCode = row.code.slice(0, 2), provinceCode = row.code.slice(0, 4);
  if (!departments.has(departmentCode)) departments.set(departmentCode, { code: departmentCode, name: row.department, provinces: new Map() });
  const department = departments.get(departmentCode);
  if (!department.provinces.has(provinceCode)) department.provinces.set(provinceCode, { code: provinceCode, name: row.province, districts: [] });
  department.provinces.get(provinceCode).districts.push({ code: row.code, name: row.district });
  if (provinceCode === '1501') limaDistricts.push({ code: row.code, name: row.district });
}
const catalog = {
  source: {
    publisher: 'Ministerio de Salud / Plataforma Nacional de Datos Abiertos; codigos oficiales INEI',
    resourcePage: 'https://www.datosabiertos.gob.pe/dataset/datos-de-registros-de-nacidos-vivos/resource/573f433b-0d44-46e2-932e-14abb9757860',
    download: 'https://www.datosabiertos.gob.pe/sites/default/files/Lista_Ubigeos_INEI.csv',
    retrieved: '2026-11-15',
    sha256: crypto.createHash('sha256').update(input).digest('hex')
  },
  departments: [...departments.values()].sort((a,b)=>a.code.localeCompare(b.code)).map(d=>({...d,provinces:[...d.provinces.values()].sort((a,b)=>a.code.localeCompare(b.code))})),
  limaDistricts: [...new Map(limaDistricts.map(d=>[d.code,d])).values()].sort((a,b)=>a.code.localeCompare(b.code))
};
if (catalog.departments.length !== 25 || catalog.departments.reduce((n,d)=>n+d.provinces.length,0)!==196 || catalog.limaDistricts.length!==43 || catalog.limaDistricts.some(d=>!d.code.startsWith('1501'))) throw Error('Incomplete catalog');
fs.writeFileSync('js/ubigeos-inei.js', '// Local extract of the official INEI geographic catalog. Regenerate with node scripts/build-ubigeos.cjs.\nwindow.ERECMAN_UBIGEO = '+JSON.stringify(catalog)+';\n');
console.log(JSON.stringify({rows:rows.length,departments:catalog.departments.length,provinces:catalog.departments.reduce((n,d)=>n+d.provinces.length,0),limaDistricts:catalog.limaDistricts.length,sha256:catalog.source.sha256}));
