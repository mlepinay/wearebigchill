var AnimationLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.init();
    },

    init: function() {
        var whale = new Whale();
        this.addChild(whale.sprite, 0);

        console.log(whale);
        return true;
    }
});
