import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GameCard } from './components/GameCard';
import { InputField } from './components/InputField';
import { Feedback } from './components/Feedback';
import { Statistics } from './components/Statistics';
import { ConfirmationDialog } from './components/ConfirmationDialog';
import { LanguageSelector } from './components/LanguageSelector';
import { useGameLogic } from './hooks/useGameLogic';
import { playCorrectSound, playIncorrectSound } from './utils/sounds';
import './styles/App.css';

function App() {
  const { t, i18n } = useTranslation();
  
  // Обновление meta тегов и манифеста PWA при изменении языка
  useEffect(() => {
    const language = i18n.language;
    const langCode = language.split('-')[0]; // Получаем базовый код языка (ru, en, no, uk)
    
    // Обновляем атрибут lang в HTML элементе
    document.documentElement.lang = langCode;
    
    // Обновляем title
    document.title = t('pageTitle');
    
    // Обновляем meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', t('metaDescription'));
    
    // Обновляем apple-mobile-web-app-title
    let metaAppleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (!metaAppleTitle) {
      metaAppleTitle = document.createElement('meta');
      metaAppleTitle.setAttribute('name', 'apple-mobile-web-app-title');
      document.head.appendChild(metaAppleTitle);
    }
    metaAppleTitle.setAttribute('content', t('appName'));
    
    // Обновляем application-name
    let metaAppName = document.querySelector('meta[name="application-name"]');
    if (!metaAppName) {
      metaAppName = document.createElement('meta');
      metaAppName.setAttribute('name', 'application-name');
      document.head.appendChild(metaAppName);
    }
    metaAppName.setAttribute('content', t('appName'));
    
    // Обновляем манифест PWA
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      // Сохраняем старый Blob URL для освобождения памяти
      const oldUrl = manifestLink.href.startsWith('blob:') ? manifestLink.href : null;
      
      // Загружаем текущий манифест и обновляем его
      fetch(manifestLink.href)
        .then(response => response.json())
        .then(manifest => {
          // Обновляем локализованные поля манифеста
          manifest.name = t('pageTitle');
          manifest.short_name = t('appName');
          manifest.description = t('metaDescription');
          
          // Создаем новый Blob URL для обновленного манифеста
          const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], {
            type: 'application/json'
          });
          const manifestUrl = URL.createObjectURL(manifestBlob);
          
          // Освобождаем старый Blob URL, если он был
          if (oldUrl) {
            URL.revokeObjectURL(oldUrl);
          }
          
          // Обновляем ссылку на манифест
          manifestLink.href = manifestUrl;
        })
        .catch(err => {
          // Если манифест не загружается, создаем новый с базовыми значениями
          const baseManifest = {
            name: t('pageTitle'),
            short_name: t('appName'),
            description: t('metaDescription'),
            theme_color: '#667eea',
            background_color: '#667eea',
            display: 'standalone',
            orientation: 'portrait',
            scope: '/multiply-game/',
            start_url: '/multiply-game/',
            icons: [
              {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any'
              },
              {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
              },
              {
                src: 'pwa-512x512-maskable.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
              }
            ]
          };
          
          const manifestBlob = new Blob([JSON.stringify(baseManifest, null, 2)], {
            type: 'application/json'
          });
          const manifestUrl = URL.createObjectURL(manifestBlob);
          
          // Освобождаем старый Blob URL, если он был
          if (oldUrl) {
            URL.revokeObjectURL(oldUrl);
          }
          
          manifestLink.href = manifestUrl;
        });
    }
  }, [i18n.language, t]);
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
      alert(t('alerts.selectAtLeastOne'));
      return;
    }
    if (cardsCount <= 0) {
      alert(t('alerts.cardsCountZero'));
      return;
    }
    setSelectedCards(cardsCount);
    startGame();
  };

  const handleCustomCardsSubmit = (e) => {
    e.preventDefault();
    const count = parseInt(customCardsCount);
    if (isNaN(count) || count <= 0) {
      alert(t('alerts.invalidNumber'));
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
        <LanguageSelector />
        <div className="start-screen">
          <h1 className="start-screen-title">{t('title')}</h1>
          <p className="start-screen-subtitle">{t('selectNumbers')}</p>
          <p className="start-screen-hint">{t('selectNumbersHint')}</p>
          <div className="number-selector-actions">
            <button
              className="number-selector-action-button"
              onClick={handleSelectAll}
              disabled={selectedNumbers.length === 10}
            >
              {t('selectAll')}
            </button>
            {selectedNumbers.length > 0 && (
              <button
                className="number-selector-action-button"
                onClick={handleDeselectAll}
              >
                {t('deselectAll')}
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
              <p>{t('selected')}: {selectedNumbers.join(', ')}</p>
            ) : (
              <p className="selected-numbers-hint">{t('atLeastOneNumber')}</p>
            )}
          </div>
          {selectedNumbers.length > 0 && (
            <button
              className="start-screen-button"
              onClick={() => {
                setShowNumbersScreen(false);
              }}
            >
              {t('continue')}
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
        <LanguageSelector />
        <div className="start-screen">
          <h1 className="start-screen-title">{t('title')}</h1>
          <p className="start-screen-subtitle">{t('selected')}: {selectedNumbers.join(', ')}</p>
          <p className="start-screen-subtitle">{t('selectCardsCount')}</p>
          <div className="start-screen-options">
            <button
              className="start-screen-button"
              onClick={() => handleStartGame(10)}
            >
              10 {t('cards')}
            </button>
            <button
              className="start-screen-button"
              onClick={() => handleStartGame(20)}
            >
              20 {t('cards')}
            </button>
            <button
              className="start-screen-button"
              onClick={() => handleStartGame(30)}
            >
              30 {t('cards')}
            </button>
          </div>
          <div className="custom-cards-input-wrapper">
            <p className="custom-cards-label">{t('orEnterCustom')}</p>
            <form className="custom-cards-form" onSubmit={handleCustomCardsSubmit}>
              <input
                type="text"
                inputMode="numeric"
                className="custom-cards-input"
                value={customCardsCount}
                onChange={handleCustomCardsChange}
                placeholder={t('enterNumber')}
              />
              <button
                type="submit"
                className="start-screen-button"
                disabled={!customCardsCount || parseInt(customCardsCount) <= 0}
              >
                {t('startGame')}
              </button>
            </form>
          </div>
          <button
            className="start-screen-button start-screen-button-secondary"
            onClick={() => setShowNumbersScreen(true)}
            style={{ marginTop: '1rem' }}
          >
            {t('backToNumbers')}
          </button>
        </div>
      </div>
    );
  }

  // Экран статистики
  if (isGameFinished) {
    return (
      <div className="app">
        <LanguageSelector />
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
      <LanguageSelector />
      <button
        className="exit-game-button"
        onClick={handleExitGame}
        title={t('exitGame')}
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
        title={t('exitConfirmTitle')}
        message={t('exitConfirmMessage')}
        confirmText={t('yesExit')}
        cancelText={t('cancel')}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
      />
    </div>
  );
}

export default App;

