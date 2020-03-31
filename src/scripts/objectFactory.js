export default function ObjectFactory(gameEngine)
{

    // Init everything:
    const animations =
        [
            {
                key: 'virus-ball-healthy',
                frames: gameEngine.anims.generateFrameNumbers('virus_ball', {start: 1, end: 1}),
                repeat: 0
            },
            {
                key: 'virus-ball-damaged',
                frames: gameEngine.anims.generateFrameNumbers('virus_ball', {start: 0, end: 0}),
                repeat: 0
            },
        ];

    animations.forEach((a) => gameEngine.anims.create(a));

    // Then return factory methods
    return {
        createInteractiveBall: (x, y, radius, imageKey, health) => {

            const ball = gameEngine.matter.add.sprite(x, y, 'virus_ball', null, {isStatic: true});

            ball.setCircle(radius);

            ball.anims.play('virus-ball-healthy', true);

            ball.body.zData = {
                zType: ['dead-object', 'meele-vulnerable'],
                zHealth: health,
                zScaleFactor: 1 / health,
                // Handle onDamage
                onDamage: (damageData) => {

                    if(ball.body.zData.zHealth < 0) {
                        //TODO: trigger death animation and _then_ do destroy.
                        ball.destroy();
                        return;
                    }

                    ball.body.zData.zHealth = ball.body.zData.zHealth  - damageData.damage;

                    ball.anims.play('virus-ball-damaged', true);

                    ball.setScale(Math.max(0.90, ball.body.zData.zHealth * ball.body.zData.zScaleFactor));

                    if(damageData.angle) {
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
