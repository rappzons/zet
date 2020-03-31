import {Rect} from '../utils'
import chooseCharacters from "../player/characters";

const playerCharacter = chooseCharacters('adventure-guy');

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
    MELEE_ATTACKING: 'melee-attacking',

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


    meleeButtonReleased: true,
    // TODO: perhaps find a better way to prevent "jump spamming", works for now...
    lastJumpTimeStamp: 0,
    jumpButtonReleased: true,

    //Initialise animations and event listeners
    init(gameWorld) {

        this.hitBox = gameWorld.matter.bodies.rectangle(0, 0, playerCharacter.hitBoxWidth * playerCharacter.scale, playerCharacter.hitBoxHeight * playerCharacter.scale);
        this.hitBox.zetParent = this;
        // This is the feet hitbox. It determines if the player is standing on something
        this.debugFeetRectangle = gameWorld.matter.bodies.rectangle(0, (playerCharacter.hitBoxHeight / 2) * playerCharacter.scale, (playerCharacter.hitBoxWidth - 2) * playerCharacter.scale, 2 * playerCharacter.scale, {
            isSensor: true,
        });

        this.meleeAttackHitBoxRight = gameWorld.matter.bodies.rectangle(30, 0, (playerCharacter.meleeAttack.width) * playerCharacter.scale, playerCharacter.meleeAttack.height * playerCharacter.scale, {
            isSensor: true,
        });

        this.meleeAttackHitBoxLeft = gameWorld.matter.bodies.rectangle(-30, 0, (playerCharacter.meleeAttack.width) * playerCharacter.scale, playerCharacter.meleeAttack.height * playerCharacter.scale, {
            isSensor: true,
        });

        const playerParts = gameWorld.matter.body.create({
            parts: [this.hitBox, this.debugFeetRectangle, this.meleeAttackHitBoxLeft, this.meleeAttackHitBoxRight]
        });

        this.playerSprite = gameWorld.matter.add.sprite(0, 0, 'player').setScale(playerCharacter.scale);

        // Reference to the game world to be able to invoke callback methods on this Player Object
        this.playerSprite.body.zetParent = this;

        this.playerSprite.setExistingBody(playerParts);

        this.playerSprite.setOrigin(0.5, 0.6);
        this.playerSprite.setFriction(playerCharacter.friction);
        this.playerSprite.setFrictionAir(playerCharacter.frictionAir);
        this.playerSprite.setFixedRotation();
        this.playerSprite.setMass(playerCharacter.mass);
        this.playerSprite.setBounce(playerCharacter.bounce);
        this.playerSprite.setPosition(200, 110);

        this.playerSprite.on('animationcomplete', (animation, frame) => {
            //console.log("animationcomplete", window.performance.now(), frame);
            if (animation.key === 'melee-attack') {

                this.state.delete(STATES.MELEE_ATTACKING);
            }
        }, this);

        this.cursors = gameWorld.input.keyboard.createCursorKeys();

        playerCharacter.createAnimations(gameWorld).forEach((a) => {
                gameWorld.anims.create(a);
            }
        );
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

    // Callback that something hit the Player
    onCollide(collider) {

        // hit something edible
        if (collider.zData && collider.zData.zType.includes('edible')) {
            // console.log("Eating: ", collider);
            if (collider.gameObject) {
                collider.gameObject.destroy();
                this.status.xp = this.status.xp + 1;
            }
        }
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
        if (this.state.has(STATES.ON_GROUND) &&
            this.lastJumpTimeStamp < (window.performance.now() - playerCharacter.minTimeBetweenJumpsMs) && this.jumpButtonReleased) {
            this.lastJumpTimeStamp = window.performance.now();
            this.jumpButtonReleased = false;
            this.playerSprite.thrustLeft(playerCharacter.jumpForce);
        }
    },
    tryMeleeAttack: function () {
        if (this.meleeButtonReleased) {
            this.state.add(STATES.MELEE_ATTACKING);
            this.meleeButtonReleased = false;
        }
    },
    tryMove: function (inputData, direction) {
        const airborne = this.state.has(STATES.IN_AIR);

        if (inputData.absVelocityX < playerCharacter.maxSpeed) {
            direction === 'right' ?
                this.playerSprite.thrust(airborne ? playerCharacter.accelerationForceAir : playerCharacter.accelerationForce) :
                this.playerSprite.thrustBack(airborne ? playerCharacter.accelerationForceAir : playerCharacter.accelerationForce);
            this.state.delete(direction === 'right' ? STATES.LEFT_FACING : STATES.RIGHT_FACING);
            this.state.add(direction === 'right' ? STATES.RIGHT_FACING : STATES.LEFT_FACING);
            this.state.add(STATES.MOVING);
        }


    },
    /**
     * Set animation depending on player states
     */
    setPlayerAnimations: function (gameWorld, inputData) {

        // If melee attacking
        if (this.state.has(STATES.MELEE_ATTACKING)) {
            // console.log("Attack start", window.performance.now());
            this.playerSprite.anims.play('melee-attack', true);
        }
        //If airborne
        else if (this.state.has(STATES.IN_AIR)) {

            if (this.state.has(STATES.FALLING)) {
                this.playerSprite.anims.play('in-air-falling', true);
            } else {
                this.playerSprite.anims.play('in-air-up', false);
            }
        }
        //If on ground
        else if (this.state.has(STATES.ON_GROUND)) {

            if (this.state.has(STATES.MOVING)) {
                this.playerSprite.anims.play('running', true);
            } else {
                this.playerSprite.anims.play('still', true);
            }
        }

        // This is for sprite sheet that does not contain flipped images of the same animation
        this.playerSprite.flipX = this.state.has(STATES.LEFT_FACING);

        //TODO: this slows down/speeds up animation frames based on velocity, is very dependant on the graphical frames (the pics)
        if (this.state.has(STATES.MOVING) && !this.state.has(STATES.MELEE_ATTACKING)) {
            this.playerSprite.anims.setTimeScale(inputData.absVelocityX / 4);
        } else {
            this.playerSprite.anims.setTimeScale(1);
        }
    },

    // Process user input (move, jump, shoot etc etc)
    processInput: function (inputData) {

        if (this.cursors.space.isDown) {
            this.tryMeleeAttack();
        } else if (this.cursors.left.isDown) {
            this.tryMove(inputData, 'left');
        } else if (this.cursors.right.isDown) {
            this.tryMove(inputData, 'right');
        }

        if (this.cursors.up.isDown) {
            this.tryJump();
        }

        this.jumpButtonReleased = this.cursors.up.isUp;
        this.meleeButtonReleased = this.cursors.space.isUp;
    },

    /**
     * Set current state of the player according to what the player is doing before entering this method.
     *
     * Set new player states depending on what is happened to the player. "Is he moving, is he dead, is he in the air..."
     *
     * @param gameWorld
     * @param playerState
     */
    processCurrentPlayerState(gameWorld, playerState) {

        // Set "is on ground" states
        this.checkPlayerInteractions(gameWorld);

        // Check if player is moving in any direction
        if (playerState.absVelocityX > WORLD_CONSTANTS.MINIMUM_VELOCITY || playerState.absVelocityY > WORLD_CONSTANTS.MINIMUM_VELOCITY) {
            this.state.delete(STATES.STILL);
            this.state.add(STATES.MOVING);

            // Check if player is airborne and if he is falling or not
            if (this.getVelocity().y > WORLD_CONSTANTS.MINIMUM_VELOCITY && this.state.has(STATES.IN_AIR)) {
                this.state.add(STATES.FALLING);
            } else {
                this.state.delete(STATES.FALLING);
            }
        }
        // Player is not moving
        else {
            this.state.delete(STATES.MOVING);
            if (!this.state.has(STATES.IN_AIR)) {
                this.state.add(STATES.STILL);
            }
        }
    },

    /**
     * Check player interactions such as:
     *  - If the player feet is touching something
     *  - If any player action is affecting any world object, like a sword hitting an enemy
     */
    checkPlayerInteractions: function (gameWorld) {
        const interActionStatus = {
            onGround: false,
        };

        gameWorld.children.list.forEach((obj) => {

            if (obj.body && obj.body.zData && obj.body.parts) {

                // Check if feet is touching ground

                obj.body.parts.forEach((part) => {

                    part.calcRect = new Rect(part.bounds.min.x, part.bounds.min.y,
                            part.bounds.max.x - part.bounds.min.x,
                            part.bounds.max.y - part.bounds.min.y);

                    // Check if feet is touching ground
                    if (obj.body.zData.zType.includes('dead-object') && part.calcRect.intersectsBounds(this.debugFeetRectangle.bounds)) {
                        interActionStatus.onGround = true;
                    }

                    // check if player has whacked anything vulnerable
                    if (this.state.has(STATES.MELEE_ATTACKING) && obj.body.zData.zType.includes('meele-vulnerable')) {

                        const hit = this.state.has(STATES.LEFT_FACING) ? part.calcRect.intersectsBounds(this.meleeAttackHitBoxLeft.bounds) : part.calcRect.intersectsBounds(this.meleeAttackHitBoxRight.bounds);

                        if(hit) {
                            //console.log("Player whacked: ", part, obj);
                            this.status.xp = this.status.xp + 1;

                            const damageData = {
                                thrustForce: 0.002,
                                damage: 10,
                                types: ['slash','melee']
                            };
                            if(this.state.has(STATES.LEFT_FACING)) {
                                damageData.angle = 225;
                            }
                            else {
                                damageData.angle = 135;
                            }

                            // Tell the victim that it has been damaged
                            if(obj.body.zData.onDamage){
                                obj.body.zData.onDamage(damageData);
                            }

                        }

                    }


                })
            }
        });

        if (interActionStatus.onGround) {
            this.state.add(STATES.ON_GROUND);
            this.state.delete(STATES.IN_AIR)
        } else {
            this.state.delete(STATES.ON_GROUND);
            this.state.add(STATES.IN_AIR)
        }

        return interActionStatus;
    },


};

export default Player;