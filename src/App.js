import React, { useEffect } from 'react';
//import main from './scripts/matter';
//import main from './scripts/main';
import newGame from './scripts/newGame';
import level_1_1 from './scripts/world-1-1/createWorld';
import level_1_2 from './scripts/world-1-2/createWorld';
import BootScene from './scripts/genericScenes/BootScene';
import StatsScene from './scripts/genericScenes/StatsScene';


import './App.css';

function App() {

  useEffect(() => {

    // scenes can be used to separate game-state into smaller components. Like keeping the game score rendered in a separate Scene... and rendering a "Loading..." scene
    //before the resources of the next level is loaded...
    // https://phaser.io/phaser3/devlog/119
    // So Scenes is the way to go. To go to the next scene from an existing scene:

    //this.scene.start('playGame') where 'playGame' is the id of a scene in the game.....

    // For even more complex shit, this can be used to re-create an entire new game.

    //Ok create a game state and make sure it shows the correct scenes based on STATE. For instance:

    // NOT_STARTED, PAUSED, RUNNING, GAME_OVER...
    let game = newGame("main-canvas", [StatsScene, BootScene]);

    // how to tell if the level has loaded?

    //change to next level... works. now add player in both of them,,,
//    setTimeout(() => {
  //    game.destroy(true);
   //   game = newGame("main-canvas", level_1_2);
   // }, 5000)

  }, []);

  return (<div id="main-canvas">
      </div>);
}

export default App;
