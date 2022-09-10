/* eslint-disable */
import React, { ReactElement, useState } from 'react';

import { parseXLSToJson } from '../logic/import';
import useSaveData from '../hooks/useSaveData';
import './data.css';

const validateSpreadsheetColumns = (columns: string[]): string | undefined => {
  if (!columns.includes('question')) {
    return 'Column question is missing';
  }

  if (!columns.includes('answer')) {
    return 'Column answer is missing';
  }
};

const Data = (): ReactElement => {
  const [importFinished, setImportFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { saveData } = useSaveData();

  const importData = (event: any) => {
    setError(null);

    try {
      const file = event.target.files[0];
      const fr = new FileReader();
      fr.readAsBinaryString(file);
      fr.onload = async (event) => {
        try {
          const text = event.target?.result;
          if (text) {
            // parse the text
            const jsonSheet = parseXLSToJson(text);
            if (!jsonSheet[0]) {
              setError('Excel file does not contain any information');
              return;
            }

            const row = jsonSheet[0];
            const columns = Object.keys(row);

            const error = validateSpreadsheetColumns(columns);

            if (error) {
              setError(error);
              return;
            }

            await saveData(jsonSheet);
            setImportFinished(true);
          }
        } catch (_) {
          setError('There was an error');
        }
      };
    } catch (_) {
      setError('There was an error');
    }
  };

  return (
    <div>
      <div className="message">
        In order to import data use an excel file that contains column names "question" and "answer"
        on first row. For column names ensure that there are no spaces and all letters are in lower
        case
      </div>
      <input className="picker" type="file" name="import" onChange={importData} />
      {importFinished && <div className="success">Successful imported</div>}
      {error && <div className="error">Error: {error}</div>}
    </div>
  );
};

export default Data;
