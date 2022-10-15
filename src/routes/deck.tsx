/* eslint-disable */
import React, { ReactElement, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import './deck.css';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import ButtonsGroup from '../components/buttons/ButtonsGroup';
import ListItem from '../components/list/ListItem';
import List from '../components/list/List';
import MobileMenu from '../components/mobile-menu/MobileMenu';
import MobileMenuItem from '../components/mobile-menu/MobileMenuItem';
import MobileSubmenu from '../components/mobile-menu/MobileSubmenu';
import { BUTTONS_TEXT, ICON_BUTTONS_CLASSES, LEVELS, ROOT_NAME } from '../constants';
import ReorderButton from '../components/buttons/ReorderButton';
import Search from '../components/Search';
import { useDbStore } from '../stores/db-store/store';
import { CardAndDeckStored, CardStored } from '../data/interfaces';
import {
  getMenuStateForDeckPage,
  mapButtonsTextToHandlers,
  mapButtonsTextToIcons
} from '../logic/menu-helpers';
import ConfirmationForm from '../components/forms/ConfirmationForm';

const DeckPage = (): ReactElement => {
  /** ----------------- CUSTOM HOOK CALLS -------------------- */
  const { id } = useParams();

  const {
    state: { db },
    getDeck,
    updateDeck,
    removeCardsFromDeck,
    deleteDeck,
    getDeckFilteredCards
  } = useDbStore();

  const navigate = useNavigate();

  /** ----------------- USE STATE -------------------- */
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState<number | null>(null);
  const [newDescription, setNewDescription] = useState(description);
  const [descriptionEditing, setDescriptionEditing] = useState(false);
  const [cards, setCards] = useState<CardAndDeckStored[]>([]);
  const [selectedCardsId, setSelectedCardsId] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [addingCard, setAddingCard] = useState<Boolean>(false);
  const [removingSelectedCards, setRemovingSelectedCards] = useState<Boolean>(false);
  const [deletingDeck, setDeletingDeck] = useState<Boolean>(false);
  const [showConfirmationForm, setShowConfirmationForm] = useState<Boolean>(false);
  const [confirmationFormError, setConfirmationFormError] = useState<string | null>(null);

  /** ----------------- USE EFFECT -------------------- */
  useEffect(() => {
    if (db) {
      (async () => {
        await getDeckData();
      })();
    }
  }, [Boolean(db)]);

  useEffect(() => {
    if (descriptionEditing || removingSelectedCards || deletingDeck) {
      setConfirmationFormError(null);
      setShowConfirmationForm(true);
    }
  }, [descriptionEditing, removingSelectedCards, deletingDeck]);

  useEffect(() => {
    if (!showConfirmationForm) {
      setDescriptionEditing(false);
      setRemovingSelectedCards(false);
      setDeletingDeck(false);
    }
  }, [showConfirmationForm]);

  /** ----------------- DATA HANDLING FUNCTIONS -------------------- */
  const getDeckData = async () => {
    try {
      setError(null);

      if (!id) {
        return;
      }

      const parsedId = parseInt(id);

      if (isNaN(parsedId)) {
        return;
      }

      const deck = await getDeck({
        id: parsedId,
        includeCards: true
      });

      if (!deck) {
        setError('Deck not found');
        return;
      }

      setDescription(deck.description);
      setNewDescription(deck.description);
      setCards(deck.cards || []);
      setSelectedCardsId([]);
      setCourseId(deck.courseId);
    } catch (err) {
      setError('Error happened when getting the deck');
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

      await updateDeck({ description: newDescription, id: parsedId });

      return { error: null };
    } catch (err) {
      return { error: 'Error on editing the description' };
    }
  };

  const removeSelectedCards = async (): Promise<{ error: null | string }> => {
    try {
      if (!selectedCardsId.length) {
        return { error: null };
      }

      if (!id) {
        return { error: null };
      }

      const parsedId = parseInt(id);

      if (isNaN(parsedId)) {
        return { error: null };
      }

      await removeCardsFromDeck({ cardsIds: selectedCardsId, deckId: parsedId });

      return { error: null };
    } catch (err) {
      return { error: 'Error on deleting the selected decks' };
    }
  };

  const removeDeck = async (): Promise<{ error: null | string }> => {
    try {
      if (!id) {
        return { error: null };
      }

      const parsedId = parseInt(id);

      if (isNaN(parsedId)) {
        return { error: null };
      }

      await deleteDeck(parsedId);

      return { error: null };
    } catch (err) {
      return { error: 'Error on deleting the deck' };
    }
  };

  const setSearchInput = async (searchText: string) => {
    if (!id) {
      return;
    }

    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return;
    }

    const cards = await getDeckFilteredCards({ deckId: parsedId, text: searchText });

    setCards(cards);
  };

  /** ----------------- FUNCTIONS -------------------- */

  const onRedirect = (id: number): void => {
    navigate(`/${ROOT_NAME}/card/${id}`);
  };

  /** ----------------- EVENT HANDLERS -------------------- */
  const onExport = () => {};

  const onSelectAll = (): void => {
    setSelectedCardsId(() => cards.map((card) => card.id));
  };

  const onUnselectAll = (): void => {
    setSelectedCardsId(() => []);
  };

  const onCheckboxChange = ({ checked, id }: { checked: boolean; id: number }): void => {
    setSelectedCardsId((selectedCardsId) => {
      if (checked) {
        return [...selectedCardsId, id];
      }
      return [...selectedCardsId.filter((cardId) => cardId !== id)];
    });
  };

  const onAddCard = async () => {
    navigate(`/${ROOT_NAME}/add-card`, { state: { deckId: id } });
  };

  const onEditDescription = () => {
    setDescriptionEditing(true);
  };

  const onRemoveSelectedCards = () => {
    setRemovingSelectedCards(true);
  };

  const onDeleteDeck = () => {
    setDeletingDeck(true);
  };

  const onConfirmationFormOk = async () => {
    let error = null;

    if (removingSelectedCards) {
      const data = await removeSelectedCards();
      error = data.error;
    }

    if (deletingDeck) {
      const data = await removeDeck();
      error = data.error;
      if (!error) {
        navigate(`/${ROOT_NAME}/courses/${courseId}`);
      }
    }

    if (descriptionEditing) {
      const data = await editDescripton();
      error = data.error;
    }

    if (error) {
      setConfirmationFormError(error);
      return;
    }

    setShowConfirmationForm(false);

    getDeckData();
  };

  const onConfirmationFormCancel = () => {
    setShowConfirmationForm(false);
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
        decksIds: [parsedId],
      }
    });
  };

  const onPlaySelected = () => {
    navigate(`/${ROOT_NAME}/test/`, { 
      state: { 
        cardsIds: selectedCardsId,
      }
    });
  };

  /** ----------------- VARIABLES ------------------------------ */

  const buttonTextHandlersMap = {
    [BUTTONS_TEXT.PLAY]: onPlay,
    [BUTTONS_TEXT.PLAY_SELECTED]: onPlaySelected,
    [BUTTONS_TEXT.ADD_CARD]: onAddCard,
    [BUTTONS_TEXT.SELECT_ALL]: onSelectAll,
    [BUTTONS_TEXT.UNSELECT_ALL]: onUnselectAll,
    [BUTTONS_TEXT.DELETE_DECK]: onDeleteDeck,
    [BUTTONS_TEXT.REMOVE_SELECTED_CARDS]: onRemoveSelectedCards,
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
  } = getMenuStateForDeckPage({
    addingItem: addingCard,
    selected: Boolean(selectedCardsId.length),
    allSelected: Boolean(cards.length) && cards.every((card) => selectedCardsId.includes(card.id)),
    descriptionEditing,
    haveDecks: Boolean(cards.length)
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

  if (descriptionEditing) {
    confirmationFormData = newDescription;
    setConfirmationFormData = setNewDescription;
  }

  /** ----------------- RETURN --------------------------------- */

  return (
    <div className="page-wrapper deck-page-wrapper">
      <div className="top-section">
        <div className="deck-description">
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
        <Search setSearchInput={setSearchInput} />
      </div>
      <div className="bottom-section">
        <h3 className="mobile-margin-exterior">Cards</h3>
        <List>
          {cards.map((card) => {
            const checked = Boolean(selectedCardsId.find((cardId) => cardId === card.id));

            return (
              <ListItem
                key={card.id}
                showArrow
                text={card.question}
                id={card.id}
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
        />
      )}
    </div>
  );
};

export default DeckPage;
