// Генерация звуков через Web Audio API

let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Возобновляем контекст, если он приостановлен (требуется для некоторых браузеров)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

/**
 * Создает более интересный звук с несколькими частотами (аккорд)
 */
const createChord = (ctx, frequencies, duration, type = 'sine', volume = 0.15) => {
  const gainNode = ctx.createGain();
  gainNode.connect(ctx.destination);
  
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  
  frequencies.forEach((freq, index) => {
    const oscillator = ctx.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = freq;
    oscillator.connect(gainNode);
    
    const delay = index * 0.02; // Небольшая задержка для создания эффекта арпеджио
    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + duration + delay);
  });
};

/**
 * Создает мелодическую последовательность
 */
const createMelody = (ctx, notes, noteDuration, volume = 0.2) => {
  notes.forEach((freq, index) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = freq;
    oscillator.type = 'sine';
    
    const startTime = ctx.currentTime + index * noteDuration;
    const endTime = startTime + noteDuration;
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, endTime);
    
    oscillator.start(startTime);
    oscillator.stop(endTime);
  });
};

/**
 * Воспроизводит радостный звук для правильного ответа
 * Мажорный аккорд с восходящей мелодией
 */
export function playCorrectSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Мажорный аккорд (до-ми-соль) - радостный звук
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      const delay = index * 0.03;
      const duration = 0.4;
      
      gainNode.gain.setValueAtTime(0.2, now + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + delay + duration);
      
      oscillator.start(now + delay);
      oscillator.stop(now + delay + duration);
    });
    
    // Добавляем короткую восходящую мелодию в конце
    setTimeout(() => {
      const melody = [659.25, 783.99, 987.77]; // E5, G5, B5
      createMelody(ctx, melody, 0.08, 0.15);
    }, 100);
    
  } catch (error) {
    console.warn('Не удалось воспроизвести звук:', error);
  }
}

/**
 * Воспроизводит грубый звук для неправильного ответа
 * Использует низкие частоты и резкую форму волны
 */
export function playIncorrectSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Грубый диссонансный аккорд с низкими частотами
    const frequencies = [196.00, 220.00, 246.94]; // G3, A3, B3 - более низкие и грубые
    
    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sawtooth'; // Резкий, грубый звук
      
      const delay = index * 0.01; // Меньше задержки для более резкого звучания
      const duration = 0.3;
      
      // Более резкое начало и затухание
      gainNode.gain.setValueAtTime(0.25, now + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + delay + duration);
      
      oscillator.start(now + delay);
      oscillator.stop(now + delay + duration);
    });
    
  } catch (error) {
    console.warn('Не удалось воспроизвести звук:', error);
  }
}

