import {Scene} from "phaser";
import Player from "../player";
import {random} from '../utils';

export default class Level1_1Scene extends Scene {
    constructor() {
        super({
            key: 'level-1-1',
            active: true
        });

    }

    preload() {
        console.log("Loading World 1-1 resources");
        this.load.image('ground', './assets/world/grounds/debug_ground.png');
        this.load.image('tileset', './assets/world/grounds/old-dark-castle-interior-tileset.png');
        this.load.image('stone_ground', './assets/world/grounds/stone_ground.png');
        this.load.image('background', './assets/world/grounds/background_1.png');

        this.load.image('virus_ball', './assets/sprites/virus_ball.png');

        this.load.image('debug', './assets/sprites/debug.png');

        this.load.spritesheet('player',
            './assets/sprites/adventure-player.png',
            {frameWidth: 50, frameHeight: 37},null, 109
        );
    }

    create() {

        this.matter.world.setBounds(0,-500,1600,1300);

        this.add.tileSprite(800, 700, 1600, 160, 'background');

        const groundSprite = this.add.tileSprite(800, 796, 1600, 21, 'stone_ground');

        this.matter.add.gameObject(groundSprite,{
            isStatic: true,
            render: {
                sprite: {
                    yOffset: 0.25
                }
            }
        }).setStatic(true);

        groundSprite.body.ztype =  ['dead-object'];


        /*
        const groundRectangle = this.matter.bodies.rectangle(800, 780, 1600, 18, {
            render: {
                sprite: groundSprite

            },
            isStatic: true,

        });*/

       // groundRectangle.ztype = ['dead-object'];

        //this.matter.world.add(groundRectangle);

        //groundRectangle.ztype = ['dead-object'];




     //   this.createGround(this.matter, 'grnd1',156/2, this.game.canvas.height - 11,156, 22).
       // setExistingBody(groundRectangle);



      //  this.createGround(this.matter, 'grnd2',156*1.5, this.game.canvas.height - 11,156, 22);
       // this.createGround(this.matter, 'grnd1',156*2.5, this.game.canvas.height - 11,156, 22);
       // this.createGround(this.matter, 'grnd2',156*3.5, this.game.canvas.height - 11,156, 22);


    //    this.createGround(this.matter, (this.game.canvas.width / 4) - 100, this.game.canvas.height, (this.game.canvas.width /2),100);
      //  this.createGround(this.matter, (this.game.canvas.width * 0.75) + 100, this.game.canvas.height, (this.game.canvas.width /2) - 100,100);

      //  const objects = random(1, 20);
      //  for(var i=0; i<objects; i++) {
      //      this.createGround(this.matter, random(0,this.game.canvas.width),random(200,this.game.canvas.height-100), random(20,200), random(20,200));
        //}

        this.time.addEvent({ delay: 3250, callback: this.createBall.bind(this.matter), callbackScope: this, repeat: 4012 });


        console.log("Created World 1-1, adding player");

        this.player = Object.create(Player);
        this.player.init(this);

        this.matter.world.on('collisionstart', function (event) {
            var pairs = event.pairs;

            pairs.forEach((pair) => {

                const bodyA = pair.bodyA;
                const bodyB = pair.bodyB;

                if(bodyA.zetParent && bodyA.zetParent.type.includes('collidable')) {
                    bodyA.zetParent.onCollide(bodyB);
                }
                else if(bodyB.zetParent && bodyB.zetParent.type.includes('collidable')) {
                    bodyB.zetParent.onCollide(bodyA);
                }
            });
        });
    }

    createGround(matter, image, x,y,w,h) {
        const ground = matter.add.sprite(x, y, image).setStatic(true);
        ground.displayHeight = h;
        ground.displayWidth = w;
        ground.tint = '0xeeee11';
        ground.body.ztype = ['dead-object'];

        return ground;
    }

    createBall() {

        var ball = this.add.image(random(100,800), -100, 'virus_ball', null, { isStatic: true });
        ball.setCircle(10);
        ball.body.ztype = ['dead-object','edible'];
        //ball.body.id = random(0,10000);
    }
    update() {
       this.player.onGameUpdate(this);
    }

}