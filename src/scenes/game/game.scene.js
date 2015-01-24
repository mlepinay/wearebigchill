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
				var bb = new cp.BB(0, 0, 800, 200);
				var radius = 5.0;

				shape = this.space.addShape( new cp.SegmentShape(staticBody, cp.v(bb.l, bb.b), cp.v(bb.l, bb.t), radius));
				shape.setElasticity(1.0);
				shape.setFriction(1.0);
				shape.setLayers(NOT_GRABABLE_MASK);

				shape = this.space.addShape( new cp.SegmentShape(staticBody, cp.v(bb.r, bb.b), cp.v(bb.r, bb.t), radius));
				shape.setElasticity(1.0);
				shape.setFriction(1.0);
				shape.setLayers(NOT_GRABABLE_MASK);

				shape = this.space.addShape( new cp.SegmentShape(staticBody, cp.v(bb.l, bb.b), cp.v(bb.r, bb.b), radius));
				shape.setElasticity(1.0);
				shape.setFriction(1.0);
				shape.setLayers(NOT_GRABABLE_MASK);

				// Add the sensor for the water.
				shape = this.space.addShape( new cp.BoxShape2(staticBody, bb) );
				shape.setSensor(true);
				shape.setCollisionType(1);
			// }

		this.space.addCollisionHandler( 1, 0, null, this.waterPreSolve, null, null);
    },

    update:function (dt) {
        // chipmunk step
        this.space.step(dt);
    },

    waterPreSolve: function(arb, space, ptr) {
		var shapes = arb.getShapes();
		var water = shapes[0];
		var poly = shapes[1];

		var body = poly.getBody();

		// Get the top of the water sensor bounding box to use as the water level.
		var level = water.getBB().t;

		// Clip the polygon against the water level
		var count = poly.getNumVerts();

		var clipped = [];

		var j=count-1;
		for(var i=0; i<count; i++) {
			var a = body.local2World( poly.getVert(j));
			var b = body.local2World( poly.getVert(i));

			if(a.y < level){
				clipped.push( a.x );
				clipped.push( a.y );
			}

			var a_level = a.y - level;
			var b_level = b.y - level;

			if(a_level*b_level < 0.0){
				var t = Math.abs(a_level)/(Math.abs(a_level) + Math.abs(b_level));

				var v = cp.v.lerp(a, b, t);
				clipped.push(v.x);
				clipped.push(v.y);
			}
			j=i;
		}

		// Calculate buoyancy from the clipped polygon area
		var clippedArea = cp.areaForPoly(clipped);

		var displacedMass = clippedArea*FLUID_DENSITY;
		var centroid = cp.centroidForPoly(clipped);
		var r = cp.v.sub(centroid, body.getPos());

		var dt = space.getCurrentTimeStep();
		var g = space.gravity;

		// Apply the buoyancy force as an impulse.
		body.applyImpulse( cp.v.mult(g, -displacedMass*dt), r);

		// Apply linear damping for the fluid drag.
		var v_centroid = cp.v.add(body.getVel(), cp.v.mult(cp.v.perp(r), body.w));
		var k = 1; //k_scalar_body(body, r, cp.v.normalize_safe(v_centroid));
		var damping = clippedArea*FLUID_DRAG*FLUID_DENSITY;
		var v_coef = Math.exp(-damping*dt*k); // linear drag
	//	var v_coef = 1.0/(1.0 + damping*dt*cp.v.len(v_centroid)*k); // quadratic drag
		body.applyImpulse( cp.v.mult(cp.v.sub(cp.v.mult(v_centroid, v_coef), v_centroid), 1.0/k), r);

		// Apply angular damping for the fluid drag.
		var w_damping = cp.momentForPoly(FLUID_DRAG*FLUID_DENSITY*clippedArea, clipped, cp.v.neg(body.p));
		body.w *= Math.exp(-w_damping*dt* (1/body.i));

		return true;
	}
});

