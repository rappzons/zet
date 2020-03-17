
const level = {

    preload: (gameWorld) => {
        gameWorld.load.setBaseURL('https://labs.phaser.io');
        gameWorld.load.image('platform', 'assets/sprites/platform.png');
    },
    create: (gameWorld) => {
        gameWorld.matter.add.image(700, 550, 'platform', null, {restitution: 0.4, isStatic: true});
    }
};

export default level;
