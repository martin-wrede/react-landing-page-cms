import React, { useEffect, useState } from 'react';

import contentDe from './data/content-de.json';
import contentEn from './data/content-en.json';

const Context = React.createContext();

const LANGUAGE_CONFIG = 'both'; // Options: 'de', 'en', 'both'

function ContextProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (LANGUAGE_CONFIG === 'de') return 'de';
    if (LANGUAGE_CONFIG === 'en') return 'en';

    const saved = localStorage.getItem("lang");
    if (!saved) {
      localStorage.setItem("lang", "de");
      return "de";
    }
    return saved;
  });

  const [data, setData] = useState(language === 'de' ? contentDe : contentEn);


  // Function to change language (can be used in a button etc.)
  const changeLanguage = (lang) => {
    if (LANGUAGE_CONFIG !== 'both') return;
    setLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  useEffect(() => {
    setData(language === 'de' ? contentDe : contentEn);
  }, [language]);

  const showSwitch = LANGUAGE_CONFIG === 'both';

  return (
    <Context.Provider value={{ data, language, changeLanguage, showSwitch }}>
      {children}
    </Context.Provider>
  );
}

export { Context, ContextProvider };