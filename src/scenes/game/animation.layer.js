var AnimationLayer = cc.Layer.extend({
    whale: null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.init();
        this.initInput();
    },

    init: function() {
        this.whale = new Whale();
        this.addChild(this.whale.sprite, 0);
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
    }
});
