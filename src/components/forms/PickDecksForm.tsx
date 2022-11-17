/* eslint-disable */
import React, { ReactElement, useEffect, useState } from 'react';

import './PickDecksForm.css';
import { BUTTONS_TEXT } from '../../constants';
import PrimaryButton from '../buttons/PrimaryButton';
import { DeckStored, CourseStored } from '../../data/interfaces';

type Expanded = {
  expanded: boolean,
  courseId: number,
};

const PickDecksForm = ({
  error,
  onClose,
  decks,
  courses,
  onSelectDeck,
}: {
  error: string | null;
  onClose: () => void;
  decks: DeckStored[];
  courses: CourseStored[];
  onSelectDeck: (deckId: number) => void;
}): ReactElement => {

  const [expandedList, setExpandedList] = useState<Expanded[]>([]);
  
  useEffect(() => {
    setExpandedList(() => {
      return courses.map((c) => ({
        courseId: c.id,
        expanded: false,
      }));
    });
  }, []);

  const onClickClose = () => {
    onClose();
  };

  const setOnToggleExpandFunction = (courseId: number) => () => {
    setExpandedList((expandedList) => expandedList.map((i) => {
      if (i.courseId === courseId) {
        return {
          ...i,
          expanded: !i.expanded,
        };
      }

      return { ...i };
    }))
  };

  const setOnDeckClickFunction = (deckId: number) => () => {
    onSelectDeck(deckId);
  };

  return (
    <div className="pick-decks-form-wrapper">
      <div className="pick-decks-form">
        {Boolean(error) && <div>Error: {error}</div>}

        {courses.map((c) => {
          const ownDecks = decks.filter((d) => d.courseId === c.id);
          const expanded = expandedList.find((i) => i.courseId === c.id)?.expanded;

          return (
            <>
              <div 
                className={`course-description ${expanded ? "expanded" : ""}`} 
                onClick={setOnToggleExpandFunction(c.id)}>
                  {c.description}
              </div>

              {expanded && (
                <ul>
                  {ownDecks.map((d) => {
                    return (
                      <div onClick={setOnDeckClickFunction(d.id)}>{d.description}</div>
                    )
                  })}
                </ul>
              )}
            </> 
          );
        })}

        <PrimaryButton onClick={onClickClose} text={BUTTONS_TEXT.CLOSE} />
      </div>
    </div>
  );
};

export default PickDecksForm;
