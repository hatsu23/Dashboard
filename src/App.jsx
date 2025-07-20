import React, { useState } from 'react';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [lang, setLang] = useState('fr');

  return (
    <div className="App">
      <Navbar lang={lang} setLang={setLang} />
      <Dashboard lang={lang} />
    </div>
  );
}

export default App;