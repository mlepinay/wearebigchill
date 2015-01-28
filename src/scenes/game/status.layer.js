var StatusLayer = cc.Layer.extend({
    labelScore:null,
    labelCombo:null,
    labelLives:null,
    score:0,
    combo:0,
    scoreP2:0,
    comboP2:0,
    lives:5,
    selected: 0,
    multiplayer: false,

    ctor:function (multiplayer) {
        this.multiplayer = multiplayer;

        this._super();
        this.init();
    },

    init:function () {
        this._super();
        var self = this;

        var winsize = cc.director.getWinSize();
        var type, sprite;

        if (!self.multiplayer) {
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
        }

        var yLives = 30;
        var xLives = winsize.width - 200;

        this.livesSprites = []
        for (var i = 0; i < this.lives; i++) {
            var sprite = new cc.Sprite(res.docker_whale);
            
            sprite.attr({ 
                scale: 0.05,
                x: xLives + i * 42,
                y: yLives});

            this.addChild(sprite, 1);

            this.livesSprites.push(sprite);
        }

        if (self.multiplayer) {
            this.livesSpritesP2 = []
            xLives = (winsize.width/2) - 200;
            for (var i = 0; i < this.lives; i++) {
                var sprite = new cc.Sprite(res.docker_whale);
                
                sprite.attr({ 
                    scale: 0.05,
                    x: xLives + i * 42,
                    y: yLives});

                this.addChild(sprite, 1);

                this.livesSpritesP2.push(sprite);
            }            
        }

        var offsetX = 0;
        if (self.multiplayer) {
            offsetX = winsize.width / 2;
            this.labelScoreP2 = new cc.LabelTTF("Score: "+this.scoreP2, "Helvetica", 20);
            this.labelScoreP2.setColor(cc.color(0,0,0));//black color
            this.labelScoreP2.setPosition(cc.p(70, winsize.height - 20));
            this.addChild(this.labelScoreP2);

            this.labelComboP2 = new cc.LabelTTF("Combo: "+this.comboP2+"/"+MAX_COMBO, "Helvetica", 20);
            this.labelComboP2.setPosition(cc.p(winsize.width / 2 - 70, winsize.height - 20));
            this.addChild(this.labelComboP2);
        }

        this.labelScore = new cc.LabelTTF("Score: "+this.score, "Helvetica", 20);
        this.labelScore.setColor(cc.color(0,0,0));//black color
        this.labelScore.setPosition(cc.p(70 + offsetX, winsize.height - 20));
        this.addChild(this.labelScore);

        this.labelPush = new cc.LabelTTF("wearebigchill@dockerize:~$ docker push wearebigchill/game", 20);
        this.labelPush.setPosition(cc.p(winsize.width / 2, winsize.height - 20));
        this.addChild(this.labelPush);
        this.labelPush.visible = false;

        this.labelCombo = new cc.LabelTTF("Combo: "+this.combo+"/"+MAX_COMBO, "Helvetica", 20);
        this.labelCombo.setPosition(cc.p(winsize.width - 70, winsize.height - 20));
        this.addChild(this.labelCombo);

        var layer = this;
        var listener = cc.EventListener.create({

            event: cc.EventListener.KEYBOARD,

            onKeyReleased: function (keyCode, event) {
                if (keyCode === 32 && !layer.multiplayer) {
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

    updateScoreP2:function (num) {
        this.scoreP2 = num;
        this.labelScoreP2.setString("Score: "+this.scoreP2);
    },

    updateCombo:function (num) {
        this.combo = num;
        this.labelCombo.setString("Combo: "+this.combo+"/"+MAX_COMBO);
    },

    updateComboP2:function (num) {
        this.comboP2 = num;
        this.labelComboP2.setString("Combo: "+this.comboP2+"/"+MAX_COMBO);
    },

    updateLives:function (num) {
        this.lives = num;
        for (var i = 0; i < MAX_LOST_CONTAINERS - this.lives; i++) {
            this.livesSprites[i].visible = false;
        };
    },

    updateLivesP2:function (num) {
        this.livesP2 = num;
        for (var i = 0; i < MAX_LOST_CONTAINERS - this.livesP2; i++) {
            this.livesSpritesP2[i].visible = false;
        };
    },

    dockerPush: function () {
        var self = this;

        this.labelPush.visible = true;
        setTimeout(function() {
            self.labelPush.visible = false;
        }, 3000)
    }

});
