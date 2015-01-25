var StatusLayer = cc.Layer.extend({
    labelScore:null,
    labelCombo:null,
    labelLIves:null,
    score:0,
    combo:0,
    lives:5,

    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();

        var winsize = cc.director.getWinSize();

        this.labelScore = new cc.LabelTTF("Score: "+this.score, "Helvetica", 20);
        this.labelScore.setColor(cc.color(0,0,0));//black color
        this.labelScore.setPosition(cc.p(70, winsize.height - 20));
        this.addChild(this.labelScore);

        this.labelCombo = new cc.LabelTTF("Combo: "+this.combo+"/"+MAX_COMBO, "Helvetica", 20);
        this.labelCombo.setPosition(cc.p(winsize.width - 70, winsize.height - 20));
        this.addChild(this.labelCombo);

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