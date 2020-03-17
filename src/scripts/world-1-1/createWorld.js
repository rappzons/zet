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
        this.matter.add.image(this.game.canvas.width / 2, this.game.canvas.height, 'ground').setStatic(true);
        console.log("Created World 1-1, adding player");

        this.player = Object.create(Player);
        this.player.init(this);

        this.matter.world.on('collisionstart', function (event) {

            var pairs = event.pairs;

            for (var i = 0; i < pairs.length; i++) {
                var bodyA = pairs[i].bodyA;
                var bodyB = pairs[i].bodyB;

                console.log("bodya : ", bodyA.zData.type);
                console.log("bodyb : ", bodyB.zData.type);
//Force here can be used to detect angle. force = {x: 0, y: 0.2} means hit from below...
                console.log("bodyA force : ", bodyA.force);
                console.log("bodyB force : ", bodyB.force);

            }

        });

    }

    update() {
       this.player.onGameUpdate(this);
    }

}