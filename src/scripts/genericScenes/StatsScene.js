import {Scene} from 'phaser'

export default class StatsScene extends Scene {
    constructor() {
        super({
            key: 'stats',
            active: true,
        });
    }

    preload() {
    }

    create() {
        this.add.text(10,20,"Score: 0, Lives: 999", {font: '16px Courier', fill: '#00ff33'}).setDepth(1000);
    }

    update() {
    }
}