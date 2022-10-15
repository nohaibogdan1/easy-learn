/* eslint-disable */

import * as xlsx from 'xlsx';

import { ExcelRow } from '../data/interfaces';
import { Obj } from '../types';

const parseXLSToJson = (file: string | ArrayBuffer): Obj[] => {
  const xlsxFile = xlsx.read(file, { type: 'binary' });
  const sheetName = xlsxFile.SheetNames[0];
  const sheet = xlsxFile.Sheets[sheetName];
  const jsonSheet = xlsx.utils.sheet_to_json(sheet);
  return jsonSheet as Obj[];
};

export { parseXLSToJson };
