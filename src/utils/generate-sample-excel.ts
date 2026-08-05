import path from 'path';
import * as XLSX from 'xlsx';
import fs from 'fs';

function generate() {
  const rows = [
    ['username', 'password', 'role', 'expected'],
    ['admin', 'issi@1234', 'admin', 'success'],
    ['kmkrishna', 'Gangamma@33', 'ldap', 'success'],
    ['mhemanth', 'Bindu1986@', 'ldap', 'success'],
    ['spilli', '$!V@p@V!@2329', 'ldap', 'success'],
    ['dummyUsername', 'dummyPassword@123', 'unknown', 'failure'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  const outDir = path.resolve(__dirname, '../../testData/excel');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'data.xlsx');
  XLSX.writeFile(wb, outFile);
  console.log(`Wrote sample excel to ${outFile}`);
}

if (require.main === module) generate();
