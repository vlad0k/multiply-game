import { useEffect, useState } from 'react';
import './GameCard.css';

/**
 * Компонент карточки с вопросом
 * @param {Object} question - Объект с вопросом {num1, num2}
 * @param {number} cardIndex - Индекс текущей карточки
 * @param {number} totalCards - Общее количество карточек
 */
export function GameCard({ question, cardIndex, totalCards }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [question]);

  if (!question) return null;

  return (
    <div className={`game-card ${isVisible ? 'game-card-visible' : ''}`}>
      <div className="game-card-progress">
        Карточка {cardIndex + 1} из {totalCards}
      </div>
      <div className="game-card-question">
        <span className="game-card-number">{question.num1}</span>
        <span className="game-card-operator">×</span>
        <span className="game-card-number">{question.num2}</span>
        <span className="game-card-equals">=</span>
        <span className="game-card-question-mark">?</span>
      </div>
    </div>
  );
}

