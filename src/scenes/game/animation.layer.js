var AnimationLayer = cc.Layer.extend({
    sprite:null,
    whale: null,
    ctor:function (space) {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.space = space;
        this.init();
        this.initInput();
    },

    init: function() {
        this.whale = new Whale();
        this.addChild(this.whale.sprite, 0);

        //1. create PhysicsSprite with a sprite frame name
        this.sprite = new cc.PhysicsSprite(res.docker_whale);
        var contentSize = this.sprite.getContentSize();
        // 2. init the runner physic body
        this.body = new cp.Body(1, cp.momentForBox(1, contentSize.width * 0.2, contentSize.height * 0.2));
        //3. set the position of the runner
        this.body.p = cc.p(g_runnerStartX, g_groundHeight + contentSize.height * 0.2);
        //4. apply impulse to the body
        // this.body.applyImpulse(cp.v(150, 0), cp.v(0, 0));//run speed
        //5. add the created body to space
        this.space.addBody(this.body);
        //6. create the shape for the body
        this.shape = new cp.BoxShape(this.body, contentSize.width * 0.2 - 14, contentSize.height * 0.2);
        //7. add shape to space
        this.space.addShape(this.shape);
        //8. set body to the physic sprite
        this.sprite.setBody(this.body);

        this.whale.sprite.x = this.sprite.x;
        this.whale.sprite.y = this.sprite.y;

        this.scheduleUpdate();

        return true;
    },

    initInput: function() {
        var layer = this;
        var listener = cc.EventListener.create({

            event: cc.EventListener.KEYBOARD,

            onKeyPressed: function (keyCode, event) {
                if (keyCode == 39) layer.whale.moveRight();
                if (keyCode == 37) layer.whale.moveLeft();
            }
        });
        cc.eventManager.addListener(listener, this.whale.sprite);
    },

    update: function(dt) {
        this.whale.sprite.x = this.sprite.x;
        this.whale.sprite.y = this.sprite.y;
    }
});
