import { useEffect, useState } from 'react';
import './Feedback.css';

/**
 * Компонент обратной связи для отображения результатов ответа
 * @param {boolean} isCorrect - Правильный ли ответ
 * @param {boolean} show - Показывать ли обратную связь
 */
export function Feedback({ isCorrect, show }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show || !visible) return null;

  return (
    <div className={`feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'} ${visible ? 'feedback-visible' : ''}`}>
      <div className="feedback-icon">
        {isCorrect ? '✓' : '✗'}
      </div>
      <div className="feedback-message">
        {isCorrect ? 'Правильно! Молодец!' : 'Неверно. Попробуй еще раз!'}
      </div>
    </div>
  );
}

