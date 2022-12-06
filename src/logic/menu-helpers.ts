/* eslint-disable */

import { BUTTONS_TEXT, ICON_BUTTONS_CLASSES } from '../constants';
import { TestCustomSettings } from '../data/interfaces';

interface CoursePageMenu {
  firstDesktopSubmenu: BUTTONS_TEXT[];
  secondDesktopSubmenu: BUTTONS_TEXT[];
  firstMobileSubmenu: BUTTONS_TEXT[];
  secondMobileSubmenu: BUTTONS_TEXT[];
  editMenu: BUTTONS_TEXT[];
  formMenu: BUTTONS_TEXT[];
}

interface HomePageMenu {
  firstDesktopSubmenu: BUTTONS_TEXT[];
  secondDesktopSubmenu: BUTTONS_TEXT[];
  firstMobileSubmenu: BUTTONS_TEXT[];
  secondMobileSubmenu: BUTTONS_TEXT[];
}

interface DeckPageMenu {
  firstDesktopSubmenu: BUTTONS_TEXT[];
  secondDesktopSubmenu: BUTTONS_TEXT[];
  firstMobileSubmenu: BUTTONS_TEXT[];
  secondMobileSubmenu: BUTTONS_TEXT[];
  editMenu: BUTTONS_TEXT[];
}

interface CardsPageMenu {
  firstDesktopSubmenu: BUTTONS_TEXT[];
  secondDesktopSubmenu: BUTTONS_TEXT[];
  firstMobileSubmenu: BUTTONS_TEXT[];
  secondMobileSubmenu: BUTTONS_TEXT[];
}

interface CardPageMenu {
  firstDesktopSubmenu: BUTTONS_TEXT[];
  secondDesktopSubmenu: BUTTONS_TEXT[];
  firstMobileSubmenu: BUTTONS_TEXT[];
  secondMobileSubmenu: BUTTONS_TEXT[];
}

interface TestPageMenu {
  desktopNavigationSubmenu: BUTTONS_TEXT[];
  desktopCardSubmenu: BUTTONS_TEXT[];
  secondDesktopSubmenu: BUTTONS_TEXT[];
  firstMobileSubmenu: BUTTONS_TEXT[];
  secondMobileSubmenu: BUTTONS_TEXT[];
}


const getMenuStateForCoursePage = ({
  addingItem,
  allSelected,
  selected,
  descriptionEditing,
  haveDecks,
  deletingSelectedDecks, 
  deletingCourse,
}: {
  addingItem: Boolean;
  allSelected: Boolean;
  selected: Boolean;
  descriptionEditing: Boolean;
  haveDecks: Boolean;
  deletingSelectedDecks: Boolean;
  deletingCourse: Boolean;
}): CoursePageMenu => {
  /** FIRST DESKTOP SUBMENU */
  let firstDesktopSubmenu: BUTTONS_TEXT[] = [];

  if (haveDecks) {
    firstDesktopSubmenu = [BUTTONS_TEXT.PLAY];
  }

  if (selected || allSelected) {
    firstDesktopSubmenu.push(BUTTONS_TEXT.PLAY_SELECTED);
  }

  /** SECOND DESKTOP SUBMENU */
  let secondDesktopSubmenu = [
    BUTTONS_TEXT.ADD_DECK,
    // BUTTONS_TEXT.EXPORT,
    BUTTONS_TEXT.DELETE_COURSE
  ];

  if (haveDecks) {
    if (!allSelected) {
      secondDesktopSubmenu.push(BUTTONS_TEXT.SELECT_ALL);
    } else {
      secondDesktopSubmenu.push(BUTTONS_TEXT.UNSELECT_ALL);
    }
  }

  if (selected || allSelected) {
    secondDesktopSubmenu.push(BUTTONS_TEXT.DELETE_SELECTED_DECKS);
  }

  /** EDIT MENU */
  let editMenu = [BUTTONS_TEXT.EDIT_DESCRIPTION];

  if (descriptionEditing) {
    editMenu = [BUTTONS_TEXT.OK, BUTTONS_TEXT.CANCEL];
  }

  /** FORM MENU */
  let formMenu: BUTTONS_TEXT[] = [];

  if (addingItem) {
    formMenu = [BUTTONS_TEXT.OK, BUTTONS_TEXT.CANCEL];
  }

  /** FIRST MOBILE SUBMENU */
  let firstMobileSubmenu: BUTTONS_TEXT[] = [];

  if (haveDecks) {
    firstMobileSubmenu = [BUTTONS_TEXT.PLAY];
  }

  if (selected || allSelected) {
    firstMobileSubmenu.push(BUTTONS_TEXT.PLAY_SELECTED);
  }

  if (descriptionEditing || addingItem || deletingCourse || deletingSelectedDecks) {
    firstMobileSubmenu = [BUTTONS_TEXT.OK, BUTTONS_TEXT.CANCEL];
  }

  /** SECOND MOBILE SUBMENU */
  let secondMobileSubmenu = [
    BUTTONS_TEXT.ADD_DECK,
    BUTTONS_TEXT.DELETE_COURSE,
    BUTTONS_TEXT.EDIT_DESCRIPTION
  ];

  if (haveDecks) {
    if (!allSelected) {
      secondMobileSubmenu.push(BUTTONS_TEXT.SELECT_ALL);
    } else {
      secondMobileSubmenu.push(BUTTONS_TEXT.UNSELECT_ALL);
    }
  }

  if (selected || allSelected) {
    secondMobileSubmenu.push(BUTTONS_TEXT.EXPORT, BUTTONS_TEXT.DELETE_SELECTED_DECKS);
  }

  if (descriptionEditing || addingItem || deletingCourse || deletingSelectedDecks) {
    secondMobileSubmenu = [];
  }

  return {
    firstDesktopSubmenu,
    secondDesktopSubmenu,
    firstMobileSubmenu,
    secondMobileSubmenu,
    editMenu,
    formMenu
  };
};

const getMenuStateForHomePage = ({
  addingCourse,
  allSelected,
  selected,
  haveCourses
}: {
  addingCourse: Boolean;
  allSelected: Boolean;
  selected: Boolean;
  haveCourses: Boolean;
}): HomePageMenu => {
  /** FIRST DESKTOP SUBMENU */
  let firstDesktopSubmenu: BUTTONS_TEXT[] = [];

  if (haveCourses) {
    firstDesktopSubmenu = [BUTTONS_TEXT.PLAY];
  }

  if (selected) {
    firstDesktopSubmenu.push(BUTTONS_TEXT.PLAY_SELECTED);
  }

  /** SECOND DESKTOP SUBMENU */
  let secondDesktopSubmenu = [BUTTONS_TEXT.EXPORT, BUTTONS_TEXT.ADD_COURSE];

  if (haveCourses) {
    if (!allSelected) {
      secondDesktopSubmenu.push(BUTTONS_TEXT.SELECT_ALL);
    } else {
      secondDesktopSubmenu.push(BUTTONS_TEXT.UNSELECT_ALL);
    }
  }

  /** FIRST MOBILE SUBMENU */
  let firstMobileSubmenu: BUTTONS_TEXT[] = [];

  if (haveCourses) {
    firstMobileSubmenu = [BUTTONS_TEXT.PLAY];
  }

  if (selected || allSelected) {
    firstMobileSubmenu.push(BUTTONS_TEXT.PLAY_SELECTED);
  }

  if (addingCourse) {
    firstMobileSubmenu = [BUTTONS_TEXT.OK, BUTTONS_TEXT.CANCEL];
  }

  /** SECOND MOBILE SUBMENU */
  let secondMobileSubmenu = [BUTTONS_TEXT.EXPORT, BUTTONS_TEXT.ADD_COURSE];

  if (haveCourses) {
    if (!allSelected) {
      secondMobileSubmenu.push(BUTTONS_TEXT.SELECT_ALL);
    } else {
      secondMobileSubmenu.push(BUTTONS_TEXT.UNSELECT_ALL);
    }
  }

  if (addingCourse) {
    secondMobileSubmenu = [];
  }

  return {
    firstDesktopSubmenu,
    secondDesktopSubmenu,
    firstMobileSubmenu,
    secondMobileSubmenu
  };
};

const getMenuStateForDeckPage = ({
  addingItem,
  allSelected,
  selected,
  descriptionEditing,
  haveCards,
  deletingDeck,
  removingSelectedCards,
  updatingConfidenceLevel,
}: {
  addingItem: Boolean;
  allSelected: Boolean;
  selected: Boolean;
  descriptionEditing: Boolean;
  haveCards: Boolean;
  deletingDeck: Boolean; 
  removingSelectedCards: Boolean;
  updatingConfidenceLevel: Boolean;
}): DeckPageMenu => {
  /** FIRST DESKTOP SUBMENU */
  let firstDesktopSubmenu: BUTTONS_TEXT[] = [];

  if (haveCards) {
    firstDesktopSubmenu = [BUTTONS_TEXT.PLAY];
  }

  /** SECOND DESKTOP SUBMENU */
  let secondDesktopSubmenu = [BUTTONS_TEXT.ADD_CARD, BUTTONS_TEXT.EXPORT, BUTTONS_TEXT.DELETE_DECK];

  if (haveCards) {
    if (!allSelected) {
      secondDesktopSubmenu.push(BUTTONS_TEXT.SELECT_ALL);
    } else {
      secondDesktopSubmenu.push(BUTTONS_TEXT.UNSELECT_ALL);
    }
  }

  if (selected || allSelected) {
    secondDesktopSubmenu.push(BUTTONS_TEXT.REMOVE_SELECTED_CARDS, BUTTONS_TEXT.UPDATE_CONFIDENCE_LEVEL);
  }

  if (selected && !allSelected) {
    secondDesktopSubmenu.push(BUTTONS_TEXT.REORDER);
  }

  /** EDIT MENU */
  let editMenu = [BUTTONS_TEXT.EDIT_DESCRIPTION];

  /** FIRST MOBILE SUBMENU */
  let firstMobileSubmenu: BUTTONS_TEXT[] = [];

  if (haveCards) {
    firstMobileSubmenu = [BUTTONS_TEXT.PLAY];
  }

  if (descriptionEditing || 
    addingItem || 
    removingSelectedCards || 
    deletingDeck || 
    updatingConfidenceLevel) {
      
    firstMobileSubmenu = [BUTTONS_TEXT.OK, BUTTONS_TEXT.CANCEL];
  }

  /** SECOND MOBILE SUBMENU */
  let secondMobileSubmenu = [
    // BUTTONS_TEXT.ADD_CARD,
    BUTTONS_TEXT.DELETE_DECK,
    BUTTONS_TEXT.EDIT_DESCRIPTION
  ];

  if (haveCards) {
    if (!allSelected) {
      secondMobileSubmenu.push(BUTTONS_TEXT.SELECT_ALL);
    } else {
      secondMobileSubmenu.push(BUTTONS_TEXT.UNSELECT_ALL);
    }
  }

  if (selected || allSelected) {
    secondMobileSubmenu.push(
      // BUTTONS_TEXT.EXPORT, 
      BUTTONS_TEXT.REMOVE_SELECTED_CARDS, 
      BUTTONS_TEXT.UPDATE_CONFIDENCE_LEVEL
    );
  }

  if (selected && !allSelected) {
    secondMobileSubmenu.push(BUTTONS_TEXT.REORDER);
  }

  if (descriptionEditing || addingItem || removingSelectedCards || deletingDeck) {
    secondMobileSubmenu = [];
  }

  return {
    firstDesktopSubmenu,
    secondDesktopSubmenu,
    firstMobileSubmenu,
    secondMobileSubmenu,
    editMenu
  };
};

const getMenuStateForCardsPage = ({
  allSelected,
  selected,
  deletingSelectedCards
}: {
  allSelected: Boolean;
  selected: Boolean;
  deletingSelectedCards: Boolean;
}): CardsPageMenu => {
  /** FIRST DESKTOP SUBMENU */
  let firstDesktopSubmenu: BUTTONS_TEXT[] = [BUTTONS_TEXT.PLAY];

  if (selected || allSelected) {
    firstDesktopSubmenu.push(BUTTONS_TEXT.PLAY_SELECTED);
  }

  /** SECOND DESKTOP SUBMENU */
  let secondDesktopSubmenu = [
    // BUTTONS_TEXT.ADD_CARD,
    // BUTTONS_TEXT.EXPORT
  ];

  if (selected || allSelected) {
    secondDesktopSubmenu.push(
      BUTTONS_TEXT.DELETE_SELECTED_CARDS, 
      BUTTONS_TEXT.ADD_TO_DECK,
      BUTTONS_TEXT.CREATE_REVERTED_CARD
    );
  }

  /** FIRST MOBILE SUBMENU */
  let firstMobileSubmenu: BUTTONS_TEXT[] = [BUTTONS_TEXT.PLAY];

  if (selected || allSelected) {
    firstMobileSubmenu.push(BUTTONS_TEXT.PLAY_SELECTED);
  }

  if (deletingSelectedCards) {
    firstMobileSubmenu = [BUTTONS_TEXT.OK, BUTTONS_TEXT.CANCEL];
  }

  /** SECOND MOBILE SUBMENU */
  let secondMobileSubmenu = [
    // BUTTONS_TEXT.ADD_CARD, BUTTONS_TEXT.EXPORT
  ];

  if (selected || allSelected) {
    secondMobileSubmenu.push( 
      BUTTONS_TEXT.DELETE_SELECTED_CARDS, 
      BUTTONS_TEXT.ADD_TO_DECK,
      BUTTONS_TEXT.CREATE_REVERTED_CARD
    );
  }

  if (deletingSelectedCards) {
    secondMobileSubmenu = [];
  }

  return {
    firstDesktopSubmenu,
    secondDesktopSubmenu,
    firstMobileSubmenu,
    secondMobileSubmenu
  };
};

const getMenuStateForCardPage = ({
  editing,
  hasRecording,
  canStopRecord,
  canPlay,
}: {
  editing: boolean;
  hasRecording: boolean;
  canStopRecord: boolean;
  canPlay: boolean;
}): CardPageMenu => {
  /** FIRST DESKTOP SUBMENU */
  let firstDesktopSubmenu: BUTTONS_TEXT[] = [
    BUTTONS_TEXT.RECORD,
  ];

  if (hasRecording) {
    firstDesktopSubmenu.push(BUTTONS_TEXT.LISTEN);
  }

  if (canStopRecord) {
    firstDesktopSubmenu = [BUTTONS_TEXT.STOP];
  }

  if (canPlay) {
    firstDesktopSubmenu = [
      BUTTONS_TEXT.LISTEN_NEW,
      BUTTONS_TEXT.SAVE,
      BUTTONS_TEXT.RECORD,
    ]
  }

  /** SECOND DESKTOP SUBMENU */
  let secondDesktopSubmenu: BUTTONS_TEXT[] = [];

  /** FIRST MOBILE SUBMENU */
  let firstMobileSubmenu: BUTTONS_TEXT[] = [
    BUTTONS_TEXT.RECORD,
    BUTTONS_TEXT.EDIT_QUESTION,
    BUTTONS_TEXT.EDIT_ANSWER,
  ];

  if (hasRecording) {
    firstMobileSubmenu.push(BUTTONS_TEXT.LISTEN);
  }

  if (canStopRecord) {
    firstMobileSubmenu = [BUTTONS_TEXT.STOP];
  }

  if (canPlay) {
    firstMobileSubmenu = [
      BUTTONS_TEXT.LISTEN_NEW,
      BUTTONS_TEXT.SAVE,
      BUTTONS_TEXT.RECORD,
      BUTTONS_TEXT.EDIT_QUESTION,
      BUTTONS_TEXT.EDIT_ANSWER,
    ]
  }

  if (editing) {
    firstMobileSubmenu = [BUTTONS_TEXT.OK, BUTTONS_TEXT.CANCEL];
  }

  /** SECOND MOBILE SUBMENU */
  let secondMobileSubmenu:BUTTONS_TEXT[] = [];

  return {
    firstDesktopSubmenu,
    secondDesktopSubmenu,
    firstMobileSubmenu,
    secondMobileSubmenu
  };
};

const getMenuStateForTestPage = ({
  isAnswerShown,
  endingTest,
  isCustomizeFormShown,
}: {
  isAnswerShown: Boolean;
  endingTest: Boolean;
  isCustomizeFormShown: Boolean;
}): TestPageMenu => {
  /** DESKTOP NAVIGATION SUBMENU */
  let desktopNavigationSubmenu: BUTTONS_TEXT[] = [BUTTONS_TEXT.PREV, BUTTONS_TEXT.NEXT];

  /** DESKTOP CARD SUBMENU */
  let desktopCardSubmenu: BUTTONS_TEXT[] = [BUTTONS_TEXT.SHOW_ANSWER];

  if (isAnswerShown) {
    desktopCardSubmenu = [BUTTONS_TEXT.EASY, BUTTONS_TEXT.GOOD, BUTTONS_TEXT.HARD];
  }

  /** SECOND DESKTOP SUBMENU */
  let secondDesktopSubmenu = [BUTTONS_TEXT.CUSTOMIZE, BUTTONS_TEXT.END_TEST];

  /** FIRST MOBILE SUBMENU */
  let firstMobileSubmenu: BUTTONS_TEXT[] = [];
 
  if (isAnswerShown) {
    firstMobileSubmenu.push(
      BUTTONS_TEXT.EASY,
      BUTTONS_TEXT.GOOD,
      BUTTONS_TEXT.HARD,
    );
  } else {
    firstMobileSubmenu.push(BUTTONS_TEXT.SHOW_ANSWER);
  }

  if (isCustomizeFormShown) {
    firstMobileSubmenu = [BUTTONS_TEXT.PLAY, BUTTONS_TEXT.CLOSE];
  }

  if (endingTest) {
    firstMobileSubmenu = [BUTTONS_TEXT.OK, BUTTONS_TEXT.CANCEL];
  }

  /** SECOND MOBILE SUBMENU */
  let secondMobileSubmenu = [BUTTONS_TEXT.CUSTOMIZE, BUTTONS_TEXT.END_TEST];

  if (endingTest || isCustomizeFormShown) {
    secondMobileSubmenu = [];
  }

  return {
    desktopNavigationSubmenu,
    desktopCardSubmenu,
    secondDesktopSubmenu,
    firstMobileSubmenu,
    secondMobileSubmenu
  };
};

const mapButtonsTextToHandlers = ({
  buttonTextHandlersMap,
  buttonsText
}: {
  buttonTextHandlersMap: { [key: string]: () => void };
  buttonsText: BUTTONS_TEXT[];
}): {
  text: BUTTONS_TEXT;
  onClick: () => void;
}[] => {
  return buttonsText.map((text) => ({ text, onClick: buttonTextHandlersMap[text] }));
};

const mapButtonsTextToIcons = (btnText: BUTTONS_TEXT): ICON_BUTTONS_CLASSES | null => {
  const buttonTextIconsMap: { [key: string]: ICON_BUTTONS_CLASSES } = {
    [BUTTONS_TEXT.EDIT_DESCRIPTION]: ICON_BUTTONS_CLASSES.EDIT,
    [BUTTONS_TEXT.OK]: ICON_BUTTONS_CLASSES.OK,
    [BUTTONS_TEXT.CANCEL]: ICON_BUTTONS_CLASSES.CANCEL
  };

  if (buttonTextIconsMap[btnText]) {
    return buttonTextIconsMap[btnText];
  } else {
    return null;
  }
};

export {
  getMenuStateForCoursePage,
  getMenuStateForHomePage,
  getMenuStateForDeckPage,
  getMenuStateForCardsPage,
  getMenuStateForCardPage,
  getMenuStateForTestPage,
  mapButtonsTextToHandlers,
  mapButtonsTextToIcons
};
