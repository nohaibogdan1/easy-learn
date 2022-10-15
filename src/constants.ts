/* eslint-disable */

enum LEVELS {
  HARD = 'hard',
  MEDIUM = 'good',
  EASY = 'easy'
}

const LABELS_SEPARATOR = ',';

const ROOT_NAME = 'easy-learn';

enum ICON_BUTTONS_CLASSES {
  BACK = 'back-btn',
  NEXT = 'next-nav-card-btn',
  CUSTOMIZE = 'customize-btn',
  PREV = 'prev-nav-card-btn',
  SELECT_ALL = 'select-all-btn',
  UNSELECT_ALL = 'unselect-all-btn',
  OK = 'ok-btn',
  EDIT = 'edit-btn',
  CANCEL = 'cancel-btn'
}

enum BUTTONS_TEXT {
  EASY = 'Easy',
  GOOD = 'Good',
  HARD = 'Hard',
  SHOW_ANSWER = 'Show answer',
  SELECT_ALL = 'Select all',
  UNSELECT_ALL = 'Unselect all',
  ADD_DECK = 'Add deck',
  ADD_CARD = 'Add card',
  ADD_COURSE = 'Add course',
  DELETE_COURSE = 'Delete course',
  DELETE_DECK = 'Delete deck',
  DELETE_SELECTED_DECKS = 'Delete selected decks',
  REMOVE_SELECTED_CARDS = 'Remove selected cards',
  PLAY = 'Play',
  PLAY_SELECTED = 'Play selected',
  EDIT_DESCRIPTION = 'Edit description',
  OK = 'Ok',
  CANCEL = 'Cancel',
  ADDING_DECK_OK = 'Ok',
  ADDING_DECK_CANCEL = 'Cancel',
  DESCRIPTION_EDITING_OK = 'Ok',
  DESCRIPTION_EDITING_CANCEL = 'Cancel',
  EXPORT = 'Export',
  CHANGE_LEVEL = 'Change level',
  CHANGE_ORDER = 'Change order',
  SEARCH = 'Search',
  OK_CONFIRMATION_FORM = 'Ok',
  CANCEL_CONFIRMATION_FORM = 'Cancel',
  DELETE_SELECTED_CARDS = 'Delete selected cards',
  ADD_TO_DECK = 'Add to deck',
  CLOSE = 'Close',
  NEXT = 'Next',
  PREV = 'Prev',
  CUSTOMIZE = 'Customize',
  END_TEST = 'End test'
}

enum FieldsForSorting {
  createdAt = 'createdAt'
}

enum OrderSettings {
  none = 'none',
  shuffleCards = 'shuffleCards',
  reverseOrder = 'reverseOrder'
}

export {
  LEVELS,
  ICON_BUTTONS_CLASSES,
  BUTTONS_TEXT,
  LABELS_SEPARATOR,
  ROOT_NAME,
  FieldsForSorting,
  OrderSettings
};
