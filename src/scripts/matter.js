import Phaser from 'phaser';

const main = (parentElementId) => {

    let cursors, player, ground, ground2;

    var config = {
        type: Phaser.AUTO,
        width: 1200,
        height: 600,
        backgroundColor: '#1b1464',
        parent: parentElementId,
        physics: {
            default: 'matter',
            matter: {}
        },
        scene: {
            preload: preload,
            create: create,
            update: update,
        }
    };

    var game = new Phaser.Game(config);

    function preload() {
        this.load.setBaseURL('https://labs.phaser.io');
        this.load.image('block', 'assets/sprites/block.png');
        this.load.image('platform', 'assets/sprites/platform.png');

        this.load.spritesheet('dude',
            './assets/sprites/pacman_28x28.png',
            { frameWidth: 28, frameHeight: 28 }
        );
    }

    function create() {
        player = this.matter.add.sprite(400, 100, 'dude');

        player.body.zData = {
            isPlayer: true
        };
        player.setFriction(0.05);
        player.setFrictionAir(0.005);
        player.setFixedRotation();
        player.setMass(30);
        player.setBounce(0.1);

        ground = this.matter.add.image(400, 550, 'platform', null, {restitution: 0.4, isStatic: true});
        ground2 = this.matter.add.image(800, 550, 'platform', null, {restitution: 0.4, isStatic: true});

        ground.body.zData = {
            isPlayer: false,
            isGrounded: false,
        };
        ground2.body.zData = {
            isPlayer: false,
            isGrounded: false,
        };

        cursors = this.input.keyboard.createCursorKeys();

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 7, end: 10 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 5 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });


        this.matter.world.on('collisionstart', function (event) {
            var pairs = event.pairs;

            for (var i = 0; i < pairs.length; i++)
            {
                var bodyA = pairs[i].bodyA;
                var bodyB = pairs[i].bodyB;

                if(bodyA.zData && bodyA.zData.isPlayer) {
                    console.log("Player, hit : ", bodyB);
                    bodyA.zData = {
                        ...bodyA.zData,
                        isGrounded: true,
                    }
                }

            }

        });
      /*  this.input.on('pointerdown', function (pointer) {

            if (pointer.y > 300) {
                block.setVelocity(0, -10);
            } else if (pointer.x < 400) {
                block.setVelocityX(-8);
            } else {
                block.setVelocityX(8);
            }

        });*/
    }

    //TODO: isGrounded doesn't really work. Need to have a way to see if the feet touches ground...
    // also extract all game-engine stuff away from this file, should only contain the game look.
    // Need to add world objects and stuff separate from this class...

    function update () {


        if (cursors.left.isDown && player.body.zData.isGrounded)
        {
            if(Math.abs(player.body.velocity.x) < 7) {
                player.thrustBack(0.05);
            }
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown && player.body.zData.isGrounded)
        {
            if(Math.abs(player.body.velocity.x) < 7) {
                player.thrust(0.05);
            }
            player.anims.play('right', true);
        }

        // player resting?
        else if(player.body.velocity.x < 0.5 && player.body.velocity.x > -0.5) {
            player.anims.play('turn');
        }


        if (cursors.up.isDown && player.body.zData.isGrounded)
        {
            player.thrustLeft(0.5);
            player.body.zData.isGrounded = false;

        }

        player.anims.setTimeScale(Math.abs(player.body.velocity.x) / 4);

    }
};

export default main;


