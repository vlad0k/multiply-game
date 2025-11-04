import { useState } from 'react';
import { GameCard } from './components/GameCard';
import { InputField } from './components/InputField';
import { Feedback } from './components/Feedback';
import { Statistics } from './components/Statistics';
import { ConfirmationDialog } from './components/ConfirmationDialog';
import { useGameLogic } from './hooks/useGameLogic';
import { playCorrectSound, playIncorrectSound } from './utils/sounds';
import './styles/App.css';

function App() {
  const [selectedCards, setSelectedCards] = useState(null);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [showNumbersScreen, setShowNumbersScreen] = useState(true);
  const [customCardsCount, setCustomCardsCount] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const {
    currentQuestion,
    currentCardIndex,
    correctAnswers,
    incorrectAnswers,
    isGameFinished,
    startGame,
    checkAnswer,
    resetGame,
    totalCards
  } = useGameLogic(selectedCards || 0, selectedNumbers);


  const handleAnswerSubmit = (userAnswer) => {
    setIsInputDisabled(true);
    const { isCorrect, isLastCard } = checkAnswer(userAnswer);
    setIsCorrect(isCorrect);
    setShowFeedback(true);

    // Воспроизведение звука
    if (isCorrect) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }

    // Скрываем обратную связь и разблокируем ввод перед следующим вопросом
    setTimeout(() => {
      setShowFeedback(false);
      if (!isLastCard) {
        setIsInputDisabled(false);
      }
    }, 1500);
  };

  const handleRestart = () => {
    resetGame();
    setSelectedCards(null);
    setSelectedNumbers([]);
    setCustomCardsCount('');
    setShowNumbersScreen(true);
    setShowFeedback(false);
    setIsInputDisabled(false);
  };

  const handleExitGame = () => {
    setShowExitDialog(true);
  };

  const handleConfirmExit = () => {
    resetGame();
    setSelectedCards(null);
    setSelectedNumbers([]);
    setCustomCardsCount('');
    setShowNumbersScreen(true);
    setShowFeedback(false);
    setIsInputDisabled(false);
    setShowExitDialog(false);
  };

  const handleCancelExit = () => {
    setShowExitDialog(false);
  };

  const handleNumberToggle = (number) => {
    setSelectedNumbers(prev => {
      if (prev.includes(number)) {
        return prev.filter(n => n !== number);
      } else {
        return [...prev, number].sort((a, b) => a - b);
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  };

  const handleDeselectAll = () => {
    setSelectedNumbers([]);
  };

  const handleStartGame = (cardsCount) => {
    if (selectedNumbers.length === 0) {
      alert('Пожалуйста, выбери хотя бы одно число!');
      return;
    }
    if (cardsCount <= 0) {
      alert('Количество карточек должно быть больше нуля!');
      return;
    }
    setSelectedCards(cardsCount);
    startGame();
  };

  const handleCustomCardsSubmit = (e) => {
    e.preventDefault();
    const count = parseInt(customCardsCount);
    if (isNaN(count) || count <= 0) {
      alert('Пожалуйста, введи корректное число (больше нуля)!');
      return;
    }
    handleStartGame(count);
  };

  const handleCustomCardsChange = (e) => {
    const value = e.target.value;
    // Разрешаем только числа
    if (value === '' || /^\d+$/.test(value)) {
      setCustomCardsCount(value);
    }
  };

  // Экран выбора чисел
  if (showNumbersScreen && selectedCards === null) {
    return (
      <div className="app">
        <div className="start-screen">
          <h1 className="start-screen-title">Таблица умножения</h1>
          <p className="start-screen-subtitle">Выбери числа для изучения</p>
          <p className="start-screen-hint">Будут вопросы вида: выбранное число × 1...10</p>
          <div className="number-selector-actions">
            <button
              className="number-selector-action-button"
              onClick={handleSelectAll}
              disabled={selectedNumbers.length === 10}
            >
              Выбрать все
            </button>
            {selectedNumbers.length > 0 && (
              <button
                className="number-selector-action-button"
                onClick={handleDeselectAll}
              >
                Снять все
              </button>
            )}
          </div>
          <div className="number-selector">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(number => (
              <button
                key={number}
                className={`number-button ${selectedNumbers.includes(number) ? 'number-button-selected' : ''}`}
                onClick={() => handleNumberToggle(number)}
              >
                {number}
              </button>
            ))}
          </div>
          <div className="selected-numbers-info">
            {selectedNumbers.length > 0 ? (
              <p>Выбрано: {selectedNumbers.join(', ')}</p>
            ) : (
              <p className="selected-numbers-hint">Выбери хотя бы одно число</p>
            )}
          </div>
          {selectedNumbers.length > 0 && (
            <button
              className="start-screen-button"
              onClick={() => {
                setShowNumbersScreen(false);
              }}
            >
              Продолжить
            </button>
          )}
        </div>
      </div>
    );
  }

  // Экран выбора количества карточек
  if (!showNumbersScreen && selectedNumbers.length > 0 && selectedCards === null) {
    return (
      <div className="app">
        <div className="start-screen">
          <h1 className="start-screen-title">Таблица умножения</h1>
          <p className="start-screen-subtitle">Выбрано: {selectedNumbers.join(', ')}</p>
          <p className="start-screen-subtitle">Выбери количество карточек для игры</p>
          <div className="start-screen-options">
            <button
              className="start-screen-button"
              onClick={() => handleStartGame(10)}
            >
              10 карточек
            </button>
            <button
              className="start-screen-button"
              onClick={() => handleStartGame(20)}
            >
              20 карточек
            </button>
            <button
              className="start-screen-button"
              onClick={() => handleStartGame(30)}
            >
              30 карточек
            </button>
          </div>
          <div className="custom-cards-input-wrapper">
            <p className="custom-cards-label">Или введи свое количество:</p>
            <form className="custom-cards-form" onSubmit={handleCustomCardsSubmit}>
              <input
                type="text"
                inputMode="numeric"
                className="custom-cards-input"
                value={customCardsCount}
                onChange={handleCustomCardsChange}
                placeholder="Введите число"
              />
              <button
                type="submit"
                className="start-screen-button"
                disabled={!customCardsCount || parseInt(customCardsCount) <= 0}
              >
                Начать игру
              </button>
            </form>
          </div>
          <button
            className="start-screen-button start-screen-button-secondary"
            onClick={() => setShowNumbersScreen(true)}
            style={{ marginTop: '1rem' }}
          >
            Назад к выбору чисел
          </button>
        </div>
      </div>
    );
  }

  // Экран статистики
  if (isGameFinished) {
    return (
      <div className="app">
        <Statistics
          totalCards={totalCards}
          correctAnswers={correctAnswers}
          incorrectAnswers={incorrectAnswers}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  // Игровой экран
  return (
    <div className="app">
      <button
        className="exit-game-button"
        onClick={handleExitGame}
        title="Выйти из игры"
      >
        ✕
      </button>
      <div className="game-container">
        <div className="game-stats">
          <div className="game-stat-item game-stat-correct">
            ✅ {correctAnswers}
          </div>
          <div className="game-stat-item game-stat-incorrect">
            ❌ {incorrectAnswers}
          </div>
        </div>
        <GameCard
          question={currentQuestion}
          cardIndex={currentCardIndex}
          totalCards={totalCards}
        />
        <InputField
          onSubmit={handleAnswerSubmit}
          disabled={isInputDisabled}
        />
      </div>
      <Feedback isCorrect={isCorrect} show={showFeedback} />
      <ConfirmationDialog
        show={showExitDialog}
        title="Выйти из игры?"
        message="Твой прогресс будет потерян. Ты уверен, что хочешь выйти?"
        confirmText="Да, выйти"
        cancelText="Отмена"
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
      />
    </div>
  );
}

export default App;

