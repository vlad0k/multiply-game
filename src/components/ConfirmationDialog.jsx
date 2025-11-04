import './ConfirmationDialog.css';

/**
 * Компонент модального окна подтверждения
 * @param {boolean} show - Показывать ли модальное окно
 * @param {string} title - Заголовок модального окна
 * @param {string} message - Сообщение в модальном окне
 * @param {string} confirmText - Текст кнопки подтверждения
 * @param {string} cancelText - Текст кнопки отмены
 * @param {Function} onConfirm - Функция при подтверждении
 * @param {Function} onCancel - Функция при отмене
 */
export function ConfirmationDialog({
  show,
  title = 'Подтверждение',
  message = 'Вы уверены?',
  confirmText = 'Да',
  cancelText = 'Отмена',
  onConfirm,
  onCancel
}) {
  if (!show) return null;

  return (
    <div className="confirmation-dialog-overlay" onClick={onCancel}>
      <div className="confirmation-dialog" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirmation-dialog-title">{title}</h3>
        <p className="confirmation-dialog-message">{message}</p>
        <div className="confirmation-dialog-buttons">
          <button
            className="confirmation-dialog-button confirmation-dialog-button-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="confirmation-dialog-button confirmation-dialog-button-confirm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

