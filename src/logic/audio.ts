/* eslint-disable */

import { useEffect, useState } from "react";
import { useDbStore } from "../stores/db-store/store";

const useRecordAudio = () => {
  /** ----------------- CUSTOM HOOK CALLS -------------------- */

  const { 
    state: {db}, 
    saveAudio,
    getAudio,
  } = useDbStore();

  /** ----------------- USE STATE -------------------- */

  const [startRecord, setStartRecord] = useState<(() => void) | null>(null);
  const [stopRecord, setStopRecord] = useState<(() => void) | null>(null);
  const [playRecord, setPlayRecord] = useState<(() => void) | null>(null);
  const [saveRecord, setSaveRecord] = useState<(() => Promise<number>) | null>(null);
  const [canRecord, setCanRecord] = useState(false);
  const [canStopRecord, setCanStopRecord] = useState(false);
  const [canPlay, setCanPlay] = useState(false);

  /** ----------------- USE EFFECT -------------------- */
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({audio: true})
    .then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      let audioChunks: any[] = [];

      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        setCanPlay(true);
        setCanRecord(true);
      });

      const start = () => {
        audioChunks = [];
        mediaRecorder.start();
        setCanStopRecord(true);
      };

      const play = () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        

        console.log("audioUrl", audioUrl)
        console.log("audioBlob", audioBlob)
        console.log("audioChunks", audioChunks)


        const audio = new Audio(audioUrl);
        audio.play()
      }
      
      const stop = () => {
        mediaRecorder.stop();
        setCanStopRecord(false);
      };

      const save = async () => {
        const audioBlob = new Blob(audioChunks);
        const id = await saveAudio({blob: audioBlob});
        console.log("id", id)

        return id;
      };

      setStartRecord(() => start);
      setCanRecord(true);
      setStopRecord(() => stop);
      setPlayRecord(() => play);
      setSaveRecord(() => save);
    });
  }, []);

  /** ----------------- FUNCTIONS -------------------- */

  const listenRecording = async (recordingId: number): Promise<void> => {
    const data = await getAudio(recordingId);
    if (!data) {
      return;
    }

    const {blob} = data;
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.play()
  };

  return { 
    startRecord, 
    stopRecord, 
    playRecord,
    saveRecord,
    canPlay, 
    canRecord, 
    canStopRecord,
    listenRecording,    
  };
};

export default useRecordAudio;
