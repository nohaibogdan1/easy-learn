/* eslint-disable */
import React, { BaseSyntheticEvent, useState, useEffect } from 'react';
import * as xlsx from 'xlsx';
import { CourseStored, DeckStored } from '../data/interfaces';
import useTextSize from '../hooks/useTextSize';
import { useDbStore } from '../stores/db-store/store';

const SettingsPage = () => {
  const {
    textSize,
    textSizeClass,
    decreaseText,
    increaseText,
  } = useTextSize();

  const {
    state: { db },
    getAllCards,
    getAllDecks,
    getAllCourses,
    getAllCardsDecks
  } = useDbStore();

  const onClickDecreaseText = () => {
    decreaseText();
  }

  const onClickIncreaseText = () => {
    increaseText();
  }

  const onClickExport = async () => {
    const cards = await getAllCards();
    const decks = await getAllDecks();
    const courses = await getAllCourses();
    const cardsDecks = await getAllCardsDecks();

    const rows = [];

    for (const card of cards) {
      const matchCardsDecks = cardsDecks.filter((cd) => cd.cardId === card.id)
      const matchDeckIds = matchCardsDecks.map((cd) => cd.deckId);
      const matchDecks = decks.filter((d) => matchDeckIds.includes(d.id)) as DeckStored[];
      const matchDecksCoursesIds = matchDecks.map((d) => d.courseId);
      const matchCourses = courses.filter((c) => matchDecksCoursesIds.includes(c.id)) as CourseStored[];

      for (const deck of matchDecks) {
        const course = matchCourses.find((c: CourseStored) => c.id === deck.courseId);
        rows.push({
          question: card.question,
          answer: card.answer,
          level: card.level,
          "Next see date": card.nextSeeDate,
          "Last saw date": card.lastSawDate,
          "Deck description": deck.description,
          "Course description": course?.description,
        });
      }

      if (!matchDecks.length) {
        rows.push({
          question: card.question,
          answer: card.answer,
          level: card.level,
          "Next see date": card.nextSeeDate,
          "Last saw date": card.lastSawDate,
        });
      }
    }

    const excelWorkBook = xlsx.utils.book_new();
    const excelSheet = xlsx.utils.json_to_sheet(rows);
    xlsx.utils.book_append_sheet(excelWorkBook, excelSheet, "Learning data");
    xlsx.writeFile(excelWorkBook, "easy_learn_data.xlsx");
  };

  return (
    <div className={`page-wrapper ${textSizeClass} settings-page-wrapper`}>
      <h3>Change size of text</h3>
      <button onClick={onClickDecreaseText}>-</button>
      {textSize}
      <button onClick={onClickIncreaseText}>+</button>

      <h3>Export all data</h3>
      <button onClick={onClickExport}>Export</button>
    </div>
  );
};

export default SettingsPage;
