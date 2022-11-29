/* eslint-disable */

import { tables } from "../db/tables";
import { DbState } from "../stores/db-store/store";
import getAllGeneralData from "./getAllGeneralData";
import insertGeneralData from "./insertGeneralData";
import { Recording, RecordingStored } from "./interfaces";

const saveAudioData = async ({
  audioBlob,
  state,
}: {
  audioBlob: Recording,
  state: DbState,
}): Promise<number> => {

  console.log("saveAudioData")

  return insertGeneralData({
    state,
    data: audioBlob,
    table: tables.RECORDINGS,
  });
};

const getAudioData = async ({
  recordingId,
  state,
}: {
  recordingId: number,
  state: DbState,
}): Promise<RecordingStored | undefined> => {

  const recordings = await getAllGeneralData({
    state,
    table: tables.RECORDINGS,
  }) as RecordingStored[];

  return recordings.find((r) => r.id === recordingId);
}

export {
  saveAudioData,
  getAudioData,
};
