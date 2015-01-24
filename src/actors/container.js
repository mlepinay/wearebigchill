

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

    // Initialization
    self.initialize = function() {
        var bodySize;

        self.sprite = new cc.Sprite(SPRITE_RES);
        self.sprite.attr({ scale: SCALE });

        self.bodySprite = new cc.PhysicsSprite(res.container);

        self.angle = 0;

        bodySize = self.bodySprite.getContentSize();
        bodySize.width  *= SCALE;
        bodySize.height *= SCALE;

        self.size = bodySize.width;

        var mass = 0.8*FLUID_DENSITY*bodySize.width*bodySize.height;

        self.body = new cp.Body(mass, cp.momentForBox(mass, bodySize.width, bodySize.height));
        this.body.p = cc.p(startPos[0], startPos[1]);

        space.addBody(this.body);

        this.shape = new cp.BoxShape(this.body, bodySize.width, bodySize.height);
        this.shape.setFriction(1);

        space.addShape(this.shape);
        this.bodySprite.setBody(this.body);

        this.sprite.x = this.bodySprite.x;
        this.sprite.y = this.bodySprite.y;
    }

    self.update = function() {
        if (Math.abs(this.bodySprite.y-WATER_HEIGHT) <= self.size) {
            self.angle += ROT_SPEED;
            self.body.applyImpulse(cp.v(Math.cos(self.angle) * (ROTATION), Math.sin(self.angle) * ROTATION), cp.v(0, 0));
        } else {
            // Keep awake
            if (Math.random() < 0.2)
                this.body.applyImpulse(cp.v(0, -0.01), cp.v(0, 0));
        }

        // if (isFalling) {
        //     this.body.applyImpulse(cp.v(0, 0.5), cp.v(0, 0));
        // }
        // debugger
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
                this.stopUserInteraction();
                return ("requireContainer");
            }
        }

        this.sprite.x = this.bodySprite.x;
        this.sprite.y = this.bodySprite.y;
        this.sprite.rotation = this.bodySprite.rotation;
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

    self.initialize();
}
