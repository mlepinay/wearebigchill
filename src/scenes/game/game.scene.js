var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        this.initPhysics();

        var layer = new AnimationLayer(this.space);
        this.addChild(layer);

        var debugNode = new cc.PhysicsDebugNode(this.space);
		debugNode.visible = true;
		this.addChild(debugNode);

        this.scheduleUpdate();
    },

    space:null,

        // init space of chipmunk
    initPhysics:function() {
        //1. new space object 
        this.space = new cp.Space();
        //2. setup the  Gravity
        this.space.gravity = cp.v(0, -500);

    	this.space.sleepTimeThreshold = 0.5;
		this.space.collisionSlop = 0.5;

		var staticBody = this.space.staticBody;

    	var shape = this.space.addShape( new cp.SegmentShape(staticBody, cp.v(0,0), cp.v(0,480), 0.0));
		shape.setElasticity(1.0);
		shape.setFriction(1.0);
		shape.setLayers(NOT_GRABABLE_MASK);

		shape = this.space.addShape( new cp.SegmentShape(staticBody, cp.v(640,0), cp.v(640,480), 0.0));
		shape.setElasticity(1.0);
		shape.setFriction(1.0);
		shape.setLayers(NOT_GRABABLE_MASK);

		shape = this.space.addShape( new cp.SegmentShape(staticBody, cp.v(0,0), cp.v(640,0), 0.0));
		shape.setElasticity(1.0);
		shape.setFriction(1.0);
		shape.setLayers(NOT_GRABABLE_MASK);

		shape = this.space.addShape( new cp.SegmentShape(staticBody, cp.v(0,480), cp.v(640,480), 0.0));
		shape.setElasticity(1.0);
		shape.setFriction(1.0);
		shape.setLayers(NOT_GRABABLE_MASK);

		
    },

    update:function (dt) {
        // chipmunk step
        this.space.step(dt);
    }
});

