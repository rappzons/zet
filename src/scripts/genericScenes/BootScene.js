import {Scene} from 'phaser'
import level_1_1 from '../world-1-1/createWorld';

export default class BootScene extends Scene {
    constructor() {
        super({
            key: 'boot',
            active: true
        });
        this.loadingImage = null;
        this.clickHandler.bind(this);
    }

    preload() {
        this.load.image('bar', './assets/loading.png');
    }

    create() {
        this.loadingImage = this.add.image((this.game.canvas.width / 2) ,300,'bar');
        this.loadingImage.setInteractive();
        this.loadingImage.on('pointerup', this.clickHandler, this);
    }

    clickHandler() {
        console.log("logo cliecked!");
        this.scene.add('level-1-1',level_1_1, true, { x: 0, y: 0 });
        this.scene.remove(this);
    }

    update() {
        const w2 = this.loadingImage.width / 2;
        this.loadingImage.x = this.loadingImage.x + 5;

        if(this.loadingImage.x > (this.game.canvas.width + w2 )) {
            this.loadingImage.x = 0 - w2;
        }
    }
}