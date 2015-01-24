var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        this.initPhysics();

        //2. get the screen size of your game canvas
        var winsize = cc.director.getWinSize();

        //3. calculate the center point
        var centerpos = cc.p(winsize.width / 2, winsize.height / 2);

        //4. create a background image and set it's position at the center of the screen
        var spritebg = new cc.Sprite(res.background);
        spritebg.setPosition(centerpos);
        this.addChild(spritebg);

        var layer = new AnimationLayer(this.space);
        this.addChild(layer);

        if (window.location.href.match(/debug/)) {
          var debugNode = new cc.PhysicsDebugNode(this.space);
      		debugNode.visible = true;
      		this.addChild(debugNode);
        }

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

    	var shape;
  //   	 = this.space.addShape( new cp.SegmentShape(staticBody, cp.v(0,0), cp.v(0,450), 0.0));
		// shape.setElasticity(1.0);
		// shape.setFriction(1.0);
		// shape.setLayers(NOT_GRABABLE_MASK);

		// shape = this.space.addShape( new cp.SegmentShape(staticBody, cp.v(800,0), cp.v(800,450), 0.0));
		// shape.setElasticity(1.0);
		// shape.setFriction(1.0);
		// shape.setLayers(NOT_GRABABLE_MASK);

		// shape = this.space.addShape( new cp.SegmentShape(staticBody, cp.v(0,450), cp.v(800,450), 0.0));
		// shape.setElasticity(1.0);
		// shape.setFriction(1.0);
		// shape.setLayers(NOT_GRABABLE_MASK);

			// {
				// Add the edges of the bucket
				var bb = new cp.BB(0, 0, 800, WATER_HEIGHT);
				var radius = 5.0;

				// shape = this.space.addShape( new cp.SegmentShape(staticBody, cp.v(bb.l, bb.b), cp.v(bb.l, bb.t), radius));
				// shape.setElasticity(1.0);
				// shape.setFriction(1.0);
				// shape.setLayers(NOT_GRABABLE_MASK);

				// shape = this.space.addShape( new cp.SegmentShape(staticBody, cp.v(bb.r, bb.b), cp.v(bb.r, bb.t), radius));
				// shape.setElasticity(1.0);
				// shape.setFriction(1.0);
				// shape.setLayers(NOT_GRABABLE_MASK);

				// shape = this.space.addShape( new cp.SegmentShape(staticBody, cp.v(bb.l, bb.b), cp.v(bb.r, bb.b), radius));
				// shape.setElasticity(1.0);
				// shape.setFriction(1.0);
				// shape.setLayers(NOT_GRABABLE_MASK);

				// Add the sensor for the water.
				shape = this.space.addShape( new cp.BoxShape2(staticBody, bb) );
				shape.setSensor(true);
				shape.setCollisionType(1);
			// }

		this.space.addCollisionHandler( 1, 0, null, g_waterPreSolve, null, null);
    },

    update:function (dt) {
        // chipmunk step
        this.space.step(dt);
    }
});

