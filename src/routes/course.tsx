/* eslint-disable */
import React, { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import './course.css';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import ButtonsGroup from '../components/buttons/ButtonsGroup';
import ListItem from '../components/list/ListItem';
import List from '../components/list/List';
import MobileMenu from '../components/mobile-menu/MobileMenu';
import MobileMenuItem from '../components/mobile-menu/MobileMenuItem';
import MobileSubmenu from '../components/mobile-menu/MobileSubmenu';
import { BUTTONS_TEXT, ICON_BUTTONS_CLASSES } from '../constants';
import { useDbStore } from '../stores/db-store/store';

const CoursePage = (): ReactElement => {
  /** ----------------- CUSTOM HOOK CALLS -------------------- */
  const { id } = useParams();
  const {
    state: { db }
  } = useDbStore();

  /** ----------------- USE STATE -------------------- */
  const [description, setDescription] = useState('');
  const [descriptionEditing, setDescriptionEditing] = useState(false);
  const [decks, setDecks] = useState([]);

  /** ----------------- USE EFFECT -------------------- */
  useEffect(() => {
    if (db) {
      (async () => {
        await getCourseData();
      })();
    }
  }, [Boolean(db)]);

  /** ----------------- DATA HANDLING FUNCTIONS -------------------- */
  const getCourseData = async () => {};

  /** ----------------- BUTTON CLICK HANDLERS -------------------- */
  const onPlay = () => {};
  const onPlaySelected = () => {};
  const onAddDeck = () => {};
  const onSelectAll = () => {};
  const onUnselectAll = () => {};
  const onDeleteCourse = () => {};
  const onDeleteSelectedDecks = () => {};
  const onEditDescription = () => {};
  const onOk = () => {};
  const onCancel = () => {};

  return (
    <div className="page-wrapper course-page-wrapper">
      <div className="top-section">
        <div className="course-description">
          <div className="text">
            Mathematics + a long name for the course is simply dummy text of the printing and
            typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since
            the 1500s,
          </div>
          <ButtonsGroup className="margin-top-small">
            <MobileMenuItem className={`icon-btn ${ICON_BUTTONS_CLASSES.EDIT}`} />
            {/* <MobileMenuItem className={`icon-btn ${ICON_BUTTONS_CLASSES.OK}`}/>
            <MobileMenuItem className={`icon-btn ${ICON_BUTTONS_CLASSES.CANCEL}`}/> */}
          </ButtonsGroup>
        </div>
        <ButtonsGroup className={'direction-column margin-right-medium margin-top-medium'}>
          <ButtonsGroup>
            <PrimaryButton text={BUTTONS_TEXT.PLAY} />
            <PrimaryButton text={BUTTONS_TEXT.PLAY_SELECTED} />
          </ButtonsGroup>
          <ButtonsGroup className={'margin-top-medium wrap'}>
            <SecondaryButton text={BUTTONS_TEXT.ADD_DECK} />
            <SecondaryButton text={BUTTONS_TEXT.SELECT_ALL} />
            <SecondaryButton text={BUTTONS_TEXT.UNSELECT_ALL} />
            <SecondaryButton text={BUTTONS_TEXT.DELETE_COURSE} />
            <SecondaryButton text={BUTTONS_TEXT.DELETE_SELECTED_DECKS} />
          </ButtonsGroup>
        </ButtonsGroup>
      </div>
      <div className="bottom-section">
        <h3 className="mobile-margin-exterior">Decks</h3>
        <List>
          <ListItem
            usesCheckbox
            showArrow
            text={`Mathematics + a long name for the course is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,`}
          />
          <ListItem
            text={`Mathematics + a long name for the course is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,`}
          />
          <ListItem
            text={`Mathematics + a long name for the course is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,`}
          />
          <ListItem
            text={`Mathematics + a long name for the course is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,`}
          />
          <ListItem
            text={`Mathematics + a long name for the course is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,`}
          />
          <ListItem
            text={`Mathematics + a long name for the course is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,`}
          />
        </List>
      </div>
      <MobileMenu>
        <MobileSubmenu className="space-evenly">
          <MobileMenuItem text={BUTTONS_TEXT.PLAY} />
          <MobileMenuItem text={BUTTONS_TEXT.PLAY_SELECTED} />
        </MobileSubmenu>
        <MobileSubmenu>
          <MobileMenuItem text={BUTTONS_TEXT.ADD_DECK} />
          <MobileMenuItem text={BUTTONS_TEXT.SELECT_ALL} />
          <MobileMenuItem text={BUTTONS_TEXT.UNSELECT_ALL} />
          <MobileMenuItem text={BUTTONS_TEXT.DELETE_COURSE} />
          <MobileMenuItem text={BUTTONS_TEXT.DELETE_SELECTED_DECKS} />
          <MobileMenuItem text={BUTTONS_TEXT.EDIT_DESCRIPTION} />
          <MobileMenuItem text={BUTTONS_TEXT.OK} />
          <MobileMenuItem text={BUTTONS_TEXT.CANCEL} />
        </MobileSubmenu>
      </MobileMenu>
    </div>
  );
};

export default CoursePage;
