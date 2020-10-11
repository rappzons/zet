import {Scene} from "phaser";
import Player from "../player/player";
import chooseCharacters from "../player/characters";
import {random} from '../utils';
import ObjectFactory from '../objectFactory';

const playerCharacter = chooseCharacters('adventure-guy');

export default class Level1_1Scene extends Scene {
    constructor() {
        super({
            key: 'level-1-1',
            active: true
        });

        this.objectFactory = ObjectFactory(this);
    }

    preload() {
        console.log("Loading World 1-1 resources");
        this.load.audio('sword-swing', './assets/sounds/sword-swing-3.mp3');
        this.load.audio('hit-ball', './assets/sounds/hit-slime.wav');

        this.load.image('ground', './assets/world/grounds/debug_ground.png');
        this.load.image('tileset', './assets/world/grounds/old-dark-castle-interior-tileset.png');
        this.load.image('stone_ground', './assets/world/grounds/stone_ground.png');
        this.load.image('background', './assets/world/grounds/background_1.png');


        this.objectFactory._.preLoad();

        // TODO: would be nice to let the player actually pre-load this...
        this.load.spritesheet('player',
            playerCharacter.spriteSheet,
            {frameWidth: playerCharacter.width, frameHeight: playerCharacter.height},null, playerCharacter.totalFrames
        );
    }

    create() {

        this.objectFactory._.load();

        this.matter.world.setBounds(0,-500,1600,1300);

        this.add.tileSprite(800, 700, 1600, 160, 'background');

        this.createGround('stone_ground', this.game.canvas.width/2, 796, this.game.canvas.width, 21);

        console.log("sound: ", this.sound)
        this.sound.audioPlayDelay = 0.0;

        this.fxFactory = {

            // could use Phasers built in sound manager...
            //'hit-ball' : this.sound.add('sword-swing'),
            'sword-swing' : new Audio('./assets/sounds/sword-swing-3.mp3'),
            'hit-ball' : new Audio('./assets/sounds/hit-ball.wav'),
            //'sword-swing' : this.sound.add('sword-swing'),
        }

        const objects = random(5, 10);
       for(var i=0; i<objects; i++) {
      //      this.createGround('stone_ground', random(0,this.game.canvas.width) - 200 ,random(300,this.game.canvas.height-200), 48 * random(1,10), 21);
       }

        this.createGround('stone_ground', 300 , 750, 100, 120);

        this.createGround('stone_ground', 500 , 650, 80, 40);

        this.createGround('stone_ground', 700 , 750, 100, 120);

        console.log("Created World 1-1, starting to spawn virus balls");
        this.time.addEvent({ delay: 3250, callback: this.createBall.bind(this), callbackScope: this, repeat: 4012 });


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

        console.log("Created World 1-1, adding a static enemy");
        this.objectFactory._.createStaticEnemy(this.game.canvas.width - 150, this.game.canvas.height-200,'test_dummy', 500);
    }

    createGround(image, x,y,w,h) {

        const ground = this.add.tileSprite(x, y, w,h, image);

        this.matter.add.gameObject(ground,{
            isStatic: true,
            render: {
                sprite: {
                    //yOffset: 0.1
                }
            }
        }).setStatic(true);

        ground.body.zData = {
            zType: ['dead-object'],
        };

        return ground;
    }

    createBall() {
        if(random(1,3) === 1) {
            return this.objectFactory._.spawnBlueSlime(random(100, 800), -100, 10);
       }

        return this.objectFactory._.createInteractiveBall(random(100,800),-100, 10,'virus_ball', 100);
    }

    update() {
       this.player.onGameUpdate(this);

       if(this.children) {
           this.children.list.forEach((obj) => {
               if (obj?.body?.zData?.onGameUpdate) {
                   obj.body.zData.onGameUpdate(this);
               }
           });
       }
    }

}