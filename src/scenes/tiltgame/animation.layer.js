var TiltGameAnimationLayer = cc.Layer.extend({
    sprite:null,
    whale: null,
    waves: null,
    containers: [],

    ctor:function (space) {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.space = space;
        this.init();
        this.initInput();
    },

    init: function() {
        // this.containers = [new Container(this.space, [160, 500])];
        // this.addChild(this.containers[0].sprite, 0);

        this.whale = new Whale(this.space);
        this.addChild(this.whale.sprite, 1);

        this.waves = new Waves({
            x: 0, y: WATER_HEIGHT + 5, width: 8000
        });

        this.waves.addToLayer(this);

        this.dropContainers();
        this.scheduleUpdate();
        return true;
    },

    initInput: function() {
        var layer = this;
        var listener = cc.EventListener.create({

            event: cc.EventListener.KEYBOARD,

            onKeyPressed: function (keyCode, event) {
                if (keyCode == 39) layer.whale.tiltRight();
                if (keyCode == 37) layer.whale.tiltLeft();
            }
        });
        cc.eventManager.addListener(listener, this.whale.sprite);
    },

    update: function(dt) {
        this.whale.update();
        this.waves.update();
        for (var i = this.containers.length - 1; i >= 0; i--) {
            this.containers[i].update();
        };
    },

    dropContainers: function() {
        var self = this;


        setInterval(function() {
            container = new Container(self.space,
                [Math.floor(Math.random()*(self.whale.size-50)) + self.whale.sprite.x - self.whale.size/2, 500]
            );
            console.log(Math.random()*self.whale.size + self.whale.sprite.x, self.whale.size, self.whale.sprite.x)
            self.addChild(container.sprite, 0);
            self.containers.push(container);
        }, 2000)
    }
});
