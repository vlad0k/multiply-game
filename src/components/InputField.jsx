import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import './InputField.css';

/**
 * Компонент поля ввода ответа
 * @param {Function} onSubmit - Функция обработки ответа
 * @param {boolean} disabled - Заблокировано ли поле
 */
export const InputField = forwardRef(function InputField({ onSubmit, disabled, autoFocus }, ref) {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }));

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    // Разрешаем только числа
    if (inputValue === '' || /^\d+$/.test(inputValue)) {
      setValue(inputValue);
    }
  };

  return (
    <form className="input-field" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        className="input-field-input"
        value={value}
        onChange={handleChange}
        placeholder={t('enterAnswer')}
        disabled={disabled}
        autoFocus={autoFocus}
      />
      <button
        type="submit"
        className="input-field-button"
        disabled={disabled || !value.trim()}
      >
        {t('submit')}
      </button>
    </form>
  );
});

