import {Scene} from "phaser";
import Player from "../player";


export default class Level1_1Scene extends Scene {
    constructor() {
        super({
            key: 'level-1-1',
            active: true
        });

    }

    preload() {
        console.log("Loading World 1-1 resources");
        this.load.image('ground', './assets/world/grounds/gravel_and_grass_ground.png');

        this.load.spritesheet('dude',
            './assets/sprites/pacman_28x28.png',
            {frameWidth: 28, frameHeight: 28}
        );
    }

    create() {
        const ground = this.matter.add.image(this.game.canvas.width / 2, this.game.canvas.height - 100, 'ground').setStatic(true);
        ground.displayHeight = 90;
        ground.displayWidth = this.game.canvas.width;

      /*  const ground2 = this.matter.add.image(600, 650, 'ground').setStatic(true);
        ground2.displayHeight = 100;
        ground2.displayWidth = 200;

        const ground3 = this.matter.add.image(900, 550, 'ground').setStatic(true);
        ground3.displayHeight = 150;
        ground3.displayWidth = 100;*/

        ground.body.type = ['dead-object'];
      //  ground2.body.type = ['dead-object'];

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

    update() {
       this.player.onGameUpdate(this);
    }

}