/* eslint-disable */
import React, { ReactElement } from 'react';

import './PickDecksForm.css';
import { BUTTONS_TEXT } from '../../constants';
import PrimaryButton from '../buttons/PrimaryButton';
import { DeckStored, CourseStored } from '../../data/interfaces';
import List from '../list/List';
import ListItem from '../list/ListItem';

const PickDecksForm = ({
  error,
  onClose,
  decks,
  courses
}: {
  error: string | null;
  onClose: () => void;
  decks: DeckStored[];
  courses: CourseStored[];
}): ReactElement => {
  const onClickClose = () => {
    onClose();
  };

  return (
    <div className="pick-decks-form-wrapper">
      <div className="pick-decks-form">
        {Boolean(error) && <div>Error: {error}</div>}

        <List>
          {courses.map((c) => {
            const ownDecks = decks.filter((d) => d.courseId === c.id);

            return (
              <ListItem text={c.description} key={c.id} showExpand>
                <List>
                  {ownDecks.map((d) => {
                    return <ListItem text={d.description} key={d.id} />;
                  })}
                </List>
              </ListItem>
            );
          })}
        </List>

        <PrimaryButton onClick={onClickClose} text={BUTTONS_TEXT.CLOSE} />
      </div>
    </div>
  );
};

export default PickDecksForm;
