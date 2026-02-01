// global parameters and objects
var _;

$(document).ready(function() {
    var loader = new THREE.TextureLoader();
    loader.load("img/particle.png", function(texture) {
	_ = {};
	_.texture = texture;
	init();
	animate();	
    });

    // resize screen
    window.addEventListener("resize", function() {
	_.width = window.innerWidth;
	_.height = window.innerHeight;
	_.aspect = _.width / _.height;

	_.camera.aspect = _.aspect;
	_.camera.updateProjectionMatrix();

	_.renderer.setSize(_.width, _.height);
    });

    // Leaving page bug
    $(window).blur(function(){
	_.particleSystem.time.start();
    });
    $(window).focus(function(){
	_.particleSystem.time.stop();
    });
});
/***************************************************************/
/*********************INIT FUNCTIONS****************************/
/***************************************************************/

function init(texture) {
	initParameters();
	initObjects();
}

// returns global parameters
function initParameters() {

    _.container = document.getElementById("container");
    _.width = window.innerWidth;
    _.height = window.innerHeight;
    // camera
    _.view_angle = 45;
    _.aspect = _.width / _.height;
    _.near = 0.1;
    _.far = 2000;

    // emitter parameters
    _.spread = 30;
    _.speed = 30;
    _.maxParticles = 10000;
    
    // particle parameters
    _.canvasParticle = false;    
    _.size = 3.;
    _.lifetime = 5.;

    // physics parameters
    _.physics = true;
    _.gravity = new THREE.Vector3(0, -50, 0);
    _.wind = new THREE.Vector3(0, 0, 0);
}

// returns scene, camera, controls, renderer, particlesystem
function initObjects() {

    _.scene = new THREE.Scene();
    
    _.camera= new THREE.PerspectiveCamera(
	_.view_angle,
	_.aspect,
	_.near,
	_.far);    

    _.renderer = new THREE.WebGLRenderer();
    _.renderer.setSize(_.width, _.height);
    _.container.appendChild(_.renderer.domElement);
    
    // orbit controls
    _.controls = new THREE.OrbitControls(_.camera, _.renderer.domElement);
    _.controls.enableDamping = true;
    _.controls.rotateSpeed = 0.2;
    _.controls.zoomSpeed = 0.5;
    _.controls.dampingFactor = 0.25;
    _.controls.enableZoom = true;
    
    // aesthetic background
    initBackground();
    
    _.camera.position.z = 100;
    _.camera.position.y = 50;
    _.scene.add(_.camera);

    // overwrite jpg texture with canvas texture if desired
    if (_.canvasParticle) {
	_.canvas = document.createElement("canvas");
	_.canvas.width = 256;
	_.canvas.height = 256;
	_.ctx = _.canvas.getContext("2d");
	
	_.texture = new THREE.Texture(_.canvas);
	document.body.appendChild(_.canvas);
    }
    
    _.particleSystem = new ParticleSystem(_);
    _.scene.add(_.particleSystem.points);

    initGUI();
}

function initGUI() {
    
    _.gui = new dat.GUI();
    var emitter = _.gui.addFolder("Particle Emitter");
    var particle = _.gui.addFolder("Particle");
    var physics = _.gui.addFolder("Physics");
    var camera = _.gui.addFolder("Camera");
    var e1 = emitter.add(_.particleSystem, "numParticles", 0, _.maxParticles);
    emitter.add(_.particleSystem, "spread", 0, 100);
    emitter.add(_.particleSystem, "speed", 0, 100);
    e1.onChange(function(value) {
	_.particleSystem.numParticles = Math.floor(value);
	positions = _.particleSystem.points.geometry.attributes.position.array;
	for (var k = _.particleSystem.numParticles; k < _.maxParticles; k++) {
	    positions[k * 3 + 0] = NaN;
	    positions[k * 3 + 1] = NaN;
	    positions[k * 3 + 2] = NaN;
	}
    });

    
    var p1 = particle.add(_.particleSystem.points.material, "size", 1, 10);
    var p2 = particle.add(_.particleSystem, "lifetime", 0, 10);

    physics.add(_.particleSystem, "physics", true, false);
    var gravity = physics.addFolder("Gravity");
    gravity.add(_.gravity, "x");
    gravity.add(_.gravity, "y");
    gravity.add(_.gravity, "z");

    var wind = physics.addFolder("Wind");
    wind.add(_.wind, "x");
    wind.add(_.wind, "y");
    wind.add(_.wind, "z");

    var c1 = camera.add(_.camera, "near", 0.1, 100);
    var c2 = camera.add(_.camera, "far", 100, 10000); 
    var c3 = camera.add(_.camera, "fov", 0, 100);
    c1.onChange(function(value) {
	_.camera.updateProjectionMatrix();
    });
    c2.onChange(function(value) {
	_.camera.updateProjectionMatrix();
    });
    c3.onChange(function(value) {
	_.camera.updateProjectionMatrix();
    });
}

function initBackground() {
    var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
    light.position.set(0, 70, -200);
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(1000, 50, 50),
				new THREE.MeshLambertMaterial({
        color: 0xaaaaaa,
	side: THREE.BackSide,
    }));
    _.scene.add(light);
    _.scene.add(sphere);
}

/***************************************************************/
/*********************ANIMATION FUNCTION************************/
/***************************************************************/

function animate() {
    _.controls.update();
    if (_.canvasParticle)
        drawCanvas();
    updateGUI();
    _.particleSystem.update();
    _.renderer.render(_.scene, _.camera);
    requestAnimationFrame(animate);
}

function drawCanvas() {
    _.ctx.fillRect(0, 0, 256, 256);
    var w = _.canvas.width / 2;
    var h = _.canvas.height / 2;
    var r = w * .4;
    _.ctx.arc(-w, -h, r, 0, 2  * Math.PI);
    _.ctx.shadowColor = "#010890";
    _.ctx.shadowBlur = 200;
    _.ctx.shadowOffsetX = w * 2;
    _.ctx.shadowOffsetY = h * 2;
    _.ctx.fill();
}

function updateGUI() {
    
}
