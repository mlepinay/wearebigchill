var MenuLayer = cc.LayerColor.extend({

    // constructor
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super(cc.color(0, 0, 0, 0));
        var winSize = cc.director.getWinSize();

        var centerPos = cc.p(105, winSize.height-336);
        cc.MenuItemFont.setFontSize(30);
        var menuItemRestart = cc.MenuItemSprite.create(
            cc.Sprite.create(res.s_single_player_n),
            cc.Sprite.create(res.s_single_player_s),
            this.onRestart, this);
        var menu = cc.Menu.create(menuItemRestart);
        menu.setPosition(centerPos);
        this.addChild(menu);
    },

    onRestart:function (sender) {
        cc.director.resume();
        cc.director.runScene(new GameScene());
    }
});