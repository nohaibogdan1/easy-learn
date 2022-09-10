import * as xlsx from 'xlsx';

import { ExcelRow } from '../types';

const parseXLSToJson = (file: string | ArrayBuffer): ExcelRow[] => {
  const xlsxFile = xlsx.read(file, { type: 'binary' });
  const sheetName = xlsxFile.SheetNames[0];
  const sheet = xlsxFile.Sheets[sheetName];
  const jsonSheet = xlsx.utils.sheet_to_json(sheet);
  return jsonSheet as ExcelRow[];
};

export { parseXLSToJson };
