
const Player = {

    type: ['player','character'],
    state: ['still'],
    status: {
        health: 100,
        lives: 3,
    },
    cursors: {},
    physicalObject: {}, // GameEngine body/view representation

    // Callback that something hit the Player
    onCollide(collider) {
        console.log("Something hit me!", collider);
    },

    //Initialise animations and event listeners
    init(gameWorld) {

        this.physicalObject = gameWorld.matter.add.sprite(400, 100, 'dude');
        this.physicalObject.setFriction(0.05);
        this.physicalObject.setFrictionAir(0.005);
        this.physicalObject.setFixedRotation();
        this.physicalObject.setMass(30);
        this.physicalObject.setBounce(0.1);

        this.cursors = gameWorld.input.keyboard.createCursorKeys();

        gameWorld.anims.create({
            key: 'left',
            frames: gameWorld.anims.generateFrameNumbers('dude', { start: 7, end: 10 }),
            frameRate: 10,
            repeat: -1
        });

        gameWorld.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 5 } ],
            frameRate: 20
        });

        gameWorld.anims.create({
            key: 'right',
            frames: gameWorld.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    },

    onGameUpdate(gameWorld) {
        if (this.cursors.left.isDown)
        {
            if(Math.abs(this.physicalObject.body.velocity.x) < 7) {
                this.physicalObject.thrustBack(0.05);
            }
            this.physicalObject.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            if(Math.abs(this.physicalObject.body.velocity.x) < 7) {
                this.physicalObject.thrust(0.05);
            }
            this.physicalObject.anims.play('right', true);
        }

        // this.player resting?
        else if(this.physicalObject.velocity.x < 0.5 && this.physicalObject.body.velocity.x > -0.5) {
            this.physicalObject.anims.play('turn');
        }


        if (this.cursors.up.isDown)
        {
            this.physicalObject.thrustLeft(0.75);
        }

        this.physicalObject.anims.setTimeScale(Math.abs(this.physicalObject.body.velocity.x) / 4);
    }

};

export default Player;