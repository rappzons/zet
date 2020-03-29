import {Scene} from "phaser";
import Player from "../player/player";
import chooseCharacters from "../player/characters";
import {random} from '../utils';

const playerCharacter = chooseCharacters('adventure-guy');

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

        // TODO: would be nice to let the player actually pre-load this...
        this.load.spritesheet('player',
            playerCharacter.spriteSheet,
            {frameWidth: playerCharacter.width, frameHeight: playerCharacter.height},null, playerCharacter.totalFrames
        );
    }

    create() {

        this.matter.world.setBounds(0,-500,1600,1300);

        this.add.tileSprite(800, 700, 1600, 160, 'background');

        this.createGround('stone_ground', this.game.canvas.width/2, 796, this.game.canvas.width, 21);

        const objects = random(10, 20);
       for(var i=0; i<objects; i++) {
            this.createGround('stone_ground', random(0,this.game.canvas.width),random(200,this.game.canvas.height-100), 48 * random(1,10), 21);
       }

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

    createGround(image, x,y,w,h) {

        const ground = this.add.tileSprite(x, y, w,h, image);

        this.matter.add.gameObject(ground,{
            isStatic: true,
            render: {
                sprite: {
                    yOffset: 0.25
                }
            }
        }).setStatic(true);

        ground.body.ztype =  ['dead-object'];

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