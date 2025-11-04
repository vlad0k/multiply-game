import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook для управления логикой игры
 * @param {number} totalCards - Общее количество карточек
 * @param {number[]} selectedNumbers - Массив выбранных чисел для первого множителя
 */
export function useGameLogic(totalCards, selectedNumbers = []) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);
  
  // Хранилище всех возможных вопросов и использованных
  const allQuestionsRef = useRef([]);
  const usedQuestionsRef = useRef(new Set());

  /**
   * Генерирует все возможные вопросы на основе выбранных чисел
   */
  const generateAllQuestions = useCallback(() => {
    const questions = [];
    
    if (selectedNumbers.length === 0) {
      // Если числа не выбраны, генерируем все комбинации от 1×1 до 10×10
      for (let num1 = 1; num1 <= 10; num1++) {
        for (let num2 = 1; num2 <= 10; num2++) {
          questions.push({
            num1,
            num2,
            answer: num1 * num2,
            key: `${num1},${num2}`
          });
        }
      }
    } else {
      // Первый множитель из выбранных чисел, второй от 1 до 10
      for (const num1 of selectedNumbers) {
        for (let num2 = 1; num2 <= 10; num2++) {
          questions.push({
            num1,
            num2,
            answer: num1 * num2,
            key: `${num1},${num2}`
          });
        }
      }
    }
    
    return questions;
  }, [selectedNumbers]);

  /**
   * Генерирует случайный вопрос из неиспользованных вариантов
   */
  const generateQuestion = useCallback(() => {
    // Проверяем, что есть доступные вопросы
    if (allQuestionsRef.current.length === 0) {
      return null;
    }
    
    // Если все вопросы использованы, сбрасываем список использованных
    if (usedQuestionsRef.current.size >= allQuestionsRef.current.length && allQuestionsRef.current.length > 0) {
      usedQuestionsRef.current.clear();
    }
    
    // Получаем неиспользованные вопросы
    const unusedQuestions = allQuestionsRef.current.filter(
      question => !usedQuestionsRef.current.has(question.key)
    );
    
    // Если нет неиспользованных вопросов, возвращаем null
    if (unusedQuestions.length === 0) {
      return null;
    }
    
    // Выбираем случайный вопрос из неиспользованных
    const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
    const selectedQuestion = unusedQuestions[randomIndex];
    
    // Помечаем вопрос как использованный
    if (selectedQuestion) {
      usedQuestionsRef.current.add(selectedQuestion.key);
    }
    
    return selectedQuestion;
  }, []);

  /**
   * Начинает игру, генерируя первый вопрос
   */
  const startGame = useCallback(() => {
    // Генерируем все возможные вопросы при старте игры
    allQuestionsRef.current = generateAllQuestions();
    // Сбрасываем список использованных вопросов
    usedQuestionsRef.current.clear();
    // Генерируем первый вопрос
    setCurrentQuestion(generateQuestion());
    setCurrentCardIndex(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setIsGameFinished(false);
  }, [generateAllQuestions, generateQuestion]);

  /**
   * Проверяет ответ и переходит к следующему вопросу
   * @param {number} userAnswer - Ответ пользователя
   * @returns {{isCorrect: boolean, isLastCard: boolean}} - Результат проверки
   */
  const checkAnswer = useCallback((userAnswer) => {
    if (!currentQuestion) return { isCorrect: false, isLastCard: false };
    
    const isCorrect = parseInt(userAnswer) === currentQuestion.answer;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      setIncorrectAnswers(prev => prev + 1);
    }

    // Переход к следующей карточке
    const nextIndex = currentCardIndex + 1;
    const isLastCard = nextIndex >= totalCards;
    
    if (isLastCard) {
      setIsGameFinished(true);
    } else {
      setCurrentCardIndex(nextIndex);
      setCurrentQuestion(generateQuestion());
    }

    return { isCorrect, isLastCard };
  }, [currentQuestion, currentCardIndex, totalCards, generateQuestion]);

  /**
   * Сбрасывает игру
   */
  const resetGame = useCallback(() => {
    setCurrentQuestion(null);
    setCurrentCardIndex(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setIsGameFinished(false);
    // Сбрасываем список использованных вопросов
    usedQuestionsRef.current.clear();
    allQuestionsRef.current = [];
  }, []);

  return {
    currentQuestion,
    currentCardIndex,
    correctAnswers,
    incorrectAnswers,
    isGameFinished,
    startGame,
    checkAnswer,
    resetGame,
    totalCards
  };
}

