/*
 * Initialise the Game engine and the Renderer.
 */
import Phaser from 'phaser';

const main = (parentElementId, scenes) => {

    const config = {
        type: Phaser.AUTO,
        width: 1600,
        height: 800,
        backgroundColor: '#1b1464',
        parent: parentElementId,
        physics: {
            default: 'matter',
            matter: {}
        },
        scene: scenes
    };

    function update () {

    }

    return new Phaser.Game(config);
};

export default main;

