/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CardStored } from '../data/interfaces';
import { useDbStore } from '../stores/db-store/store';
import "./card.css";

const CardPage = (args: any) => {
  /** ----------------- CUSTOM HOOK CALLS -------------------- */
  const cardId = parseInt(useParams()?.id ?? "-");

  const { 
    state: {db}, 
    getCard
  } = useDbStore();

  /** ----------------- USE STATE -------------------- */
  const [card, setCard] = useState<CardStored | null>(null);

  useEffect(() => {
    if (db && !isNaN(cardId)) {
      (async () => {
        await getCardData();
      })();
    }
  }, [Boolean(db)]);

  /** ----------------- DATA HANDLING FUNCTIONS -------------------- */
  const getCardData = async () => {
    const cardData = await getCard(cardId);
    setCard(card => cardData ?? card);
  };

  let displayLastSawDate = null;
  let displayNextSeeDate = null;

  if (card?.lastSawDate) {
    displayLastSawDate = new Date(parseInt(card.lastSawDate)).toString();
  }

  if (card?.nextSeeDate) {
    displayNextSeeDate = new Date(parseInt(card.nextSeeDate)).toString();
  }

  /** ----------------- RETURN --------------------------------- */
  if (!card) {
    return <div>Card Not Found</div>;
  }
  return (
    <div className="card-page-wrapper">
      <h3>question</h3>
      <div>{card.question}</div>
      <h3>answer</h3>
      <div>{card.answer}</div>
      <h3>Level of confidence</h3>
      <div>{card.level ?? "No Level"}</div>
      <h3>Last saw date</h3>
      <div>{displayLastSawDate ?? "Never"}</div>
      <h3>Next see date</h3>
      <div>{displayNextSeeDate ?? "immediately"}</div>
    </div>
  );
};

export default CardPage;
