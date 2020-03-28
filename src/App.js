import React, { useEffect } from 'react';
import newGame from './scripts/newGame';
import BootScene from './scripts/genericScenes/BootScene';
import StatsScene from './scripts/genericScenes/StatsScene';


import './App.css';

function App() {

  useEffect(() => {
    newGame("main-canvas", [StatsScene, BootScene]);
  }, []);

  return (<div id="main-canvas">
      </div>);
}

export default App;
