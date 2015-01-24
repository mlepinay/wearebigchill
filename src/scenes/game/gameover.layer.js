var GameOverLayer = cc.LayerColor.extend({

    // constructor
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();
        var winSize = cc.director.getWinSize();

        var centerPos = cc.p(winSize.width / 2, winSize.height / 2);
        cc.MenuItemFont.setFontSize(30);
        var menuItemRestart = cc.MenuItemSprite.create(
            cc.Sprite.create(res.s_restart_n),
            cc.Sprite.create(res.s_restart_s),
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