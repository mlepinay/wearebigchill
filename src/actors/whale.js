

function Whale(space) {
    // CONSTANTS
    var SPRITE_RES      = res.docker_whale;
    var MAX_ROT         = Math.PI / 6;
    var MAX_VELOCITY    = 100;
    var ROTATION        = 0.15;
    var ROT_SPEED       = 0.04;

    var self = this;

    self.angle = 0;

    // Initialization
    self.initialize = function() {
        var bodySize;

        self.sprite = new cc.Sprite(SPRITE_RES);
        self.sprite.attr({ scale: SCALE });

        self.bodySprite = new cc.PhysicsSprite(res.docker_whale_body);


        bodySize = self.bodySprite.getContentSize();
        bodySize.width  *= SCALE;
        bodySize.height *= SCALE;

        var mass = 0.3*FLUID_DENSITY*bodySize.width*bodySize.height;

        self.body = new cp.Body(mass, cp.momentForBox(mass, bodySize.width, bodySize.height));
        this.body.p = cc.p(400, WATER_HEIGHT + 10);
        this.body.w_limit = MAX_ROT;
        this.body.v_limit = MAX_VELOCITY;

        space.addBody(this.body);

        this.shape = new cp.BoxShape(this.body, bodySize.width, bodySize.height);
        this.shape.setFriction(1);

        space.addShape(this.shape);
        this.bodySprite.setBody(this.body);

        this.sprite.x = this.bodySprite.x;
        this.sprite.y = this.bodySprite.y;
    }

    self.update = function() {
        if (this.body.w > MAX_ROT || this.body.w < -MAX_ROT) {
            if (this.body.w < 0) {
                this.body.w = MAX_ROT;
            } else {
                this.body.w = -MAX_ROT;
            }
        }

        self.angle += ROT_SPEED;
        self.body.applyImpulse(cp.v(Math.cos(self.angle) * (ROTATION), Math.sin(self.angle) * ROTATION), cp.v(0, 0));

        this.sprite.x = this.bodySprite.x + 23;
        this.sprite.y = this.bodySprite.y + 30;
        this.sprite.rotation = this.bodySprite.rotation;
    }

    self.moveLeft = function() {
        self.body.applyImpulse(cp.v(-MAX_VELOCITY/2, -5), cp.v(0, 0));
    }
    self.moveRight = function() {
        self.body.applyImpulse(cp.v(MAX_VELOCITY/2, -5), cp.v(0, 0));
    }

    self.initialize();
}
