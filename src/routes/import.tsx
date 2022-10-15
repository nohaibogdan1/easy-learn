/* eslint-disable */
import React, { ReactElement, useState } from 'react';
import lodashCamelCase from 'lodash/camelCase';

import { parseXLSToJson } from '../logic/import';
import './import.css';
import { ExcelRow } from '../data/interfaces';
import { useDbStore } from '../stores/db-store/store';
import { Obj } from '../types';
import { LEVELS } from '../constants';

const validateSpreadsheetColumns = (columns: string[]): string | undefined => {
  if (!columns.includes('question')) {
    return 'Column question is missing';
  }

  if (!columns.includes('answer')) {
    return 'Column answer is missing';
  }
};

const ImportPage = (): ReactElement => {
  const {
    getAllCards,
    insertCard,
    updateCard,
    insertCourse,
    insertDeck,
    getAllCourses,
    getAllDecks,
    insertCardDeck
  } = useDbStore();
  const [importFinished, setImportFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [readFinished, setReadFinished] = useState(false);
  const [rows, setRows] = useState<ExcelRow[]>([]);

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

            setReadFinished(true);
            setTotal(jsonSheet.length);

            if (error) {
              setError(error);
              return;
            }

            await processData(jsonSheet);
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

  const processData = async (jsonSheet: Obj[]) => {
    if (!jsonSheet.length) {
      return;
    }

    for (const unprocessedRow of jsonSheet) {
      const row: ExcelRow = {};

      Object.keys(unprocessedRow).map((key: string) => {
        const newKey = lodashCamelCase(key) as keyof ExcelRow;

        if (
          newKey === 'question' || 
          newKey === 'answer' ||  
          newKey === 'lastSawDate' ||  
          newKey === 'nextSeeDate' ||  
          newKey === 'courseDescription' ||  
          newKey === 'deckDescription'
        ) {
          row[newKey] = unprocessedRow[key] as string | undefined;
        }

        if (newKey === 'cardId') {
          row[newKey] = unprocessedRow[key] as number | undefined;
        }

        if (newKey === 'level') {
          row[newKey] = unprocessedRow[key] as LEVELS;
        }
      });
      /** we are going through each row from the spreadsheet */

      /** processing the card data */
      /** inserting or updating the card */

      const processCard = async (): Promise<number | null> => {
        let existentCardId: number | null = null;

        const existentCards = await getAllCards();

        const rowQuestion = row.question?.trim();
        const rowAnswer = row.answer?.trim();

        const cardMatch = existentCards.find(
          (c) =>
            (row.cardId !== undefined && row.cardId !== null && c.id === row.cardId) ||
            (c.question.trim() === rowQuestion && c.answer.trim() === rowAnswer)
        );

        if (cardMatch) {
          existentCardId = cardMatch.id;

          await updateCard({
            ...cardMatch,
            ...(rowQuestion && { question: rowQuestion }),
            ...(rowAnswer && { answer: rowAnswer }),
            ...(row.level && { level: row.level }),
            ...(row.lastSawDate && { lastSawDate: row.lastSawDate }),
            ...(row.nextSeeDate && { nextSeeDate: row.nextSeeDate }),
            ...(row.createdAt && { createdAt: row.createdAt })
          });
        } else {
          if (rowQuestion && rowAnswer) {
            existentCardId = await insertCard({
              question: rowQuestion,
              answer: rowAnswer,
              nextSeeDate: row.nextSeeDate,
              lastSawDate: row.lastSawDate,
              createdAt: row.createdAt || new Date().getTime().toString(),
              level: row.level
            });
          }
        }

        return existentCardId;
      };

      const processCourse = async (): Promise<number | null> => {
        /** insert course information */

        let existentCourseId: number | null = null;
        const rowCourseDescription = row.courseDescription?.trim();

        if (rowCourseDescription) {
          const existentCourses = await getAllCourses();
          const courseMatch = existentCourses.find(
            (c) => c.description.trim() === rowCourseDescription
          );

          if (courseMatch) {
            existentCourseId = courseMatch.id;
          } else {
            existentCourseId = await insertCourse({
              description: rowCourseDescription
            });
          }
        }

        return existentCourseId;
      };

      const processDeck = async (existentCourseId: number | null): Promise<number | null> => {
        /** insert deck information */

        let existentDeckId: number | null = null;
        const rowDeckDescription = row.deckDescription?.trim();

        if (rowDeckDescription && existentCourseId !== null) {
          const existentDecks = await getAllDecks();
          const deckMatch = existentDecks.find(
            (d) => d.description.trim() === rowDeckDescription && d.courseId === existentCourseId
          );

          if (deckMatch) {
            existentDeckId = deckMatch.id;
          } else {
            existentDeckId = await insertDeck({
              description: rowDeckDescription,
              courseId: existentCourseId
            });
          }
        }

        return existentDeckId;
      };

      const connectDeckAndCard = async ({ 
        existentCardId, 
        existentDeckId
      }: {
        existentCardId: number | null, 
        existentDeckId: number | null,
      }): Promise<void> => {
        if (existentDeckId !== null && existentCardId !== null) {
          await insertCardDeck({
            cardId: existentCardId,
            deckId: existentDeckId
          });
        }
      };

      const existentCardId = await processCard();
      const existentCourseId = await processCourse();
      const existentDeckId = await processDeck(existentCourseId);
      await connectDeckAndCard({ existentCardId, existentDeckId });
    }
  };

  return (
    <div>
      <div className="message">
        In order to import data use an excel file
      </div>
      <input className="picker" type="file" name="import" onChange={importData} />
      {readFinished && <div>{total} rows read</div>}
      {importFinished && <div className="success">Successful imported</div>}
      {error && <div className="error">Error: {error}</div>}
    </div>
  );
};

export default ImportPage;
