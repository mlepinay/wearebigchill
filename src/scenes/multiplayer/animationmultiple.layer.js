var AnimationMultipleLayer = cc.Layer.extend({
    sprite:null,
    whale: null,
    waves: null,
    combo: [0,0],
    score: [0,0],
    minusPoint: [0,0],

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

        this.containers = [];

        this.containers[0] = [new Container(this.space, [200, 500], "server", 1)];
        this.addChild(this.containers[0][0].sprite, 0);

        this.containers[1] = [new Container(this.space, [600, 500], "server", 2)];
        this.addChild(this.containers[1][0].sprite, 0);

        this.whale = [];

        this.whale[0] = new Whale(this.space, 1);
        this.addChild(this.whale[0].sprite, 1);

        this.whale[1] = new Whale(this.space, 2);
        this.addChild(this.whale[1].sprite, 1);

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
                        container.handleWaterTouch();
                        handledIdsPlus[id] = true;
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
                if (keyCode == 68) layer.containers[0][layer.containers[0].length - 1].moveRight();
                if (keyCode == 65) layer.containers[0][layer.containers[0].length - 1].moveLeft();

                if (keyCode == 39) layer.containers[1][layer.containers[1].length - 1].moveRight();
                if (keyCode == 37) layer.containers[1][layer.containers[1].length - 1].moveLeft();
            },

            onKeyReleased: function (keyCode, event) {
                if (keyCode == 65 || keyCode == 68)
                    layer.containers[0][layer.containers[0].length - 1].stopMoving();
                if (keyCode == 39 || keyCode == 37)
                    layer.containers[1][layer.containers[1].length - 1].stopMoving();
            }
        });
        cc.eventManager.addListener(listener, this.whale[0].sprite);
    },

    update: function(dt) {
        var self = this;

        if (self.menu)
            return

        this.whale[0].update();
        this.whale[1].update();
        this.waves.update();

        this.updateContainersLogic();

        self.statusLayer.updateCombo(self.combo[1]);
        self.statusLayer.updateScore(self.score[1]);

        self.statusLayer.updateComboP2(self.combo[0]);
        self.statusLayer.updateScoreP2(self.score[0]);

        self.freeRemovedContainers();
    },

    updateContainersLogic: function() {
        var self = this;

        for (var i = this.containers[0].length - 1; i >= 0; i--) {
            var updateStatus = this.containers[0][i].update();

            if (updateStatus == "requireContainer") {
                self.combo[0] += 1;
                container = new Container(self.space, [400,500], "server", 1);
                self.addChild(container.sprite, 0);
                self.containers[0].push(container);
            } else if (updateStatus == "lostContainer") {
                var id = self.containers[0][i].shape.hashid;
                if (!self.handleIdsMinus[id]) {
                    self.minusPoint[0] += 1;
                    self.combo[0] = 0;
                    self.statusLayer.updateLivesP2(MAX_LOST_CONTAINERS - self.minusPoint[0]);
                    if (self.minusPoint[0] > MAX_LOST_CONTAINERS - 1) {
                        self.menu = true;
                        self.getParent().addChild(new GameOverLayer(), 20);
                    }
                    self.handleIdsMinus[id] = true;
                }
            }
        };
        if (self.combo[0] >= MAX_COMBO) {
            // self.score[0] += 1;
            self.combo[0] = 0;
            self.comboAction(0);
        }

        self.deployContainers(0);

        for (var i = this.containers[1].length - 1; i >= 0; i--) {
            var updateStatus = this.containers[1][i].update();

            if (updateStatus == "requireContainer") {
                self.combo[1] += 1;
                container = new Container(self.space, [600,500], "server", 2);
                self.addChild(container.sprite, 0);
                self.containers[1].push(container);
            } else if (updateStatus == "lostContainer") {
                var id = self.containers[1][i].shape.hashid;
                if (!self.handleIdsMinus[id]) {
                    self.minusPoint[1] += 1;
                    self.combo[1] = 0;
                    self.statusLayer.updateLives(MAX_LOST_CONTAINERS - self.minusPoint[1]);
                    if (self.minusPoint[1] > MAX_LOST_CONTAINERS - 1) {
                        self.menu = true;
                        self.getParent().addChild(new GameOverLayer(), 20);
                    }
                    self.handleIdsMinus[id] = true;
                }
            }
        };
        if (self.combo[1] >= MAX_COMBO) {
            // self.score[1] += 1;
            self.combo[1] = 0;
            self.comboAction(1);
        }

        self.deployContainers(1);
    },

    comboAction: function(player) {
        // for (var i = 0; i < this.containers[player].length; i++) {
        //     if (this.containers[player][i].containerState === "Whale") {
        //         this.containers[player][i].comboAction();
        //     }
        // }
    },

    deployContainers: function(player) {
        var i, toDeploy = 0;
        for (i = 0; i < this.containers[player].length; i++) {
            if (this.containers[player][i].containerState === "Whale") {
                toDeploy++;
            }
        }
        if (toDeploy >= MAX_COMBO) {
            this.score[player] += 1;
            for (i = 0; i < this.containers[player].length; i++) {
                if (this.containers[player][i].containerState === "Whale") {
                    this.containers[player][i].deploy();
                }
            }
        }
    },

    freeRemovedContainers: function() {
        var newContainersList = [];

        for (var i = 0; i < this.containers[0].length; i++) {
            if (!this.containers[0][i].removed) {
                newContainersList.push(this.containers[0][i]);
            }
        }

        this.containers[0] = [];
        this.containers[0] = newContainersList;

        newContainersList = [];

        for (var i = 0; i < this.containers[1].length; i++) {
            if (!this.containers[1][i].removed) {
                newContainersList.push(this.containers[1][i]);
            }
        }

        this.containers[1] = [];
        this.containers[1] = newContainersList;
    },

    getContainerFromId: function(id) {
        for (var i = this.containers[0].length - 1; i >= 0; i--) {
            if (this.containers[0][i].shape.hashid == id) {
                return this.containers[0][i];
            }
        }
        for (var i = this.containers[1].length - 1; i >= 0; i--) {
            if (this.containers[1][i].shape.hashid == id) {
                return this.containers[1][i];
            }
        }
        return null;
    }
});
