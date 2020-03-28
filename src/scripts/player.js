import {random, Rect} from './utils'

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
    FALLING: 'falling',

};

const PlayerConfig = {
    friction: 0.08,
    frictionAir: 0.001,
    mass: 40,
    bounce: 0.05,
    maxSpeed: 8,
    jumpForce: 0.7,
    accelerationForce: 0.07,
    accelerationForceAir: 0.01,
    debugLogStateEveryMs: 1000,
    scale: 2,
    minTimeBetweenJumpsMs: 400,
};
const Player = {

    type: ['player', 'character', 'collidable'],
    state: new Set([]),
    status: {
        health: 100,
        maxHealth: 100,
        level: 1,
        xp: 0,
    },
    cursors: {},
    playerSprite: {}, // GameEngine sprite representation
    hitBox: {}, // GameEngine physics
    lastJumpTimeStamp: 0,

    // Callback that something hit the Player
    onCollide(collider) {

        // hit something edible
        if (collider.ztype && collider.ztype.includes('edible')) {
            console.log("Eating: ", collider);
            if (collider.gameObject) {
                collider.gameObject.destroy();
                this.status.xp = this.status.xp + 1;
            }
        }
    },

    //Initialise animations and event listeners
    init(gameWorld) {

        this.hitBox = gameWorld.matter.bodies.rectangle(0, 0, 18 * PlayerConfig.scale, 30 *  PlayerConfig.scale);
        this.hitBox.zetParent = this;
        this.debugFeetRectangle = gameWorld.matter.bodies.rectangle(0, 15 *  PlayerConfig.scale, 10 *  PlayerConfig.scale, 2 *  PlayerConfig.scale, {
            isSensor: true,
        });

        const playerParts = gameWorld.matter.body.create({
            parts: [this.hitBox, this.debugFeetRectangle]
        });

        this.playerSprite = gameWorld.matter.add.sprite(0, 0, 'player').setScale(PlayerConfig.scale);

        // Reference to the game world to be able to invoke callback methods on this Player Object
        this.playerSprite.body.zetParent = this;

        this.playerSprite.setExistingBody(playerParts);

        this.playerSprite.setOrigin(0.5, 0.6);
        this.playerSprite.setFriction(PlayerConfig.friction);
        this.playerSprite.setFrictionAir(PlayerConfig.frictionAir);
        this.playerSprite.setFixedRotation();
        this.playerSprite.setMass(PlayerConfig.mass);
        this.playerSprite.setBounce(PlayerConfig.bounce);
        this.playerSprite.setPosition(200, 110);

        this.cursors = gameWorld.input.keyboard.createCursorKeys();

        gameWorld.anims.create({
            key: 'still',
            frames: gameWorld.anims.generateFrameNumbers('player', {start: 0, end: 1}),
            yoyo: true,
            frameRate: 1,
            repeatDelay: 3000,
            delay:1000,
            repeat: -1
        });

        gameWorld.anims.create({
            key: 'running',
            frames: gameWorld.anims.generateFrameNumbers('player', {start: 8, end: 13}),
            frameRate: 10,
            repeat: -1
        });

        gameWorld.anims.create({
            key: 'in-air-up',
            frames: gameWorld.anims.generateFrameNumbers('player', {start: 16, end: 18}),
            repeat: -1,
        });

        gameWorld.anims.create({
            key: 'in-air-falling',
            frames: gameWorld.anims.generateFrameNumbers('player', {start: 22, end: 23}),
            repeat: -1,
        });


        // if(PlayerConfig.debugLogStateEveryMs) {
        //    setInterval(() =>{gameWorld.emit('playerStatsUpdate');console.log(this.getPlayerStats())}, PlayerConfig.debugLogStateEveryMs);
        //}
    },

    /**
     * World tick-event
     * @param gameWorld
     */
    onGameUpdate: function (gameWorld) {

        const absVelocityX = Math.abs(this.getVelocity().x);
        const absVelocityY = Math.abs(this.getVelocity().y);

        // Order is important here, first check current state:
        this.processCurrentPlayerState(gameWorld, {absVelocityX, absVelocityY});

        // Then process any new user-input
        this.processInput({absVelocityX});

        // Then decide what the user is supposed to be looking like
        this.setPlayerAnimations(gameWorld, {absVelocityX});
    },



    getVelocity() {
        if (this.playerSprite && this.playerSprite.body && this.playerSprite.body.velocity) {
            return this.playerSprite.body.velocity;
        }
        return {x: 0, y: 0}
    },
    getPlayerStats: function () {
        return {
            STATE: [...this.state].join(","),
            STATUS: this.status,
            SPEED: "X:" + this.getVelocity().x + ",Y:" + this.getVelocity().y,
        }
    },

    tryJump: function () {
        if(this.state.has(STATES.ON_GROUND) && this.lastJumpTimeStamp < (window.performance.now() - PlayerConfig.minTimeBetweenJumpsMs)) {
            this.lastJumpTimeStamp = window.performance.now();
            this.playerSprite.thrustLeft(PlayerConfig.jumpForce);
        }
    },

    tryMove: function(inputData, direction) {
        const airborne = this.state.has(STATES.IN_AIR);

        if (inputData.absVelocityX < PlayerConfig.maxSpeed) {
                direction === 'right' ?
                    this.playerSprite.thrust(airborne ? PlayerConfig.accelerationForceAir : PlayerConfig.accelerationForce) :
                    this.playerSprite.thrustBack(airborne ? PlayerConfig.accelerationForceAir : PlayerConfig.accelerationForce);
            this.state.delete(direction === 'right' ? STATES.LEFT_FACING : STATES.RIGHT_FACING);
            this.state.add(direction === 'right' ? STATES.RIGHT_FACING : STATES.LEFT_FACING);
            this.state.add(STATES.MOVING);
        }



    },
    /**
     * Set animation depending on player states
     */
    setPlayerAnimations: function(gameWorld, inputData) {

        //If airborne
        if(this.state.has(STATES.IN_AIR)) {

            if(this.state.has(STATES.FALLING)) {
                this.playerSprite.anims.play('in-air-falling', true);
            } else {
                this.playerSprite.anims.play('in-air-up', false);
            }
        }
        //If on ground
        else if(this.state.has(STATES.ON_GROUND)) {

            if(this.state.has(STATES.MOVING)) {
                this.playerSprite.anims.play('running', true);
            } else {
                this.playerSprite.anims.play('still', true);
            }
        }

        // This is for sprite sheet that does not contain flipped images of the same animation
        this.playerSprite.flipX = this.state.has(STATES.LEFT_FACING);

        //TODO: this slows down/speeds up adnimation frames based on velocity, is very dependant on the graphical frames (the pics)
        if (this.state.has(STATES.MOVING)) {
            this.playerSprite.anims.setTimeScale(inputData.absVelocityX / 4);
        } else {
            this.playerSprite.anims.setTimeScale(1);
        }
    },

    // Process user input (move, jump, shoot etc etc)
    processInput: function(inputData) {

        if (this.cursors.left.isDown) {
           this.tryMove(inputData, 'left');
        }
        else if (this.cursors.right.isDown) {
            this.tryMove(inputData, 'right');
        }

        if (this.cursors.up.isDown) {
            this.tryJump();
        }
    },

    /**
     * Set current state of the player according to what the player is doing before entering this method.
     *
     * Set new player states depending on what is happened to the player. "Is he moving, is he dead, is he in the air..."
     *
     * @param gameWorld
     */
    processCurrentPlayerState(gameWorld, playerState) {

        // Set "is on ground" states
        this.checkOnGround(gameWorld);

        // Check if player is moving in any direction
        if (playerState.absVelocityX > WORLD_CONSTANTS.MINIMUM_VELOCITY || playerState.absVelocityY > WORLD_CONSTANTS.MINIMUM_VELOCITY) {
            this.state.delete(STATES.STILL);
            this.state.add(STATES.MOVING);

            // Check if player is airborne and if he is falling or not
            if(this.getVelocity().y > WORLD_CONSTANTS.MINIMUM_VELOCITY && this.state.has(STATES.IN_AIR)) {
                this.state.add(STATES.FALLING);
            } else {
                this.state.delete(STATES.FALLING);
            }
        }
        // Player is not moving
        else {
            this.state.delete(STATES.MOVING);
            if(!this.state.has(STATES.IN_AIR)) {
                this.state.add(STATES.STILL);
            }
        }
    },

    // Check if the player feet is touching something
    checkOnGround: function (gameWorld) {
        const onGround = gameWorld.children.list.find((obj) => {
            if (obj.body && obj.body.ztype && obj.body.ztype.includes('dead-object') && obj.body.parts) {
                return obj.body.parts.find((part) => {

                    // Optimisation done here which will not work for moving objects
                    if (!part.calcRect) {
                        part.calcRect = new Rect(part.bounds.min.x, part.bounds.min.y,
                            part.bounds.max.x - part.bounds.min.x,
                            part.bounds.max.y - part.bounds.min.y);
                    }
                    return part.calcRect.intersectsBounds(this.debugFeetRectangle.bounds);
                })
            }
            return false;
        });

        if (onGround) {
            this.state.add(STATES.ON_GROUND);
            this.state.delete(STATES.IN_AIR)
        } else {
            this.state.delete(STATES.ON_GROUND);
            this.state.add(STATES.IN_AIR)
        }
    },


};

export default Player;