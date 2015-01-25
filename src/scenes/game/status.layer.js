var StatusLayer = cc.Layer.extend({
    labelScore:null,
    labelCombo:null,
    score:0,
    combo:0,
    lives:5,
    selected: 0,

    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();

        var winsize = cc.director.getWinSize();
        var type, sprite;

        this.containers = [];
        this.containerNames = [];
        for (var key in ContainerType) {
            this.containerNames.push(key);
            type = ContainerType[key];
            sprite = new cc.Sprite(type.sprite);
            sprite.color = type.color || cc.color(255,255,255,255);
            sprite.scale = type.scale || SCALE;
            this.containers.push(sprite);
            this.addChild(sprite, 1);
        }

        this.selector = cc.Sprite.create();
        this.selector.color = cc.color(0,150,0,255);
        this.selector.setOpacity(150);
        this.addChild(this.selector);

        this.drawContainerMenu();

        this.labelScore = new cc.LabelTTF("Score: "+this.score, "Helvetica", 20);
        this.labelScore.setColor(cc.color(0,0,0));//black color
        this.labelScore.setPosition(cc.p(70, winsize.height - 20));
        this.addChild(this.labelScore);

        this.labelCombo = new cc.LabelTTF("Combo: "+this.combo, "Helvetica", 20);
        this.labelCombo.setPosition(cc.p(winsize.width - 70, winsize.height - 20));
        this.addChild(this.labelCombo);

        var layer = this;
        var listener = cc.EventListener.create({

            event: cc.EventListener.KEYBOARD,

            onKeyReleased: function (keyCode, event) {
                if (keyCode === 32) {
                    layer.selected = (layer.selected + 1) % layer.containers.length;
                    layer.drawContainerMenu();
                }
            }
        });
        cc.eventManager.addListener(listener, 1);
    },

    drawContainerMenu: function() {
        var sprite, winsize = cc.director.getWinSize();
        for (var i = 0; i < this.containers.length; i++) {
            sprite = this.containers[i];
            sprite.setPosition(
                cc.p(winsize.width - sprite.width * sprite.scale - 10,
                    winsize.height - 100 - (sprite.height*sprite.scale+15) * i)
            )
            if (this.selected === i) {
                this.selectedContainer = this.containerNames[i];
                this.selector.setTextureRect(cc.rect(0, 0, sprite.width*sprite.scale+10, sprite.height*sprite.scale+10));
                this.selector.setPosition(
                    cc.p(winsize.width - sprite.width * sprite.scale - 10,
                        winsize.height - 100 - (sprite.height*sprite.scale+15) * i)
                )
            }
        }
    },

    updateScore:function (num) {
        this.score = num;
        this.labelScore.setString("Score: "+this.score);
    },

    updateCombo:function (num) {
        this.combo = num;
        this.labelCombo.setString("Combo: "+this.combo);
    },

    updateLives:function (num) {
        this.lives = num;
    }

});
