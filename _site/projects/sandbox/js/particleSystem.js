// particle system class
ParticleSystem = function(params) {

    var self = this;
    // timer 
    self.time = new THREE.Clock(true);
    
    // initial position
    self.position = params.position || new THREE.Vector3(0, -30, 0);

    // particle rate
    self.maxParticles = params.maxParticles || 1000;
    self.numParticles = self.maxParticles / 2;

    // how long a particle lives
    self.lifetime = params.lifetime || 5.0;

    // how big a particle is
    self.size =params.size ||  1.0;

    // speed of emission
    self.speed = params.speed || 40;

    // spread of emission
    self.spread = params.spread || 20;

    // newtonian physics
    self.physics = params.physics || false;
    self.gravity = params.gravity || new THREE.Vector3(0, -10, 0);
    self.wind = params.wind || new THREE.Vector3(0, 0, 0);

    
    // Set up geometry buffer
    var particleGeometry = new THREE.BufferGeometry();
    
    // stores position of particle
    var positionBuffer = new Float32Array(self.maxParticles * 3);
    
    // stores initial velocity of particle
    var velocityBuffer = new Float32Array(self.maxParticles * 3);
    
    // initial life, life remaining
    var lifeBuffer = new Float32Array(self.maxParticles * 2);

    for (var k = 0; k < self.maxParticles; k++) {
	positionBuffer[k * 3 + 0] = self.position.x;
	positionBuffer[k * 3 + 1] = self.position.y;
	positionBuffer[k * 3 + 2] = self.position.z;

	var theta = (Math.random()) * 2 * Math.PI;
	var phi = Math.random() * Math.PI / 4 + Math.PI / 4;
	velocityBuffer[k * 3 + 0] = Math.cos(theta); // x	
	velocityBuffer[k * 3 + 2] = Math.sin(theta); // z
	velocityBuffer[k * 3 + 1] = Math.tan(phi); // y
	lifeBuffer[k * 2 + 0] = Math.random() * self.lifetime;
	lifeBuffer[k * 2 + 1] = lifeBuffer[k * 2 + 0];
    }

    var positionAttribute = new THREE.BufferAttribute(positionBuffer, 3);
    positionAttribute.setDynamic(true);
    particleGeometry.addAttribute("position", positionAttribute);

    var velocityAttribute = new THREE.BufferAttribute(velocityBuffer, 1);
    velocityAttribute.setDynamic(false);
    particleGeometry.addAttribute("velocity", velocityAttribute);
    
    var lifeAttribute = new THREE.BufferAttribute(lifeBuffer, 2);
    lifeAttribute.setDynamic(true);
    particleGeometry.addAttribute("life", lifeAttribute);

    var particleMaterial = new THREE.PointsMaterial({
    	size: self.size,
    	blending: THREE.AdditiveBlending,
    	map: _.texture,
    	transparent: true,
    	alphaTest: 0.5,
    	depthTest : false,
    	depthWrite : false
    });
    
    var particlePoints = new THREE.Points(particleGeometry, particleMaterial);
    
    self.points = particlePoints;
}

function initParticleMaterial() {
    
    // var uniforms = {
    //     texture: {
    //         type: "t",
    //         value: THREE.ImageUtils.loadTexture("img/particle.png")
    //     },
    //     size: {
    //         type: "i",
    //         value: self.size
    //     }
    // };
    
    // return new THREE.ShaderMaterial({
    //     uniforms: uniforms,
    //     // attributes: attributes,
    //     vertexShader: $("#vertexShader").text(),
    //     fragmentShader: $("#fragmentShader").text(),
    //     blending: THREE.AdditiveBlending,
    //     transparent: true,
    //     alphaTest: 0.5,
    //     depthTest: false,
    //     depthWrite: false
    // });
}

ParticleSystem.prototype.update = function() {
    var self = this;
    var delta = self.time.getDelta();

    var positions = self.points.geometry.attributes.position.array;
    var velocities = self.points.geometry.attributes.velocity.array;
    var lives = self.points.geometry.attributes.life.array;
    
    for (var k = 0; k < self.numParticles; k++) {
	if (positions[k * 3 + 0] == NaN
	    || positions[k * 3 + 1] == NaN
	    || positions[k * 3 + 2] == NaN) {
	    positions[k * 3 + 0] = self.position.x;
	    positions[k * 3 + 1] = self.position.y;
    	    positions[k * 3 + 2] = self.position.z;
	}
    	if (lives[k * 2 + 1] - delta < 0) {
	    lives[k * 2 + 0] = Math.random() * self.lifetime;
	    lives[k * 2 + 1] = lives[k * 2 + 0];
    	    positions[k * 3 + 0] = self.position.x;
    	    positions[k * 3 + 1] = self.position.y;
    	    positions[k * 3 + 2] = self.position.z;
    	}
    	else {
	    lives[k * 2 + 1] -= delta;	    
	    var v0 = new THREE.Vector3(velocities[k * 3 + 0] * self.spread,
				       velocities[k * 3 + 1] * self.speed,
				       velocities[k * 3 + 2] * self.spread);
    	    var s0 = new THREE.Vector3(positions[k * 3 + 0],
    				       positions[k * 3 + 1],
    				       positions[k * 3 + 2]);

	    if (self.physics) {
		physicalMove(v0, s0, lives, k);
	    }
	    else {
		basicMove(v0, k);
	    }
    	}
    }
    self.points.geometry.attributes.position.needsUpdate = true;
    self.points.geometry.attributes.life.needsUpdate = true;
    _.texture.needsUpdate = true;
    _.renderer.render(_.scene, _.camera);
}

function basicMove(v0, k) {
    var self = _.particleSystem;
    var positions = self.points.geometry.attributes.position.array;
    var i = k * 3;
    positions[i + 0] += v0.x / 100;
    positions[i + 1] += v0.y / 100;
    positions[i + 2] += v0.z / 100;
}

function physicalMove(v0, s0, lives, k) {
    var self = _.particleSystem;
    var positions = self.points.geometry.attributes.position.array;
    var velocities = self.points.geometry.attributes.velocity.array;
    var t = lives[k * 2 + 0] - lives[k * 2 + 1];
    var i = k * 3;
    var newX = self.position.x + self.wind.x * t + v0.x * t + 0.5 * self.gravity.x * t * t;
    var newY = self.position.y + self.wind.y * t + v0.y * t + 0.5 * self.gravity.y * t * t;
    var newZ = self.position.z + self.wind.z * t + v0.z * t + 0.5 * self.gravity.z * t * t;
    positions[k * 3 + 0] = newX;
    positions[k * 3 + 1] = newY;
    positions[k * 3 + 2] = newZ;
}
