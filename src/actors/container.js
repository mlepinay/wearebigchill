

function Container(space, startPos) {
    // CONSTANTS
    var SPRITE_RES  = res.container;
    var SCALE       = 0.2;

    var self = this;

    // Initialization
    self.initialize = function() {
        var bodySize;

        self.sprite = new cc.Sprite(SPRITE_RES);
        self.sprite.attr({ scale: SCALE });

        self.bodySprite = new cc.PhysicsSprite(res.container);

        bodySize = self.bodySprite.getContentSize();
        bodySize.width  *= SCALE;
        bodySize.height *= SCALE;

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
        if (Math.random() < 0.2)
            this.body.applyImpulse(cp.v(0, -0.01), cp.v(0, 0));
        this.sprite.x = this.bodySprite.x;
        this.sprite.y = this.bodySprite.y;
        this.sprite.rotation = this.bodySprite.rotation;
    }

    self.initialize();
}
