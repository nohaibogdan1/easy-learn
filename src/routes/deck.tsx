/* eslint-disable */
import React, { ReactElement } from 'react';

import './deck.css';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import ButtonsGroup from '../components/buttons/ButtonsGroup';
import ListItem from '../components/list/ListItem';
import List from '../components/list/List';
import MobileMenu from '../components/mobile-menu/MobileMenu';
import MobileMenuItem from '../components/mobile-menu/MobileMenuItem';
import MobileSubmenu from '../components/mobile-menu/MobileSubmenu';
import { BUTTONS_TEXT, ICON_BUTTONS_CLASSES } from '../constants';
import ReorderButton from '../components/buttons/ReorderButton';
import Search from '../components/Search';

const DeckPage = (): ReactElement => {
  return (
    <div className="page-wrapper deck-page-wrapper">
      <div className="top-section">
        <div className="deck-description">
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
            <SecondaryButton text={BUTTONS_TEXT.ADD_CARD} />
            <SecondaryButton text={BUTTONS_TEXT.SELECT_ALL} />
            <SecondaryButton text={BUTTONS_TEXT.UNSELECT_ALL} />
            <SecondaryButton text={BUTTONS_TEXT.DELETE_DECK} />
            <SecondaryButton text={BUTTONS_TEXT.REMOVE_SELECTED_CARDS} />
            <SecondaryButton text={BUTTONS_TEXT.CHANGE_LEVEL} />
            <SecondaryButton text={BUTTONS_TEXT.CHANGE_ORDER} />
            <SecondaryButton text={BUTTONS_TEXT.EXPORT} />
          </ButtonsGroup>
        </ButtonsGroup>
        <Search />
      </div>
      <div className="bottom-section">
        <h3 className="mobile-margin-exterior">Cards</h3>
        <List>
          <ReorderButton />
          <ListItem
            usesCheckbox
            showArrow
            text={`Mathematics + a long name for the course is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,`}
          />
          <ReorderButton />
          <ListItem
            text={`Mathematics + a long name for the course is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,`}
          />
          <ReorderButton />
          <ListItem
            text={`Mathematics + a long name for the course is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,`}
          />
          <ReorderButton />
          <ListItem
            text={`Mathematics + a long name for the course is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,`}
          />
          <ReorderButton />
          <ListItem
            text={`Mathematics + a long name for the course is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,`}
          />
          <ReorderButton />
          <ListItem
            text={`Mathematics + a long name for the course is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,`}
          />
          <ReorderButton />
        </List>
      </div>
      <MobileMenu>
        <MobileSubmenu className="space-evenly">
          <MobileMenuItem text={BUTTONS_TEXT.PLAY} />
          <MobileMenuItem text={BUTTONS_TEXT.PLAY_SELECTED} />
        </MobileSubmenu>
        <MobileSubmenu>
          <MobileMenuItem text={BUTTONS_TEXT.ADD_CARD} />
          <MobileMenuItem text={BUTTONS_TEXT.SEARCH} />
          <MobileMenuItem text={BUTTONS_TEXT.SELECT_ALL} />
          <MobileMenuItem text={BUTTONS_TEXT.UNSELECT_ALL} />
          <MobileMenuItem text={BUTTONS_TEXT.DELETE_DECK} />
          <MobileMenuItem text={BUTTONS_TEXT.REMOVE_SELECTED_CARDS} />
          <MobileMenuItem text={BUTTONS_TEXT.EDIT_DESCRIPTION} />
          <MobileMenuItem text={BUTTONS_TEXT.OK} />
          <MobileMenuItem text={BUTTONS_TEXT.CANCEL} />
          <MobileMenuItem text={BUTTONS_TEXT.CHANGE_LEVEL} />
          <MobileMenuItem text={BUTTONS_TEXT.CHANGE_ORDER} />
          <MobileMenuItem text={BUTTONS_TEXT.EXPORT} />
        </MobileSubmenu>
      </MobileMenu>
    </div>
  );
};

export default DeckPage;
