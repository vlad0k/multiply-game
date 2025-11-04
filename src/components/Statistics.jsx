import './Statistics.css';

/**
 * Компонент отображения статистики игры
 * @param {number} totalCards - Всего карточек
 * @param {number} correctAnswers - Правильных ответов
 * @param {number} incorrectAnswers - Неправильных ответов
 * @param {Function} onRestart - Функция для начала новой игры
 */
export function Statistics({ totalCards, correctAnswers, incorrectAnswers, onRestart }) {
  const percentage = totalCards > 0 ? Math.round((correctAnswers / totalCards) * 100) : 0;

  const getPerformanceMessage = () => {
    if (percentage === 100) return 'Отлично! Ты знаешь таблицу умножения наизусть! 🎉';
    if (percentage >= 80) return 'Отлично! Ты почти все знаешь! 🌟';
    if (percentage >= 60) return 'Хорошо! Продолжай тренироваться! 💪';
    if (percentage >= 40) return 'Неплохо! Еще немного практики! 📚';
    return 'Продолжай учиться! Ты справишься! 💪';
  };

  return (
    <div className="statistics">
      <div className="statistics-container">
        <h2 className="statistics-title">Игра завершена!</h2>
        
        <div className="statistics-content">
          <div className="statistics-item">
            <div className="statistics-label">Всего карточек</div>
            <div className="statistics-value">{totalCards}</div>
          </div>

          <div className="statistics-item statistics-item-correct">
            <div className="statistics-label">Правильных ответов</div>
            <div className="statistics-value">{correctAnswers}</div>
          </div>

          <div className="statistics-item statistics-item-incorrect">
            <div className="statistics-label">Неправильных ответов</div>
            <div className="statistics-value">{incorrectAnswers}</div>
          </div>

          <div className="statistics-item statistics-item-percentage">
            <div className="statistics-label">Процент правильности</div>
            <div className="statistics-value statistics-value-large">{percentage}%</div>
          </div>
        </div>

        <div className="statistics-message">
          {getPerformanceMessage()}
        </div>

        <button className="statistics-button" onClick={onRestart}>
          Начать заново
        </button>
      </div>
    </div>
  );
}

