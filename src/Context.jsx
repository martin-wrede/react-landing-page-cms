import React, { useEffect, useState } from 'react';

const Context = React.createContext();

// Every folder src/data/projectN/ is one landing page, selected with ?project=N.
const contentFiles = import.meta.glob('./data/project*/content-*.json', { eager: true, import: 'default' });

const DEFAULT_PROJECT = '0';

const getContent = (project, lang) => contentFiles[`./data/project${project}/content-${lang}.json`];

function getProject() {
  const requested = new URLSearchParams(window.location.search).get('project') ?? DEFAULT_PROJECT;
  if (getContent(requested, 'de') || getContent(requested, 'en')) {
    return requested;
  }
  console.warn(`Project "${requested}" not found in src/data/, showing project${DEFAULT_PROJECT}.`);
  return DEFAULT_PROJECT;
}

const project = getProject();

// The language mode follows the files in the project folder:
// only content-de.json -> DE, only content-en.json -> EN, both -> BI (bilingual, with switch).
const content = {
  de: getContent(project, 'de'),
  en: getContent(project, 'en'),
};
const availableLanguages = Object.keys(content).filter((lang) => content[lang]);
const languageMode = availableLanguages.length > 1 ? 'BI' : availableLanguages[0].toUpperCase();

// Optional ?lang=de / ?lang=en (case-insensitive), only used if the project has that language.
const urlLanguage = new URLSearchParams(window.location.search).get('lang')?.toLowerCase();
if (urlLanguage && !availableLanguages.includes(urlLanguage)) {
  console.warn(`Language "${urlLanguage}" not available in project${project}, using ${availableLanguages.join('/')}.`);
}

function ContextProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (languageMode !== 'BI') return availableLanguages[0];
    if (availableLanguages.includes(urlLanguage)) return urlLanguage;

    const saved = localStorage.getItem("lang");
    return availableLanguages.includes(saved) ? saved : 'de';
  });

  // Function to change language (used by the switch buttons in the header)
  const changeLanguage = (lang) => {
    if (!availableLanguages.includes(lang)) return;
    setLanguage(lang);
    localStorage.setItem("lang", lang);

    // Keep ?lang in the address bar in sync, so a reload shows the chosen language
    const url = new URL(window.location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', lang);
      window.history.replaceState(null, '', url);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const data = content[language];
  const showSwitch = languageMode === 'BI';

  return (
    <Context.Provider value={{ data, language, changeLanguage, showSwitch, project, languageMode }}>
      {children}
    </Context.Provider>
  );
}

export { Context, ContextProvider };
