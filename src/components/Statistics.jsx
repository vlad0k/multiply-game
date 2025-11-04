import { useTranslation } from 'react-i18next';
import './Statistics.css';

/**
 * Компонент отображения статистики игры
 * @param {number} totalCards - Всего карточек
 * @param {number} correctAnswers - Правильных ответов
 * @param {number} incorrectAnswers - Неправильных ответов
 * @param {Function} onRestart - Функция для начала новой игры
 */
export function Statistics({ totalCards, correctAnswers, incorrectAnswers, onRestart }) {
  const { t } = useTranslation();
  const percentage = totalCards > 0 ? Math.round((correctAnswers / totalCards) * 100) : 0;

  const getPerformanceMessage = () => {
    if (percentage === 100) return t('performance100');
    if (percentage >= 80) return t('performance80');
    if (percentage >= 60) return t('performance60');
    if (percentage >= 40) return t('performance40');
    return t('performance0');
  };

  return (
    <div className="statistics">
      <div className="statistics-container">
        <h2 className="statistics-title">{t('gameFinished')}</h2>
        
        <div className="statistics-content">
          <div className="statistics-item">
            <div className="statistics-label">{t('totalCards')}</div>
            <div className="statistics-value">{totalCards}</div>
          </div>

          <div className="statistics-item statistics-item-correct">
            <div className="statistics-label">{t('correctAnswers')}</div>
            <div className="statistics-value">{correctAnswers}</div>
          </div>

          <div className="statistics-item statistics-item-incorrect">
            <div className="statistics-label">{t('incorrectAnswers')}</div>
            <div className="statistics-value">{incorrectAnswers}</div>
          </div>

          <div className="statistics-item statistics-item-percentage">
            <div className="statistics-label">{t('accuracy')}</div>
            <div className="statistics-value statistics-value-large">{percentage}%</div>
          </div>
        </div>

        <div className="statistics-message">
          {getPerformanceMessage()}
        </div>

        <button className="statistics-button" onClick={onRestart}>
          {t('restart')}
        </button>
      </div>
    </div>
  );
}

