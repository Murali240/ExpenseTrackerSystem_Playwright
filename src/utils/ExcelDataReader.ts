import path from 'path';
import fs from 'fs';
import * as XLSX from 'xlsx';

export type TestRecord = {
  username: string;
  password: string;
  role?: string;
  expected?: 'success' | 'failure';
  [key: string]: any;
};

export class ExcelDataReader {
  constructor(private folder = path.resolve(__dirname, '../../testData/excel')) {}

  private resolveFilePath(fileName: string) {
    const candidates: string[] = [];

    // primary configured folder
    candidates.push(path.join(this.folder, fileName));

    // project-relative common locations
    candidates.push(path.resolve(process.cwd(), 'testData', 'excel', fileName));
    candidates.push(path.resolve(process.cwd(), 'testData', fileName));
    candidates.push(path.resolve(process.cwd(), fileName));

    // support fileName without extension variations
    if (!fileName.toLowerCase().endsWith('.xlsx')) {
      candidates.push(path.join(this.folder, `${fileName}.xlsx`));
      candidates.push(path.resolve(process.cwd(), 'testData', 'excel', `${fileName}.xlsx`));
    }

    for (const p of candidates) {
      try {
        if (fs.existsSync(p)) return p;
      } catch (e) {
        // continue
      }
    }

    throw new Error(
      `Excel file not found. Paths checked:\n${candidates.map((c) => ` - ${c}`).join('\n')}`
    );
  }

  read(fileName = 'data.xlsx'): TestRecord[] {
    const filePath = this.resolveFilePath(fileName);

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Read as arrays first to support files without header row
    let rows: any[];
    try {
      rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    } catch (err) {
      throw new Error(`Failed to parse Excel sheet: ${(err as Error).message}`);
    }

    if (!rows || rows.length === 0) throw new Error('Excel sheet is empty');

    const firstRow = rows[0];
    const headerRow = Array.isArray(firstRow)
      ? firstRow.map((h: any) => String(h ?? '').trim().toLowerCase())
      : [];
    const hasHeader = headerRow.length > 0 && headerRow.includes('username') && headerRow.includes('password');

    const records: TestRecord[] = [];
    if (hasHeader) {
      // convert using header names
      const json = XLSX.utils.sheet_to_json(sheet, { defval: '' }) as any[];
      json.forEach((row: any, idx: number) => {
        const rec: TestRecord = {
          username: String(row.username ?? row.Username ?? row.USERNAME ?? '').trim(),
          password: String(row.password ?? row.Password ?? row.PASSWORD ?? '').trim(),
          role: row.role ?? row.Role ?? row.ROLE,
          expected: row.expected ?? row.Expected ?? undefined,
        };
        records.push(this.normalize(rec, idx, json.length));
      });
    } else {
      // no header, treat rows as [username, password, role?, expected?]
      rows.forEach((r, idx) => {
        if (!r || r.length === 0) return;
        const rec: TestRecord = {
          username: String(r[0] ?? '').trim(),
          password: String(r[1] ?? '').trim(),
          role: r[2] ?? undefined,
          expected: r[3] ?? undefined,
        };
        records.push(this.normalize(rec, idx, rows.length));
      });
    }

    if (records.length === 0) throw new Error('No valid records found in Excel file');
    return records;
  }

  private normalize(rec: TestRecord, idx: number, total: number): TestRecord {
    // If expected is a string like 'success'/'failure' normalize it
    if (rec.expected) {
      const v = String(rec.expected).toLowerCase();
      rec.expected = v === 'failure' || v === 'false' ? 'failure' : 'success';
    } else {
      // infer: last row -> failure; first row -> admin success; rows 2..n-1 -> ldap success
      if (idx === total - 1) rec.expected = 'failure';
      else rec.expected = 'success';
    }

    if (!rec.role) {
      if (idx === 0) rec.role = 'admin';
      else if (idx > 0 && idx < total - 1) rec.role = 'ldap';
      else if (idx === total - 1) rec.role = 'admin';
      else rec.role = 'unknown';
    }

    return rec;
  }
}

export default ExcelDataReader;
