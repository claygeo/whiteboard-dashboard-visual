import { useState, useEffect } from 'react';

const Header = ({ currentShift, language }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const shiftLabels = {
    en: {
      Morning: 'Morning',
      Afternoon: 'Afternoon',
      Evening: 'Evening',
    },
    es: {
      Morning: 'Mañana',
      Afternoon: 'Tarde',
      Evening: 'Noche',
    },
  };

  const shiftText = shiftLabels[language][currentShift];

  return (
    <div
      className={`p-6 text-white text-center shadow-lg ${
        currentShift === 'Morning'
          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
          : currentShift === 'Afternoon'
            ? 'bg-gradient-to-r from-blue-400 to-blue-600'
            : 'bg-gradient-to-r from-purple-600 to-purple-800'
      }`}
    >
      <p className="text-4xl font-bold">
        {currentTime.toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
      <p className="text-3xl mt-2">
        {shiftText} Shift{' '}
        {currentShift === 'Morning'
          ? '☀️'
          : currentShift === 'Afternoon'
            ? '☁️'
            : '🌙'}
      </p>
      <p className="text-2xl mt-2">
        🕒{' '}
        {currentTime.toLocaleTimeString(language === 'en' ? 'en-US' : 'es-ES', {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true,
        })}
      </p>
    </div>
  );
};

export default Header;
