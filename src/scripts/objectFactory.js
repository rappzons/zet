export default function ObjectFactory(gameEngine)
{

    // Init everything:
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
        ];

    animations.forEach((a) => gameEngine.anims.create(a));

    // Then return factory methods
    return {
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
                zType: ['dead-object', 'meele-vulnerable'],
                zHealth: health,
                // Handle onDamage
                onDamage: (damageData) => {

                    if(ball.body.zData.zHealth < 0) {
                        // Trigger death animation and the listener above will call destroy when finished
                        ball.anims.play('virus-ball-destroy', true);
                    } else {
                        ball.anims.play('virus-ball-damaged', true);
                    }

                    ball.body.zData.zHealth = ball.body.zData.zHealth  - damageData.damage;

                    // Got damaged by a thrust force, apply it
                    if(damageData.angle && damageData.thrustForce) {
                        if(damageData.angle < 180) {
                            ball.angle = damageData.angle;
                            ball.thrustBack(damageData.thrustForce);
                        }
                         else {
                            ball.angle = damageData.angle;
                            ball.thrust(damageData.thrustForce);
                        }
                    }
                }
            };

            return ball;
        }
    }

}
