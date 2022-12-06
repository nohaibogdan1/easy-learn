/* eslint-disable */

import { tables } from '../db/tables';
import { DbState } from '../stores/db-store/store';
import insertGeneralData from './insertGeneralData';
import { AuditAdd } from './interfaces';

const insertChangeData = ({
  data,  
  state,
}: {
  data: AuditAdd,
  state: DbState,
}): void=> {

  insertGeneralData({
    state,
    table: tables.AUDIT,
    data,
  });
};

export {
  insertChangeData,
};
