import Phaser from 'phaser';

const main = (htmlElement) =>
{
    let player, platforms, cursors, run;

    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 }
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update,
        }
    };

    const game = new Phaser.Game(config);

    function preload ()
    {
        this.load.setBaseURL('http://labs.phaser.io');

        this.load.image('sky', 'assets/demoscene/sky.png');
        this.load.image('ground', 'assets/sprites/platform.png');
        this.load.image('star', 'assets/demoscene/star.png');
        this.load.image('bomb', 'assets/sprites/bomb.png');
        this.load.spritesheet('dude',
            'assets/sprites/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    function create ()
    {
        this.add.image(400, 300, 'sky');
        this.add.image(400, 300, 'star');

        platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');


        player = this.physics.add.sprite(100, 450, 'dude');

        player.setBounce(0.2);
        player.setFrictionX(0.5);
        player.setCollideWorldBounds(true);

        player.body.setGravityY(300);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'still',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(player, platforms);

        cursors = this.input.keyboard.createCursorKeys();
    /*
        var particles = this.add.particles('red');

        var emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });*/

        //var logo = this.physics.add.image(400, 100, 'logo');

     //  logo.setVelocity(100, 2);
      //  logo.setBounce(1, 1);
       // logo.setCollideWorldBounds(true);

       // emitter.startFollow(logo);
    }

    function update () {

        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            if(!run) {
                console.log("player run!:", player);
                player.setVelocityX(500);
               // this.physics.arcade.accelerateTo(player, 100, 0, 100, 500, 200);
                run = true;
            }



            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);

            player.anims.play('still');
            run = false;
        }

        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-330);
        }

    }


    return game;

};

export default main;