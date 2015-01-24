var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new AnimationLayer();
        this.addChild(layer);
    }
});

