/* eslint-disable */

import {
  CourseStored,
  CourseAdd,
  CourseWithDecks,
  DeckStored,
  CourseModification
} from './interfaces';
import { tables } from '../db/tables';
import { DbState } from '../stores/db-store/store';
import getAllGeneralData from './getAllGeneralData';
import insertGeneralData from './insertGeneralData';
import deleteGeneralEntry from './deleteGeneralEntry';

const getAllCoursesData = (state: DbState): Promise<CourseStored[]> => {
  return getAllGeneralData({
    state,
    table: tables.COURSES
  }) as Promise<CourseStored[]>;
};

const insertCourseData = async ({
  data,
  state
}: {
  data: CourseAdd;
  state: DbState;
}): Promise<number | null> => {
  if (!data.description.length) {
    return null;
  }

  return insertGeneralData({
    state,
    table: tables.COURSES,
    data: {
      description: data.description
    }
  });
};

const updateCourseData = ({
  data,
  state
}: {
  data: CourseModification;
  state: DbState;
}): Promise<void> => {
  const { db } = state;
  return new Promise((acc, reject) => {
    try {
      if (db) {
        const transaction = db.transaction(tables.COURSES, 'readwrite');
        const store = transaction.objectStore(tables.COURSES);
        const request = store.put(data);

        request.onerror = () => {
          console.log('Err in update');
          reject();
        };

        request.onsuccess = (event: any) => {
          console.log('Update on store : success', request.result);
          acc();
        };
      }
    } catch (err) {
      console.log('Err in update', err);
      reject();
    }
  });
};

const getCourseData = async ({
  id,
  includeDecks,
  state
}: {
  id: number;
  includeDecks?: boolean;
  state: DbState;
}): Promise<CourseWithDecks | null> => {
  const courses = (await getAllGeneralData({ table: tables.COURSES, state })) as CourseStored[];
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return null;
  }

  if (!includeDecks) {
    return course;
  }

  const decks = (await getAllGeneralData({ table: tables.DECKS, state })) as DeckStored[];
  const courseDecks = decks.filter((d) => d.courseId === id);

  return {
    ...course,
    decks: courseDecks
  };
};

const deleteCourseData = async ({ id, state }: { id: number; state: DbState }): Promise<void> => {
  return await deleteGeneralEntry({ id, table: tables.COURSES, state });
};

export { getAllCoursesData, insertCourseData, getCourseData, updateCourseData, deleteCourseData };
