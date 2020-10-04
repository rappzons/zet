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
        this.statsInfo = this.add.text(10,20,"Score: 0, Lives: 999", {font: '16px Courier', fill: '#00ff33'}).setDepth(1000);
    }

    update() {
        const worldScene = this.scene.get('level-1-1');
        if(worldScene && worldScene.player && worldScene.player.getPlayerStats ) {

            const stats = worldScene.player.getPlayerStats();
            //   health: 100,
            //         level: 1,
            //         xp: 0,
            this.statsInfo.setText(stats.STATUS.health+"/"+stats.STATUS.maxHealth + " -- LEVEL:"+stats.STATUS.level + " -- XP:"+stats.STATUS.xp + " -- State:"+stats.STATE + " -- Speed:"+stats.SPEED);
        }
    }
}