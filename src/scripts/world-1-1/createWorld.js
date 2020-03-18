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

        this.load.image('virus_ball', './assets/sprites/virus_ball.png');

        this.load.image('debug', './assets/sprites/debug.png');

        this.load.spritesheet('dude',
            './assets/sprites/pacman_28x28.png',
            {frameWidth: 28, frameHeight: 28}
        );
    }

    create() {


        this.createGround(this.matter, (this.game.canvas.width / 4) - 100, this.game.canvas.height, (this.game.canvas.width /2),100);
        this.createGround(this.matter, (this.game.canvas.width * 0.75) + 100, this.game.canvas.height, (this.game.canvas.width /2) - 100,100);

        const objects = random(1, 20);
        for(var i=0; i<objects; i++) {
            this.createGround(this.matter, random(0,this.game.canvas.width),random(200,this.game.canvas.height-100), random(20,200), random(20,200));
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

    createGround(matter, x,y,w,h) {
        const ground = matter.add.image(x, y, 'ground').setStatic(true);
        ground.displayHeight = h;
        ground.displayWidth = w;
        ground.tint = '0xeeee11';
        ground.body.type = ['dead-object'];
    }

    createBall() {

        var ball = this.add.image(random(100,800), -100, 'virus_ball', null, { isStatic: true });
        ball.setCircle(10);
        ball.body.type = ['dead-object','edible'];
        //ball.body.id = random(0,10000);
    }
    update() {
       this.player.onGameUpdate(this);
    }

}