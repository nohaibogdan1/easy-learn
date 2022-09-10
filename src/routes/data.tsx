import React, { ReactElement, useState } from 'react';

import { parseXLSToJson } from '../logic/import';
import useSaveData from '../hooks/useSaveData';

const Data = (): ReactElement => {
  const [importFinished, setImportFinished] = useState(false);
  const { saveData } = useSaveData();

  const exportData = () => {};

  const importData = (event: any) => {
    const file = event.target.files[0];
    const fr = new FileReader();
    fr.readAsBinaryString(file);
    fr.onload = async (event) => {
      const text = event.target?.result;
      if (text) {
        // parse the text
        await saveData(parseXLSToJson(text));
      }
    };
  };

  return (
    <div>
      Import <input type="file" name="import" onChange={importData} />
      {importFinished && <div>Successful imported</div>}
      <button onClick={exportData}>Export</button>
    </div>
  );
};

export default Data;
