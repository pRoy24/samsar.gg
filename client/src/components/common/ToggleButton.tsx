import React, { useEffect, useState } from 'react';
import { useColorMode } from '../../contexts/ColorMode';

import './toggleButton.css'; // Make sure to import the CSS file

function ToggleButton() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const { toggleColorMode, colorMode } = useColorMode();

  useEffect(() => {
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    setIsDarkMode(isDarkMode);
  }, []);

  const toggleMode = () => {
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    localStorage.setItem('isDarkMode', String(!isDarkMode));

    setIsDarkMode(!isDarkMode);
    //document.body.classList.toggle('dark-mode');
    const currentDarkMode = localStorage.getItem('isDarkMode')
    console.log("Current Dark Mode: ", currentDarkMode)
    toggleColorMode();
  };
  let currentMode = isDarkMode ? 'Dark' : 'Light';

  return (
    <div>
      <div className="toggle-container" onClick={toggleMode}>
        <div className={`toggle-btn ${isDarkMode ? 'toggle-btn-dark' : ''}`}>
          <div className="toggle-circle"></div>
        </div>
      </div>
      <div className='text-xs block'>
        {currentMode} Mode
      </div>
    </div>

  );
}

export default ToggleButton;

