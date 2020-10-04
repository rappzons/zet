export default function ObjectFactory(gameEngine) {


    // Then return factory methods. Referenced by _
    return {
        _: {
            preLoad: () => {

                gameEngine.load.spritesheet('virus_ball',
                    './assets/sprites/virus_ball_multi.png',
                    {frameWidth: 32, frameHeight: 32});

                gameEngine.load.spritesheet('blue_demon',
                    './assets/sprites/enemies/blue-demon/demon-idle.png',
                    {frameWidth: 160, frameHeight: 144});

                gameEngine.load.spritesheet('blue_slime',
                    './assets/sprites/enemies/blue-slime.png',
                    {frameWidth: 32, frameHeight: 25});

            },

            load: () => {

                // load all animations
                const animations =
                    [
                        {
                            key: 'virus-ball-healthy',
                            frames: gameEngine.anims.generateFrameNumbers('virus_ball', {start: 0, end: 0}),
                            repeat: 0
                        },
                        {
                            key: 'virus-ball-damaged',
                            frames: gameEngine.anims.generateFrameNumbers('virus_ball', {start: 1, end: 1}),
                            repeat: 0
                        },
                        {
                            key: 'virus-ball-destroy',
                            frames: gameEngine.anims.generateFrameNumbers('virus_ball', {start: 1, end: 5}),
                            frameRate: 15,
                            repeat: 0,
                            delay: 100,
                        },
                        {
                            key: 'blue-slime-idle',
                            frames: gameEngine.anims.generateFrameNumbers('blue_slime', {start: 0, end: 3}),
                            repeat: -1,
                            frameRate: 7
                        },
                        {
                            key: 'blue-slime-moving',
                            frames: gameEngine.anims.generateFrameNumbers('blue_slime', {start: 4, end: 7}),
                            repeat: -1,
                            frameRate: 7
                        },
                        {
                            key: 'blue-slime-attacking',
                            frames: gameEngine.anims.generateFrameNumbers('blue_slime', {start: 8, end: 11}),
                            repeat: 0,
                            frameRate: 7
                        },
                        {
                            key: 'blue-slime-hurt',
                            frames: gameEngine.anims.generateFrameNumbers('blue_slime', {start: 12, end: 15}),
                            repeat: 0,
                            frameRate: 7
                        },
                        {
                            key: 'blue-slime-destroy',
                            frames: gameEngine.anims.generateFrameNumbers('blue_slime', {start: 16, end: 19}),
                            repeat: 0,
                            frameRate: 7
                        },
                        {
                            key: 'blue-slime-dead',
                            frames: gameEngine.anims.generateFrameNumbers('blue_slime', {start: 20, end: 20}),
                            repeat: -1,
                            frameRate: 7
                        },
                        {
                            key: 'blue-demon-idle',
                            frames: gameEngine.anims.generateFrameNumbers('blue_demon', {start: 0, end: 5}),
                            repeat: -1,
                            frameRate: 7

                        },
                    ];

                animations.forEach((a) => gameEngine.anims.create(a));
            },

            createInteractiveBall: (x, y, radius, imageKey, health) => {

                const ball = gameEngine.matter.add.sprite(x, y, 'virus_ball', null, {isStatic: true});

                ball.setCircle(radius);

                ball.anims.play('virus-ball-healthy', true);

                ball.on('animationcomplete', (animation, frame) => {
                    if (animation.key === 'virus-ball-destroy') {
                        ball.destroy();
                    }
                }, this);


                ball.body.zData = {
                    zType: ['dead-object', 'melee-vulnerable'],
                    zHealth: health,
                    // Handle onDamage
                    onDamage: (damageData) => {

                        console.log("Ball got damage. ", damageData, ball.body.zData.zHealth);

                        if (ball.body.zData.zHealth < 0) {
                            // Trigger death animation and the listener above will call destroy when finished
                            ball.anims.play('virus-ball-destroy', true);
                        } else {
                            ball.anims.play('virus-ball-damaged', true);
                        }

                        ball.body.zData.zHealth = ball.body.zData.zHealth - damageData.damage;



                        // Got damaged by a thrust force, apply it
                        if (damageData.angle && damageData.thrustForce) {
                            if (damageData.angle < 180) {
                                ball.angle = damageData.angle;
                                ball.thrustBack(damageData.thrustForce);
                            } else {
                                ball.angle = damageData.angle;
                                ball.thrust(damageData.thrustForce);
                            }
                        }
                    }
                };

                return ball;
            },

            spawnBlueSlime: (x, y, health) => {

                const blue_slime = gameEngine.matter.add.sprite(x, y, 'blue_slime', null, {isStatic: true});

                console.log("Spawning blue slime at ",x, y);

                blue_slime.setRectangle(25,15);
                blue_slime.anims.play('blue-slime-idle', true);

                blue_slime.on('animationcomplete', (animation, frame) => {
                    if (animation.key === 'blue-slime-destroy') {
                        blue_slime.destroy();
                    }
                }, this);


                blue_slime.body.zData = {
                    zType: ['dead-object', 'melee-vulnerable'],
                    zHealth: health,
                    // Handle onDamage
                    onDamage: (damageData) => {

                        console.log("Blue Slime got damage. ", damageData, blue_slime.body.zData.zHealth);

                        if (blue_slime.body.zData.zHealth < 0) {
                            // Trigger death animation and the listener above will call destroy when finished
                            blue_slime.anims.play('blue-slime-destroy', true);
                        } else {
                            blue_slime.anims.play('blue-slime-hurt', true);
                        }

                        blue_slime.body.zData.zHealth = blue_slime.body.zData.zHealth - damageData.damage;



                        // Got damaged by a thrust force, apply it
                        if (damageData.angle && damageData.thrustForce) {
                            if (damageData.angle < 180) {
                                blue_slime.angle = damageData.angle;
                                blue_slime.thrustBack(damageData.thrustForce);
                            } else {
                                blue_slime.angle = damageData.angle;
                                blue_slime.thrust(damageData.thrustForce);
                            }
                        }
                    }
                };

                return blue_slime;
            },

            createBlueDemon: (x, y, health) => {

                const demon = gameEngine.matter.add.sprite(x, y, 'blue_demon', null, {isStatic: true});

                demon.anims.play('blue-demon-idle', true);

                demon.on('animationcomplete-demon-destroy', (animation, frame) => {
                        demon.destroy();
                }, this);


                demon.body.zData = {
                    zType: ['melee-vulnerable', 'enemy'],
                    zHealth: health,
                    // Handle onDamage
                    onDamage: (damageData) => {

                        if (demon.body.zData.zHealth < 0) {
                            // Trigger death animation and the listener above will call destroy when finished
                            demon.anims.play('demon-destroy', true);
                        } else {
                            demon.anims.play('demon-damaged', true);
                        }

                        demon.body.zData.zHealth = demon.body.zData.zHealth - damageData.damage;

                        console.log("Blue demon got hit! Health left:", demon.body.zData.zHealth );
                        // Got damaged by a thrust force, apply it
                        if (damageData.angle && damageData.thrustForce) {
                            // blue demons are not affected by thrust force for now
                        }
                    }
                };

                return demon;
            }
        }

    }
}
