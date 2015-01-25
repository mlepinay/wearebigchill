var MenuLayer = cc.LayerColor.extend({

    // constructor
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super(cc.color(0, 0, 0, 0));
        var winSize = cc.director.getWinSize();

        var singlePos = cc.p(105, winSize.height-336);
        cc.MenuItemFont.setFontSize(30);
        var menuItemStartSingle = cc.MenuItemSprite.create(
            cc.Sprite.create(res.s_single_player_n),
            cc.Sprite.create(res.s_single_player_s),
            this.onStartSingle, this);
        var menuSingle = cc.Menu.create(menuItemStartSingle);
        menuSingle.setPosition(singlePos);
        this.addChild(menuSingle);

        var multiPos = cc.p(312, winSize.height-336);
        var menuItemStartMulti = cc.MenuItemSprite.create(
            cc.Sprite.create(res.s_single_player_n),
            cc.Sprite.create(res.s_single_player_s),
            this.onStartMulti, this);
        var menuMulti = cc.Menu.create(menuItemStartMulti);
        menuMulti.setPosition(multiPos);
        this.addChild(menuMulti);

    },

    onStartSingle:function (sender) {
        cc.director.resume();
        cc.director.runScene(new GameScene());
    },

    onStartMulti:function (sender) {
        cc.director.resume();
        cc.director.runScene(new MultiplayerScene());
    }
});