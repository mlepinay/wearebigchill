var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        this.initPhysics();

        var layer = new AnimationLayer(this.space);
        this.addChild(layer);

        this.scheduleUpdate();
    },

    space:null,

        // init space of chipmunk
    initPhysics:function() {
        //1. new space object 
        this.space = new cp.Space();
        //2. setup the  Gravity
        this.space.gravity = cp.v(0, -350);

        // 3. set up Walls
        var wallBottom = new cp.SegmentShape(this.space.staticBody,
            cp.v(0, g_groundHeight),// start point
            cp.v(4294967295, g_groundHeight),// MAX INT:4294967295
            0);// thickness of wall
        this.space.addStaticShape(wallBottom);
    },

    update:function (dt) {
        // chipmunk step
        this.space.step(dt);
    }
});

