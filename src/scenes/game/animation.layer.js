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
        this.whale = new Whale(this.space);
        this.addChild(this.whale.sprite, 0);

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
        this.whale.update();
    }
});
