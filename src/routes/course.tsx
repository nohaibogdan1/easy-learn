/* eslint-disable */
import React, { ReactElement, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import './course.css';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import ButtonsGroup from '../components/buttons/ButtonsGroup';
import ListItem from '../components/list/ListItem';
import List from '../components/list/List';
import MobileMenu from '../components/mobile-menu/MobileMenu';
import MobileMenuItem from '../components/mobile-menu/MobileMenuItem';
import MobileSubmenu from '../components/mobile-menu/MobileSubmenu';
import { BUTTONS_TEXT, ROOT_NAME } from '../constants';
import { useDbStore } from '../stores/db-store/store';
import { DeckStored } from '../data/interfaces';
import {
  getMenuStateForCoursePage,
  mapButtonsTextToHandlers,
  mapButtonsTextToIcons
} from '../logic/menu-helpers';
import ConfirmationForm from '../components/forms/ConfirmationForm';

const CoursePage = (): ReactElement => {
  /** ----------------- CUSTOM HOOK CALLS -------------------- */
  const { id } = useParams();

  const {
    state: { db },
    getCourse,
    updateCourse,
    insertDeck,
    deleteDecks,
    deleteCourse
  } = useDbStore();

  const navigate = useNavigate();

  /** ----------------- USE STATE -------------------- */
  const [description, setDescription] = useState('');
  const [newDescription, setNewDescription] = useState(description);
  const [descriptionEditing, setDescriptionEditing] = useState(false);
  const [decks, setDecks] = useState<DeckStored[]>([]);
  const [selectedDecksId, setSelectedDecksId] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [addingDeck, setAddingDeck] = useState<Boolean>(false);
  const [deckDescription, setDeckDescription] = useState<string>('');
  const [deletingSelectedDecks, setDeletingSelectedDecks] = useState<Boolean>(false);
  const [deletingCourse, setDeletingCourse] = useState<Boolean>(false);
  const [showConfirmationForm, setShowConfirmationForm] = useState<Boolean>(false);
  const [confirmationFormError, setConfirmationFormError] = useState<string | null>(null);

  /** ----------------- USE EFFECT -------------------- */
  useEffect(() => {
    if (db) {
      (async () => {
        await getCourseData();
      })();
    }
  }, [Boolean(db)]);

  useEffect(() => {
    if (deletingSelectedDecks || descriptionEditing || deletingCourse || addingDeck) {
      setConfirmationFormError(null);
      setShowConfirmationForm(true);
    }
  }, [deletingSelectedDecks, descriptionEditing, deletingCourse, addingDeck]);

  useEffect(() => {
    if (!showConfirmationForm) {
      setDeletingSelectedDecks(false);
      setDescriptionEditing(false);
      setDeletingCourse(false);
      setAddingDeck(false);
    }
  }, [showConfirmationForm]);

  /** ----------------- DATA HANDLING FUNCTIONS -------------------- */
  const getCourseData = async () => {
    try {
      setError(null);

      if (!id) {
        return;
      }

      const parsedId = parseInt(id);

      if (isNaN(parsedId)) {
        return;
      }

      const course = await getCourse({
        id: parsedId,
        includeDecks: true
      });

      if (!course) {
        setError('Course not found');
        return;
      }

      setDescription(course.description);
      setNewDescription(course.description);
      setDecks(course.decks || []);
      setSelectedDecksId([]);
    } catch (err) {
      setError('Error happened when getting the course');
    }
  };

  const editDescripton = async (): Promise<{ error: null | string }> => {
    try {
      if (!Boolean(newDescription.trim())) {
        return { error: 'you did not enter description' };
      }

      if (!id) {
        return { error: null };
      }

      const parsedId = parseInt(id);

      if (isNaN(parsedId)) {
        return { error: null };
      }

      await updateCourse({ description: newDescription, id: parsedId });

      return { error: null };
    } catch (err) {
      return { error: 'Error on editing the description' };
    }
  };

  const deleteSelectedDecks = async (): Promise<{ error: null | string }> => {
    try {
      if (!selectedDecksId.length) {
        return { error: null };
      }

      await deleteDecks(selectedDecksId);

      return { error: null };
    } catch (err) {
      return { error: 'Error on deleting the selected decks' };
    }
  };

  const removeCourse = async (): Promise<{ error: null | string }> => {
    try {
      if (!id) {
        return { error: null };
      }

      const parsedId = parseInt(id);

      if (isNaN(parsedId)) {
        return { error: null };
      }

      await deleteCourse(parsedId);

      return { error: null };
    } catch (err) {
      return { error: 'Error on deleting the course' };
    }
  };

  const addDeck = async (): Promise<{ error: null | string }> => {
    try {
      if (!Boolean(deckDescription.trim())) {
        return { error: 'you did not enter description' };
      }

      if (!id) {
        return { error: null };
      }

      const parsedId = parseInt(id);

      if (isNaN(parsedId)) {
        return { error: null };
      }

      console.log('inser');

      await insertDeck({ description: deckDescription, courseId: parsedId });

      return { error: null };
    } catch (err) {
      return { error: 'Error on inserting the deck' };
    }
  };

  /** ----------------- FUNCTIONS -------------------- */

  const onRedirect = (id: number): void => {
    navigate(`/${ROOT_NAME}/decks/${id}`);
  };

  /** ----------------- EVENT HANDLERS -------------------- */
  const onExport = () => {};

  const onSelectAll = (): void => {
    setSelectedDecksId(() => decks.map((deck) => deck.id));
  };

  const onUnselectAll = (): void => {
    setSelectedDecksId(() => []);
  };

  const onCheckboxChange = ({ checked, id }: { checked: boolean; id: number }): void => {
    setSelectedDecksId((selectedDecksId) => {
      if (checked) {
        return [...selectedDecksId, id];
      }
      return [...selectedDecksId.filter((deckId) => deckId !== id)];
    });
  };

  const onAddDeck = async () => {
    setAddingDeck(true);
  };

  const onEditDescription = () => {
    setDescriptionEditing(true);
  };

  const onDeleteSelectedDecks = () => {
    setDeletingSelectedDecks(true);
  };

  const onDeleteCourse = () => {
    setDeletingCourse(true);
  };

  const onConfirmationFormOk = async () => {
    let error = null;

    if (deletingSelectedDecks) {
      const data = await deleteSelectedDecks();
      error = data.error;
    }

    if (deletingCourse) {
      const data = await removeCourse();
      error = data.error;
      if (!error) {
        navigate(`/${ROOT_NAME}/home`);
      }
    }

    if (descriptionEditing) {
      const data = await editDescripton();
      error = data.error;
    }

    if (addingDeck) {
      const data = await addDeck();
      error = data.error;
    }

    if (error) {
      setConfirmationFormError(error);
      return;
    }

    setShowConfirmationForm(false);

    getCourseData();
  };

  const onConfirmationFormCancel = () => {
    setShowConfirmationForm(false);
  };

  const onPlaySelected = () => {
    navigate(`/${ROOT_NAME}/test/`, { 
      state: { 
        decksIds: selectedDecksId,
      }
    });
  };

  const onPlay = () => {
    if (!id) {
      return;
    }

    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return;
    }

    navigate(`/${ROOT_NAME}/test/`, { 
      state: { 
        coursesIds: [parsedId],
      }
    });
  };

  /** ----------------- VARIABLES ------------------------------ */

  const buttonTextHandlersMap = {
    [BUTTONS_TEXT.PLAY]: onPlay,
    [BUTTONS_TEXT.PLAY_SELECTED]: onPlaySelected,
    [BUTTONS_TEXT.ADD_DECK]: onAddDeck,
    [BUTTONS_TEXT.SELECT_ALL]: onSelectAll,
    [BUTTONS_TEXT.UNSELECT_ALL]: onUnselectAll,
    [BUTTONS_TEXT.DELETE_COURSE]: onDeleteCourse,
    [BUTTONS_TEXT.DELETE_SELECTED_DECKS]: onDeleteSelectedDecks,
    [BUTTONS_TEXT.EDIT_DESCRIPTION]: onEditDescription,
    [BUTTONS_TEXT.EXPORT]: onExport,
    [BUTTONS_TEXT.OK_CONFIRMATION_FORM]: onConfirmationFormOk,
    [BUTTONS_TEXT.CANCEL_CONFIRMATION_FORM]: onConfirmationFormCancel
  };

  const {
    firstDesktopSubmenu,
    secondDesktopSubmenu,
    firstMobileSubmenu,
    secondMobileSubmenu,
    editMenu
  } = getMenuStateForCoursePage({
    addingItem: addingDeck,
    selected: Boolean(selectedDecksId.length),
    allSelected: Boolean(decks.length) && decks.every((deck) => selectedDecksId.includes(deck.id)),
    descriptionEditing,
    haveDecks: Boolean(decks.length),
    deletingSelectedDecks, 
    deletingCourse,
  });

  const firstDekstopSubmenuButtons = mapButtonsTextToHandlers({
    buttonTextHandlersMap,
    buttonsText: firstDesktopSubmenu
  });

  const secondDekstopSubmenuButtons = mapButtonsTextToHandlers({
    buttonTextHandlersMap,
    buttonsText: secondDesktopSubmenu
  });

  const firstMobileSubmenuButtons = mapButtonsTextToHandlers({
    buttonTextHandlersMap,
    buttonsText: firstMobileSubmenu
  });

  const secondMobileSubmenuButtons = mapButtonsTextToHandlers({
    buttonTextHandlersMap,
    buttonsText: secondMobileSubmenu
  });

  const editMenuButtons = mapButtonsTextToHandlers({
    buttonTextHandlersMap,
    buttonsText: editMenu
  });

  let confirmationFormData;
  let setConfirmationFormData;
  let message = "";

  if (addingDeck) {
    confirmationFormData = deckDescription;
    setConfirmationFormData = setDeckDescription;
    message = "Enter the name of the deck";
  }

  if (descriptionEditing) {
    confirmationFormData = newDescription;
    setConfirmationFormData = setNewDescription;
    message = "Edit the description";
  }

  if (deletingCourse) {
    message = "Are you sure you want to delete the course ?";
  }

  if (deletingSelectedDecks) {
    message = "Are you sure you want to delete the selected decks ?";
  }

  /** ----------------- RETURN --------------------------------- */
  return (
    <div className="page-wrapper course-page-wrapper">
      <div className="top-section">
        <div className="course-description">
          <div className="text">{description}</div>
          <ButtonsGroup className="margin-top-small">
            {editMenuButtons.map((btn, idx) => (
              <MobileMenuItem
                key={idx}
                onClick={btn.onClick}
                className={`icon-btn ${mapButtonsTextToIcons(btn.text)} || ''`}
              />
            ))}
          </ButtonsGroup>
        </div>
        <ButtonsGroup className={'direction-column margin-right-medium margin-top-medium'}>
          <ButtonsGroup>
            {firstDekstopSubmenuButtons.map((btn, idx) => {
              return <PrimaryButton key={idx} text={btn.text} onClick={btn.onClick} />;
            })}
          </ButtonsGroup>
          <ButtonsGroup className={'margin-top-medium wrap'}>
            {secondDekstopSubmenuButtons.map((btn, idx) => {
              return <SecondaryButton key={idx} text={btn.text} onClick={btn.onClick} />;
            })}
          </ButtonsGroup>
        </ButtonsGroup>
      </div>
      <div className="bottom-section">
        <h3 className="mobile-margin-exterior">Decks</h3>
        <List>
          {decks.map((deck) => {
            const checked = Boolean(selectedDecksId.find((deckId) => deckId === deck.id));

            return (
              <ListItem
                key={deck.id}
                showArrow
                text={deck.description}
                id={deck.id}
                usesCheckbox
                onCheckboxChange={onCheckboxChange}
                checked={checked}
                onRedirect={onRedirect}
              />
            );
          })}
        </List>
      </div>
      <MobileMenu>
        {Boolean(firstMobileSubmenuButtons.length) && (
          <MobileSubmenu className="space-evenly">
            {firstMobileSubmenuButtons.map((button, idx) => (
              <MobileMenuItem key={idx} text={button.text} onClick={button.onClick} />
            ))}
          </MobileSubmenu>
        )}
        {Boolean(secondMobileSubmenuButtons.length) && (
          <MobileSubmenu>
            {secondMobileSubmenuButtons.map((button, idx) => (
              <MobileMenuItem key={idx} text={button.text} onClick={button.onClick} />
            ))}
          </MobileSubmenu>
        )}
      </MobileMenu>

      {showConfirmationForm && (
        <ConfirmationForm
          onOk={onConfirmationFormOk}
          onCancel={onConfirmationFormCancel}
          error={confirmationFormError}
          data={confirmationFormData}
          setData={setConfirmationFormData}
          message={message}
        />
      )}
    </div>
  );
};

export default CoursePage;
