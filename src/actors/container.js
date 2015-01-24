

function Container(space, startPos) {
    // CONSTANTS
    var SPRITE_RES  = res.container;
    var ROTATION    = 0.01;
    var ROT_SPEED   = 0.04;

    var self = this;

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

        var mass = 0.3*FLUID_DENSITY*bodySize.width*bodySize.height;

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

        this.sprite.x = this.bodySprite.x;
        this.sprite.y = this.bodySprite.y;
        this.sprite.rotation = this.bodySprite.rotation;
    }

    self.initialize();
}
