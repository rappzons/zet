const AdventureGuy = {
    spriteSheet: './assets/sprites/adventure-player.png',
    width: 50,
    height: 37,
    hitBoxWidth: 18,
    hitBoxHeight: 30,
    totalFrames: 109,
    friction: 0.08,
    frictionAir: 0.001,
    mass: 40,
    bounce: 0.015,
    maxSpeed: 8,
    jumpForce: 1.7,
    accelerationForce: 0.067,
    accelerationForceAir: 0.015,
    scale: 2,
    minTimeBetweenJumpsMs: 700,

    // TODO: put all different attacks into an array of generic attack-objects. Should perhaps also put the animation here?
    meleeAttack: {
        width: 18,
        height: 20,
        damage: 35,
        thrustForce: 0.015,
        // Which animation key should trigger the damage
        animationKey: 50,
        types: ['slash', 'melee'],
    },


    createAnimations: function (gameWorld) {

        const animations =
            [
                {
                    key: 'still',
                    frames: gameWorld.anims.generateFrameNumbers('player', {start: 0, end: 1}),
                    yoyo: true,
                    frameRate: 1,
                    repeatDelay: 3000,
                    delay: 1000,
                    repeat: -1
                },
                {
                    key: 'running',
                    frames: gameWorld.anims.generateFrameNumbers('player', {start: 8, end: 13}),
                    frameRate: 10,
                    repeat: -1
                },
                {
                    key: 'in-air-up',
                    frames: gameWorld.anims.generateFrameNumbers('player', {start: 16, end: 18}),
                    repeat: -1,
                },
                {
                    key: 'in-air-falling',
                    frames: gameWorld.anims.generateFrameNumbers('player', {start: 22, end: 23}),
                    repeat: -1,
                },
                {
                    key: 'melee-attack',
                    frames: gameWorld.anims.generateFrameNumbers('player', {start: 48, end: 52}),
                    frameRate: 14,
                    repeat: 0,
                }
            ];

        return animations;
    },
};

const chooseCharacters = function (characterId) {

    switch (characterId) {
        case 'adventure-guy':
        default:
            return AdventureGuy;
    }

};


export default chooseCharacters;