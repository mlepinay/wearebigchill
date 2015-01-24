

function Whale(space) {
    // CONSTANTS
    var SPRITE_RES  = res.docker_whale;
    var SCALE       = 0.2;

    var self = this;

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
        this.body.p = cc.p(g_runnerStartX, g_groundHeight + bodySize.height);

        space.addBody(this.body);

        this.shape = new cp.BoxShape(this.body, bodySize.width, bodySize.height);
        this.shape.setFriction(0.6);

        space.addShape(this.shape);
        this.bodySprite.setBody(this.body);

        this.sprite.x = this.bodySprite.x;
        this.sprite.y = this.bodySprite.y;
    }

    self.update = function() {
        this.sprite.x = this.bodySprite.x + 15;
        this.sprite.y = this.bodySprite.y + 20;
        this.sprite.rotation = this.bodySprite.rotation;
    }

    self.moveLeft = function() {
        self.body.applyImpulse(cp.v(-150, -20), cp.v(0, 0));
    }
    self.moveRight = function() {
        self.body.applyImpulse(cp.v(150, -20), cp.v(0, 0));
    }

    self.initialize();
}
