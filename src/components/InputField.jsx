import { useState, useRef, useEffect } from 'react';
import './InputField.css';

/**
 * Компонент поля ввода ответа
 * @param {Function} onSubmit - Функция обработки ответа
 * @param {boolean} disabled - Заблокировано ли поле
 */
export function InputField({ onSubmit, disabled }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

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
        placeholder="Введите ответ"
        disabled={disabled}
        autoFocus
      />
      <button
        type="submit"
        className="input-field-button"
        disabled={disabled || !value.trim()}
      >
        Ответить
      </button>
    </form>
  );
}

