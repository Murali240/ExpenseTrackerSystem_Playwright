import fs from 'fs';
import path from 'path';
import { Paths } from '@constants/Paths';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import { ExcelOutputType } from '@enums/Enums';
import { Logger } from './logger';

/**
 * Data Reader Utility
 * Reads test data from JSON, CSV, and Excel files
 */
export class DataReader {
  /**
   * Read JSON file
   * @param filename - Name of the JSON file
   * @returns Parsed JSON data
   */
  static async readJson<T = any>(filename: string): Promise<T> {
    try {
      const filepath = path.join(Paths.JSON_FOLDER_PATH, filename);
      Logger.debug(`Reading JSON file: ${filepath}`);
      
      if (!fs.existsSync(filepath)) {
        throw new Error(`JSON file not found: ${filepath}`);
      }

      const fileContent = fs.readFileSync(filepath, 'utf-8');
      const data = JSON.parse(fileContent);
      
      Logger.success(`JSON file read successfully: ${filename}`);
      return data;
    } catch (error) {
      Logger.error(`Failed to read JSON file: ${filename}`, error);
      throw error;
    }
  }

  /**
   * Read CSV file
   * @param filename - Name of the CSV file
   * @returns Parsed CSV data as array of objects
   */
  static async readCsv<T = any>(filename: string): Promise<T[]> {
    try {
      const filepath = path.join(Paths.CSV_FOLDER_PATH, filename);
      Logger.debug(`Reading CSV file: ${filepath}`);
      
      if (!fs.existsSync(filepath)) {
        throw new Error(`CSV file not found: ${filepath}`);
      }

      const csvData = fs.readFileSync(filepath, 'utf-8');
      const data = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
        trim: true
      });
      
      Logger.success(`CSV file read successfully: ${filename} (${(data as T[]).length} records)`);
      return data as T[];
    } catch (error) {
      Logger.error(`Failed to read CSV file: ${filename}`, error);
      throw error;
    }
  }

  /**
   * Read Excel file
   * @param filename - Name of the Excel file
   * @param outputType - Output format (JSON or CSV)
   * @param sheetIndex - Sheet index to read (default: 0)
   * @returns Parsed Excel data
   */
  static async readExcel<T = any>(
    filename: string,
    outputType: ExcelOutputType = ExcelOutputType.JSON,
    sheetIndex: number = 0
  ): Promise<T[]> {
    try {
      const filepath = path.join(Paths.EXCEL_FOLDER_PATH, filename);
      Logger.debug(`Reading Excel file: ${filepath}`);
      
      if (!fs.existsSync(filepath)) {
        throw new Error(`Excel file not found: ${filepath}`);
      }

      const workbook = XLSX.readFile(filepath);
      
      if (sheetIndex >= workbook.SheetNames.length) {
        throw new Error(`Sheet index ${sheetIndex} out of range. File has ${workbook.SheetNames.length} sheets.`);
      }

      const sheetName = workbook.SheetNames[sheetIndex];
      const worksheet = workbook.Sheets[sheetName];

      let data: T[];

      switch (outputType) {
        case ExcelOutputType.CSV:
          const csvContent = XLSX.utils.sheet_to_csv(worksheet);
          data = parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
            bom: true,
            trim: true
          });
          break;

        case ExcelOutputType.JSON:
        default:
          data = XLSX.utils.sheet_to_json(worksheet);
          break;
      }

      Logger.success(`Excel file read successfully: ${filename} (${data.length} records from sheet: ${sheetName})`);
      return data;
    } catch (error) {
      Logger.error(`Failed to read Excel file: ${filename}`, error);
      throw error;
    }
  }

  /**
   * Read all sheets from Excel file
   * @param filename - Name of the Excel file
   * @returns Object with sheet names as keys and data as values
   */
  static async readExcelAllSheets(filename: string): Promise<{ [sheetName: string]: any[] }> {
    try {
      const filepath = path.join(Paths.EXCEL_FOLDER_PATH, filename);
      Logger.debug(`Reading all sheets from Excel file: ${filepath}`);
      
      if (!fs.existsSync(filepath)) {
        throw new Error(`Excel file not found: ${filepath}`);
      }

      const workbook = XLSX.readFile(filepath);
      const allData: { [sheetName: string]: any[] } = {};

      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        allData[sheetName] = XLSX.utils.sheet_to_json(worksheet);
      });

      Logger.success(`All sheets read from Excel file: ${filename} (${workbook.SheetNames.length} sheets)`);
      return allData;
    } catch (error) {
      Logger.error(`Failed to read Excel file: ${filename}`, error);
      throw error;
    }
  }
}
