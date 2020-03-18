import Rect from './utils'
import Phaser from 'phaser'

const WORLD_CONSTANTS = {
    //If velocity goes below this value its considered to be ZERO
    MINIMUM_VELOCITY: 0.5,
    //IF a force is less than this value it is considered to be no force at all
    MINIMUM_FORCE: 0.01,
};
const STATES = {
    ON_GROUND: 'on-ground',
    STILL: 'still',
    MOVING: 'moving',
    IN_AIR: 'in-air',
    LEFT_FACING: 'left-facing',
    RIGHT_FACING: 'right-facing',

};

const PlayerConfig = {

    friction: 0.05,
    frictionAir: 0.005,
    mass: 20,
    bounce: 0.15,
    maxSpeed: 8,
    jumpForce: 0.8,
    accelerationForce: 0.05,
    debugLogStateEveryMs: 1000,
};
const Player = {

    type: ['player','character','collidable'],
    state: new Set([]),
    status: {
        health: 100,
        maxHealth: 100,
        level: 1,
        xp: 0,
    },
    cursors: {},
    physicalObject: {}, // GameEngine body/view representation

    // Callback that something hit the Player
    onCollide(collider) {

        //Check if you hit ground
        if(collider.type.includes('dead-object')) {

            // Hit something solid from below but with no side-effect
           if(this.physicalObject.body.force.y > WORLD_CONSTANTS.MINIMUM_FORCE) {

               console.log("HIT something, force:", this.physicalObject.body.angle, collider.angle);
               //Check that only feet intersects...



               this.state.add(STATES.ON_GROUND);
               this.state.delete(STATES.IN_AIR);

            }
        }
    },

    //Initialise animations and event listeners
    init(gameWorld) {



        this.physicalObject = gameWorld.matter.add.sprite(400, 100, 'dude');
        this.physicalObject.setFriction(PlayerConfig.friction);
        this.physicalObject.setFrictionAir(PlayerConfig.frictionAir);
        this.physicalObject.setFixedRotation();
        this.physicalObject.setMass(PlayerConfig.mass);
        this.physicalObject.setBounce(PlayerConfig.bounce);
        // Reference to the game world to be able to invoke callback methods on this Player Object
        this.physicalObject.body.zetParent = this;


        this.debugFeetRectangle = gameWorld.add.graphics({ fillStyle:{ color: 0xaa0000 } });


        this.debugFeetRectangle.fillRectShape(new Phaser.Geom.Rectangle(this.physicalObject.x,  this.physicalObject.y,10,10));


        this.cursors = gameWorld.input.keyboard.createCursorKeys();

        gameWorld.anims.create({
            key: 'left',
            frames: gameWorld.anims.generateFrameNumbers('dude', { start: 7, end: 10 }),
            frameRate: 10,
            repeat: -1
        });

        gameWorld.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 5 } ],
            frameRate: 20
        });

        gameWorld.anims.create({
            key: 'right',
            frames: gameWorld.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

       // if(PlayerConfig.debugLogStateEveryMs) {
        //    setInterval(() =>{gameWorld.emit('playerStatsUpdate');console.log(this.getPlayerStats())}, PlayerConfig.debugLogStateEveryMs);
        //}
    },

    onGameUpdate(gameWorld) {

        this.debugFeetRectangle.setPosition(this.physicalObject.x, this.physicalObject.y);
        //Can only move or jump if on the ground

        //TODO: left or right facing? Can perhaps determine from the actual Sprite angle...

        if(this.physicalObject.anims && this.physicalObject.anims.currentAnim) {
            switch (this.physicalObject.anims.currentAnim.key) {
                case 'left':
                    this.state.add(STATES.LEFT_FACING);
                    break;
                case 'right':
                    this.state.add(STATES.RIGHT_FACING);
                    break;
                default:
                    this.state.delete(STATES.RIGHT_FACING);
                    this.state.delete(STATES.LEFT_FACING);

            }
        }

        const onGround = gameWorld.children.list.find((obj) => {
            if(obj.body && obj.body.type && obj.body.type.includes('dead-object') && obj.body.parts) {
                return obj.body.parts.find((part) => {

                    //This will not work for moving objects!!!
                    if(!part.calcRect) {
                        part.calcRect = new Rect(part.bounds.min.x, part.bounds.min.y,
                            part.bounds.max.x - part.bounds.min.x,
                            part.bounds.max.y - part.bounds.min.y);
                    }


                    return part.calcRect.intersects(this.getFeetRectangle());
                })
            }
            return false;
        });

        if(onGround) {
            this.state.add(STATES.ON_GROUND);
            this.state.delete(STATES.IN_AIR);
        }

        const absVelocityX = Math.abs(this.getVelocity().x);
        const absVelocityY = Math.abs(this.getVelocity().y);

        if(absVelocityX > WORLD_CONSTANTS.MINIMUM_VELOCITY || absVelocityY > WORLD_CONSTANTS.MINIMUM_VELOCITY ) {
            this.state.delete(STATES.STILL);
            this.state.add(STATES.MOVING);
        }
        else {
            this.state.delete(STATES.MOVING);
            this.state.add(STATES.STILL);
        }

        //Check intersections on the "feet" if any solid object then your on the ground:
        //if(this.physicalObject.intersectPoint(this.physicalObject.x, this.physicalObject.y)) {
          //  this.state.add(STATES.ON_GROUND);
       // }

        if(this.state.has(STATES.ON_GROUND)) {

            if (this.cursors.left.isDown)
            {
                if(absVelocityX < PlayerConfig.maxSpeed) {
                    this.state.delete(STATES.RIGHT_FACING);
                    this.physicalObject.thrustBack(PlayerConfig.accelerationForce);
                }
                this.physicalObject.anims.play('left', true);
            }
            else if (this.cursors.right.isDown)
            {
                if(absVelocityX < PlayerConfig.maxSpeed) {
                    this.state.delete(STATES.LEFT_FACING);
                    this.physicalObject.thrust(PlayerConfig.accelerationForce);
                }
                this.physicalObject.anims.play('right', true);
            }
            //Player is now almost resting
            else if(absVelocityX < WORLD_CONSTANTS.MINIMUM_VELOCITY) {
                this.physicalObject.anims.play('turn');
                this.state.add(STATES.STILL);
            }

            if (this.cursors.up.isDown)
            {
                this.state.delete(STATES.ON_GROUND);
                this.state.add(STATES.IN_AIR);
                this.state.delete(STATES.STILL);
                this.physicalObject.thrustLeft(PlayerConfig.jumpForce);
            }
        }

        //TODO: this slows down/speeds up adnimation frames based on velocity, is very dependant on the graphical frames (the pics)
        this.physicalObject.anims.setTimeScale(absVelocityX / 4);
    },

    getVelocity() {
        if(this.physicalObject && this.physicalObject.body && this.physicalObject.body.velocity) {
            return this.physicalObject.body.velocity;
        }
        return {x: 0, y:0}
    },
    getPlayerStats: function() {
        return {
            STATE: [...this.state].join(","),
            STATUS: this.status,
            SPEED: "X:" + this.getVelocity().x + ",Y:"+this.getVelocity().y,
        }
    },
    getFeetRectangle() {

        return new Rect(this.physicalObject.x - (this.physicalObject.width / 2), this.physicalObject.y + (this.physicalObject.height / 2),
                this.physicalObject.width,
                this.physicalObject.height);

    }
};

export default Player;