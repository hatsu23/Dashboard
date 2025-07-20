import React from 'react';

const titles = {
  fr: 'Tableau de bord',
  en: 'Dashboard'
};

function Navbar({ lang, setLang }) {
  return (
    <nav className="navbar">
      <h2>{titles[lang]}</h2>
      <div>
        <button onClick={() => setLang('fr')}>Français 🇫🇷</button>
        <button onClick={() => setLang('en')}>English 🇬🇧</button>
      </div>
    </nav>
  );
}

export default Navbar;