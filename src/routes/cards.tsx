/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { CardStored, CourseStored, DeckStored } from '../data/interfaces';
import List from '../components/list/List';
import Search from '../components/Search';
import ListItem from '../components/list/ListItem';
import { useDbStore } from '../stores/db-store/store';
import { FieldsForSorting, ROOT_NAME, BUTTONS_TEXT } from '../constants';
import ConfirmationForm from '../components/forms/ConfirmationForm';
import MobileMenu from '../components/mobile-menu/MobileMenu';
import MobileSubmenu from '../components/mobile-menu/MobileSubmenu';
import MobileMenuItem from '../components/mobile-menu/MobileMenuItem';
import { getMenuStateForCardsPage, mapButtonsTextToHandlers } from '../logic/menu-helpers';
import ButtonsGroup from '../components/buttons/ButtonsGroup';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import PickDecksForm from '../components/forms/PickDecksForm';

import './cards.css';

const CardsPage = () => {
  /** ------------------- CUSTOM HOOK ---------------- */
  const {
    state: { db },
    getAllCardsByFilter,
    deleteCards,
    getAllDecks,
    getAllCourses,
    addCardsToDeck,
    createRevertedCards,
  } = useDbStore();

  const navigate = useNavigate();

  const state = useLocation().state as { deckId?: string } | null; 

  /** ------------------- USE STATE ---------------- */
  const [cards, setCards] = useState<CardStored[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardStored[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [addingToDeck, setAddingToDeck] = useState(false);
  const [deletingSelectedCards, setDeletingSelectedCards] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmationForm, setShowConfirmationForm] = useState<Boolean>(false);
  const [confirmationFormError, setConfirmationFormError] = useState<string | null>(null);
  const [showPickDecksForm, setShowPickDecksForm] = useState<Boolean>(false);
  const [pickDecksFormError, setPickDecksFormError] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseStored[]>([]);
  const [decks, setDecks] = useState<DeckStored[]>([]);

  /** ------------------- USE EFFECT ---------------- */
  useEffect(() => {
    if (db) {
      getCardsData();
    }
  }, [db]);

  useEffect(() => {
    getCardsData();
  }, [searchInput]);

  useEffect(() => {
    if (deletingSelectedCards) {
      setConfirmationFormError(null);
      setShowConfirmationForm(true);
    }
  }, [deletingSelectedCards]);

  useEffect(() => {
    if (!showConfirmationForm) {
      setDeletingSelectedCards(false);
    }
  }, [showConfirmationForm]);

  /** ------------------- DATA HANDLING FUNCTIONS ---------------- */

  const getCardsData = async () => {
    try {
      const cards = await getAllCardsByFilter({
        sort: {
          field: FieldsForSorting.createdAt
        },
        filter: {
          questionSearch: searchInput
        }
      });

      setCards(cards);
    } catch (err) {
      setError('Error getting cards');
    }
  };

  const deleteSelectedCards = async (): Promise<{ error: null | string }> => {
    try {
      await deleteCards(selectedCardsIds);

      return { error: null };
    } catch (err) {
      return { error: 'Error while deleting cards' };
    }
  };

  /** ------------------- EVENT HANDLERS ---------------- */

  const onCardChecked = ({ checked, id }: { checked: boolean; id: number }) => {
    setSelectedCards((selectedCards) => {
      if (checked) {
        const card = cards.find((c) => c.id === id);
        if (card) {
          return [...selectedCards, card];
        }
      } else {
        return [...selectedCards.filter((c) => c.id !== id)];
      }

      return selectedCards;
    });
  };

  const onUnselectCard = (id: number) => {
    setSelectedCards((selectedCards) => {
      return [...selectedCards.filter((c) => c.id !== id)];
    });
  };

  const onDeleteSelectedCards = () => {};

  const onSelectAll = () => {
    setSelectedCards(() => cards);
  };

  const onUnselectAll = () => {
    setSelectedCards(() => []);
  };

  const onConfirmationFormOk = async () => {
    let error = null;

    if (deletingSelectedCards) {
      const data = await deleteSelectedCards();
      error = data.error;
    }

    if (error) {
      setConfirmationFormError(error);
      return;
    }

    setShowConfirmationForm(false);

    getCardsData();
  };

  const onConfirmationFormCancel = () => {
    setShowConfirmationForm(false);
    setShowPickDecksForm(false);
  };

  const onAddToDeck = async () => {
    try {
      const decksStored = await getAllDecks();
      const coursesStored = await getAllCourses();

      setDecks(decksStored);
      setCourses(coursesStored);

      setShowPickDecksForm(true);
    } catch (err) {
      setError('Error getting the decks and courses');

      setDecks((decks) => decks);
      setCourses((courses) => courses);
      setShowPickDecksForm(false);
    }
  };

  const onPlay = () => {
    navigate(`/${ROOT_NAME}/test/`);
  };

  const onPlaySelected = () => {
    navigate(`/${ROOT_NAME}/test/`, { 
      state: { 
        cardsIds: selectedCardsIds,
      }
    });
  };

  const onAddCard = () => {
    navigate(`/${ROOT_NAME}/add-card`);
  };

  const onSelectDeck = async (deckId: number) => {
    try {

      await addCardsToDeck({
        deckId,
        cardsIds: selectedCardsIds,
      });

    } catch (e) {
      console.log('error on adding cards to another deck', e);
    }

    onConfirmationFormCancel();
  };


  const onCreateRevertedCard = async () => {
    console.log('calll');

    try {
      await createRevertedCards(selectedCards);
    } catch (err) {
      console.log('Error on creating a reverted card', err);
    }
  };

  /** ------------------- VARIABLES ---------------- */
  const deckId = state?.deckId;
  
  const selectedCardsIds = selectedCards.map((c) => c.id);

  const buttonTextHandlersMap = {
    [BUTTONS_TEXT.DELETE_SELECTED_CARDS]: onDeleteSelectedCards,
    [BUTTONS_TEXT.SELECT_ALL]: onSelectAll,
    [BUTTONS_TEXT.UNSELECT_ALL]: onUnselectAll,
    [BUTTONS_TEXT.ADD_TO_DECK]: onAddToDeck,
    [BUTTONS_TEXT.OK_CONFIRMATION_FORM]: onConfirmationFormOk,
    [BUTTONS_TEXT.CANCEL_CONFIRMATION_FORM]: onConfirmationFormCancel,
    [BUTTONS_TEXT.PLAY]: onPlay,
    [BUTTONS_TEXT.PLAY_SELECTED]: onPlaySelected,
    [BUTTONS_TEXT.ADD_CARD]: onAddCard,
    [BUTTONS_TEXT.CREATE_REVERTED_CARD]: onCreateRevertedCard,
  };

  const { firstDesktopSubmenu, secondDesktopSubmenu, firstMobileSubmenu, secondMobileSubmenu } =
    getMenuStateForCardsPage({
      deletingSelectedCards,
      selected: Boolean(selectedCards.length),
      allSelected:
        Boolean(cards.length) && cards.every((card) => selectedCardsIds.includes(card.id))
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

  let confirmationFormData;
  let setConfirmationFormData;

  /** ------------------- RETURN ---------------- */

  return (
    <div className="cards-page-wrapper">
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
      <div className="space"></div>
      <List>
        {selectedCards
          .map((c) => {
            return (
              <ListItem
                key={c.id}
                text={c.question}
                textSecondary={c.answer}
                onRemove={onUnselectCard}
                showRemove
                id={c.id}
              />
            );
          })
          .filter(Boolean)}
      </List>
      <div className="space"></div>
      <List>
        {cards.map((card) => {
          const checked = Boolean(selectedCardsIds.find((id) => id === card.id));

          return (
            <ListItem
              key={card.id}
              text={card.question}
              textSecondary={card.answer}
              showArrow
              usesCheckbox
              checked={checked}
              onCheckboxChange={onCardChecked}
              id={card.id}
            />
          );
        })}
      </List>
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
          message={"Are you sure you want to delete selected cards ?"}
        />
      )}
      {showPickDecksForm && (
        <PickDecksForm
          error={pickDecksFormError}
          onClose={onConfirmationFormCancel}
          decks={decks}
          courses={courses}
          onSelectDeck={onSelectDeck}
        />
      )}
    </div>
  );
};

export default CardsPage;
