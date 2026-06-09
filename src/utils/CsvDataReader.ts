import path from 'path';
import fs from 'fs';
import { TestRecord } from './ExcelDataReader';

export class CsvDataReader {
  constructor(private folder = path.resolve(__dirname, '../../testData/csv')) {}

  read(fileName = 'data.csv'): TestRecord[] {
    const filePath = path.join(this.folder, fileName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`CSV file not found: ${filePath}`);
    }

    const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length === 0) throw new Error('CSV file is empty');

    // parse header if present
    const headerParts = this.parseCsvLine(lines[0]);
    const hasHeader = headerParts.length >= 2 && this.isHeaderRow(headerParts);

    const records: TestRecord[] = [];
    if (hasHeader) {
      const headers = headerParts.map((h) => h.trim().toLowerCase());
      for (let i = 1; i < lines.length; i++) {
        const parts = this.parseCsvLine(lines[i]);
        const row: any = {};
        for (let j = 0; j < headers.length; j++) {
          row[headers[j]] = parts[j] ?? '';
        }
        const rec = this.buildRecordFromRow(row, i - 1, lines.length - 1);
        records.push(rec);
      }
    } else {
      // no header - assume columns: username,password,role?,expected?
      for (let i = 0; i < lines.length; i++) {
        const parts = this.parseCsvLine(lines[i]);
        const rec = this.buildRecordFromRow({ username: parts[0], password: parts[1], role: parts[2], expected: parts[3] }, i, lines.length);
        records.push(rec);
      }
    }

    if (records.length === 0) throw new Error('No valid records found in CSV file');
    return records;
  }

  private buildRecordFromRow(row: any, idx: number, total: number) {
    const rec: TestRecord = {
      username: String(row.username ?? '').trim(),
      password: String(row.password ?? '').trim(),
      role: row.role ?? undefined,
      expected: row.expected ?? undefined,
    };

    // infer expected and role similar to ExcelDataReader
    if (rec.expected) {
      const v = String(rec.expected).toLowerCase();
      rec.expected = v === 'failure' || v === 'false' ? 'failure' : 'success';
    } else {
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

  // Very small CSV line parser that handles quoted values
  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        result.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    result.push(cur);
    return result;
  }

  private isHeaderRow(parts: string[]) {
    const lower = parts.map((p) => String(p).toLowerCase());
    return lower.includes('username') && lower.includes('password');
  }
}

export default CsvDataReader;
