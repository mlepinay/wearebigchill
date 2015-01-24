

function Container(space, startPos) {
    // CONSTANTS
    var SPRITE_RES  = res.container;
    var ROTATION    = 0.01;
    var ROT_SPEED   = 0.04;
    var MAX_VELOCITY    = 60;
    var UP_FORCE    = 0.8;

    var self = this;

    var isFalling = true;

    var startFall = false;
    var pastSpeed = 0;

    self.removed = false;

    // Initialization
    self.initialize = function() {
        self.sprite = new cc.Sprite(SPRITE_RES);
        self.sprite.attr({ scale: SCALE });

        self.bodySprite = new cc.PhysicsSprite(res.container);

        self.angle = 0;

        self.bodySize = self.bodySprite.getContentSize();
        self.bodySize.width  *= SCALE;
        self.bodySize.height *= SCALE;

        self.size = self.bodySize.width;

        var mass = 0.8*FLUID_DENSITY*self.bodySize.width*self.bodySize.height;

        self.body = new cp.Body(mass, cp.momentForBox(mass, self.bodySize.width, self.bodySize.height));
        this.body.p = cc.p(startPos[0], startPos[1]);

        space.addBody(this.body);

        this.shape = new cp.BoxShape(this.body, self.bodySize.width, self.bodySize.height);
        this.shape.setFriction(1);
        this.shape.setCollisionType(42);

        space.addShape(this.shape);
        this.bodySprite.setBody(this.body);

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
                if (this.body.vx >= MAX_VELOCITY || this.body.vx <= -MAX_VELOCITY) {
                    if (this.body.vx > 0)
                        this.body.vx = MAX_VELOCITY;
                    else
                        this.body.vx = -MAX_VELOCITY;
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

        if (self.containerState == "Water")
            return "lostContainer";

        return (false);
    }

    self.moveLeft = function() {
        if (isFalling && startFall) {
            self.body.applyImpulse(cp.v(-MAX_VELOCITY/2, 0), cp.v(0, 0));
        }
    }
    self.moveRight = function() {
        if (isFalling && startFall) {
            self.body.applyImpulse(cp.v(MAX_VELOCITY/2, 0), cp.v(0, 0));
        }
    }
    self.stopMoving = function () {
        self.body.vx = 0;
    }

    self.stopUserInteraction = function() {
        self.body.applyImpulse(cp.v(0, -UP_FORCE), cp.v(0, 0));
        self.body.vy = 0;
        isFalling = false;
    }

    self.handleWaterTouch = function() {
        self.containerState = "Water";
    }

    self.comboAction = function() {
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
        self.removed = true;
        self.sprite.visible = false;
        space.removeShape(self.shape);
        space.removeBody(self.body);        
    }

    self.typeOfActor = "Container";

    self.containerState = "Air";

    self.initialize();
}
