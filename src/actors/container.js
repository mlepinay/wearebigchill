/* Configuration for different types of containers */
var ContainerType = {
    server: {
        sprite: res.container
    },
    database: {
        sprite: res.container,
        color: cc.color(150,150,255,255),
        weight: 2,
        max_velocity_y: 50
    },
    cache: {
        sprite: res.container,
        color: cc.color(255,0,0,0),
        weight: 1,
        max_velocity_x: 150
    },
    datawarehouse: {
        sprite: res.container
        // scale: 0.4
    }
}


function Container(space, startPos, type, multiplayer) {
    if (typeof type === "undefined" || !type || !ContainerType[type]) {
        var availableTypes = [];
        for (var t in ContainerType) availableTypes.push(t);
        type = availableTypes[Math.floor(Math.random()*availableTypes.length)]
    }
    multiplayer = (typeof multiplayer === "undefined") ? 0 : multiplayer;
    var stubType = ContainerType[type]

    // CONSTANTS
    var SPRITE_RES      = stubType.sprite           || res.container;
    var ROTATION        = stubType.rotation         || 0.01;
    var ROT_SPEED       = stubType.rot_speed        || 0.04;
    var MAX_VELOCITY_X  = stubType.max_velocity_x   || 60;
    var MAX_VELOCITY_Y  = stubType.max_velocity_y   || Infinity;
    var COLOUR          = stubType.color            || new cc.color(255,255,255,255);
    var WEIGHT          = stubType.weight           || 1;
    var CONT_SCALE      = stubType.scale            || SCALE;
    var UP_FORCE        = 0.8;

    var self = this;

    var isFalling = true;

    var startFall = false;
    var pastSpeed = 0;

    self.removed = false;

    self.anormalDeath = false;

    // Initialization
    self.initialize = function() {
        self.sprite = new cc.Sprite(SPRITE_RES);
        self.sprite.attr({ scale: CONT_SCALE });

        self.bodySprite = new cc.PhysicsSprite(res.container);

        self.angle = 0;

        self.bodySize = self.bodySprite.getContentSize();
        self.bodySize.width  *= CONT_SCALE;
        self.bodySize.height *= CONT_SCALE;

        self.size = self.bodySize.width;

        var mass = 0.8*FLUID_DENSITY*self.bodySize.width*self.bodySize.height*WEIGHT;

        self.body = new cp.Body(mass, cp.momentForBox(mass, self.bodySize.width, self.bodySize.height));
        if (multiplayer == 1) {
            this.body.p = cc.p(200, startPos[1] + self.bodySize.height / 2);
        } else if (multiplayer == 2) {
            this.body.p = cc.p(600, startPos[1] + self.bodySize.height / 2);
        } else {
            this.body.p = cc.p(startPos[0], startPos[1] + self.bodySize.height / 2);
        }

        space.addBody(this.body);

        this.shape = new cp.BoxShape(this.body, self.bodySize.width, self.bodySize.height);
        this.shape.setFriction(1);
        this.shape.setCollisionType(42);

        space.addShape(this.shape);
        this.bodySprite.setBody(this.body);

        this.sprite.color = COLOUR;
        this.sprite.x = this.bodySprite.x;
        this.sprite.y = this.bodySprite.y;
    }

    self.update = function() {
        if (self.removed)
            return null

        if (WATER_HEIGHT >= (this.bodySprite.y - self.size)) {
            // self.angle += ROT_SPEED;
            // self.body.applyImpulse(cp.v(Math.cos(self.angle) * (ROTATION), Math.sin(self.angle) * ROTATION), cp.v(0, 0));
            self.body.setMass(self.body.m + 0.0001)
        } else {
            // Keep awake
            if (Math.random() < 0.2)
                this.body.applyImpulse(cp.v(0, -0.01), cp.v(0, 0));
        }

        // if (isFalling) {
        //     this.body.applyImpulse(cp.v(0, 0.5), cp.v(0, 0));
        // }
        if (isFalling && !startFall && this.body.vy != 0) {
            startFall = true;
            this.body.applyImpulse(cp.v(0, UP_FORCE), cp.v(0, 0));
            pastSpeed = this.body.vy;
        }

        if (isFalling && startFall) {
            if (pastSpeed >= this.body.vy + this.body.vy*0.2) {
                this.body.applyImpulse(cp.v(0, UP_FORCE), cp.v(0, 0));
                pastSpeed = this.body.vy;
                if (this.body.vx >= MAX_VELOCITY_X || this.body.vx <= -MAX_VELOCITY_X) {
                    if (this.body.vx > 0)
                        this.body.vx = MAX_VELOCITY_X;
                    else
                        this.body.vx = -MAX_VELOCITY_X;
                }

                if (this.body.vy >= MAX_VELOCITY_Y || this.body.vy <= -MAX_VELOCITY_Y) {
                    if (this.body.vy > 0)
                        this.body.vy = MAX_VELOCITY_Y;
                    else
                        this.body.vy = -MAX_VELOCITY_Y;
                }
            } else {
                // COLLISION
                self.containerState = "Whale";
                this.stopUserInteraction();
                return ("requireContainer");
            }
        }

        this.sprite.x = this.bodySprite.x;
        this.sprite.y = this.bodySprite.y;
        this.sprite.rotation = this.bodySprite.rotation;

        if (this.sprite.y < 0 - self.bodySize.height) {
            self.vanishFromWorld()
        }

        if (self.anormalDeath) {
            self.anormalDeath = false;
            self.stopUserInteraction();
            return ("requireContainer");
        }

        if (self.containerState == "Water" && this.sprite.y < WATER_HEIGHT - self.bodySize.height / 2)
            return "lostContainer";

        return (false);
    }

    self.moveLeft = function() {
        if (isFalling && startFall) {
            self.body.applyImpulse(cp.v(-MAX_VELOCITY_X/2, 0), cp.v(0, 0));
        }
    }
    self.moveRight = function() {
        if (isFalling && startFall) {
            self.body.applyImpulse(cp.v(MAX_VELOCITY_X/2, 0), cp.v(0, 0));
        }
    }
    self.stopMoving = function () {
        self.body.vx = 0;
    }

    self.stopUserInteraction = function() {
        // self.body.applyImpulse(cp.v(0, -UP_FORCE), cp.v(0, 0));
        // console.log("")
        self.body.vx = 0;
        isFalling = false;
    }

    self.handleWaterTouch = function() {
        if (self.containerState == "Air")
            self.anormalDeath = true;
        self.containerState = "Water";
    }

    self.deploy = function() {
        self.containerState = "Deploying"
        self.startBlinking();
    }

    self.startBlinking = function() {
        var i = 0

        var blinkFunc = setInterval(function() {
            self.sprite.setOpacity(100);
            setTimeout(function() {
                self.sprite.setOpacity(255);
            }, 250);
            i++;
            if (i >= 5) {
                self.vanishFromWorld();
                clearInterval(blinkFunc);
            }
        }, 500);
    }

    self.vanishFromWorld = function() {
        if (!self.removed) {
            self.removed = true;
            self.sprite.visible = false;
            space.removeShape(self.shape);
            space.removeBody(self.body);
        }
    }

    self.typeOfActor = "Container";

    self.containerState = "Air";

    self.initialize();
}
