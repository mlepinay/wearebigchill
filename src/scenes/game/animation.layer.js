var AnimationLayer = cc.Layer.extend({
    sprite:null,
    whale: null,
    waves: null,
    combo: 0,
    score: 0,
    minusPoint: 0,

    ctor:function (space, statusLayer) {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.space = space;
        this.statusLayer = statusLayer;
        this.init();
        this.initInput();
    },

    init: function() {
        var self = this;

        var handledIdsPlus = {};

        this.handleIdsMinus = {};
        this.menu = false;

        this.containers = [new Container(this.space, [400, 450])];
        this.addChild(this.containers[0].sprite, 0);

        this.whale = new Whale(this.space);
        this.addChild(this.whale.sprite, 1);

        this.waves = new Waves({
            x: 0, y: WATER_HEIGHT + 5, width: 8000
        });

        this.waves.addToLayer(this);

        this.space.addCollisionHandler( 1, 42, null, function(arb, space, ptr) {
                var containerShape = arb.getShapes()[1];
                var id = containerShape.hashid;

                if (!handledIdsPlus[id]) {
                    var container = self.getContainerFromId(id);

                    if (container) {
                        if (container.sprite.y < WATER_HEIGHT - container.bodySize.height / 2) {
                            container.handleWaterTouch();
                            handledIdsPlus[id] = true;
                        }
                    }
                }

                g_waterPreSolve(arb, space, ptr);
        }, null, null);

        this.scheduleUpdate();
        return true;
    },

    initInput: function() {
        var layer = this;
        var listener = cc.EventListener.create({

            event: cc.EventListener.KEYBOARD,

            onKeyPressed: function (keyCode, event) {
                if (keyCode == 39) layer.containers[layer.containers.length - 1].moveRight();
                if (keyCode == 37) layer.containers[layer.containers.length - 1].moveLeft();
            },

            onKeyReleased: function (keyCode, event) {
                layer.containers[layer.containers.length - 1].stopMoving();
            }
        });
        cc.eventManager.addListener(listener, this.whale.sprite);
    },

    update: function(dt) {
        var self = this;

        if (self.menu)
            return

        this.whale.update();
        this.waves.update();
        for (var i = this.containers.length - 1; i >= 0; i--) {
            var updateStatus = this.containers[i].update();

            if (updateStatus == "requireContainer") {
                self.combo += 1;
                container = new Container(self.space, [400,450], this.statusLayer.selectedContainer);
                self.addChild(container.sprite, 0);
                self.containers.push(container);
            } else if (updateStatus == "lostContainer") {
                var id = self.containers[i].shape.hashid;
                if (!self.handleIdsMinus[id]) {
                    self.minusPoint += 1;
                    self.combo = 0;
                    self.statusLayer.updateLives(MAX_LOST_CONTAINERS - self.minusPoint);
                    if (self.minusPoint > MAX_LOST_CONTAINERS - 1) {
                        self.menu = true;
                        self.addChild(new GameOverLayer(), 15);
                    }
                    self.handleIdsMinus[id] = true;
                }
            }
        };
        if (self.combo >= MAX_COMBO) {
            self.combo = 0;
            self.comboAction();
        }

        self.deployContainers()

        self.statusLayer.updateCombo(self.combo);
        self.statusLayer.updateScore(self.score);


        self.freeRemovedContainers();
    },

    comboAction: function() {
        // for (var i = 0; i < this.containers.length; i++) {
        //     if (this.containers[i].containerState === "Whale") {
        //         this.containers[i].comboAction();
        //     }
        // }
    },

    deployContainers: function() {
        var self = this;

        var i, toDeploy = 0;
        for (i = 0; i < this.containers.length; i++) {
            if (this.containers[i].containerState === "Whale") {
                toDeploy++;
            }
        }
        if (toDeploy >= MAX_COMBO) {
            this.score += 1;
            for (i = 0; i < this.containers.length; i++) {
                if (this.containers[i].containerState === "Whale") {
                    this.containers[i].deploy();
                }
            }
            self.statusLayer.dockerPush();
        }
    },

    freeRemovedContainers: function() {
        var newContainersList = [];

        for (var i = 0; i < this.containers.length; i++) {
            if (!this.containers[i].removed) {
                newContainersList.push(this.containers[i]);
            }
        }

        this.containers = [];
        this.containers = newContainersList;
    },

    getContainerFromId: function(id) {
        for (var i = this.containers.length - 1; i >= 0; i--) {
            if (this.containers[i].shape.hashid == id) {
                return this.containers[i];
            }
        }
        return null;
    }
});
