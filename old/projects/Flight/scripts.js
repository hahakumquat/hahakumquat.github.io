var params = {
    FOV: 75,
    WIDTH: window.innerWidth,
    HEIGHT: window.innerHeight,
    NEAR_CLIP: 0.1,
    FAR_CLIP: 1000
}

var scene, camera, renderer, clock, startTime, currentTime;

var objects = [];


var init = function() {    
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( params.WIDTH, params.HEIGHT );
    renderer.shadowMap.enabled = true;
    
    document.getElementById("container").appendChild( renderer.domElement );
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( params.FOV, params.WIDTH / params.HEIGHT,
                                          params.NEAR_CLIP, params.FAR_CLIP );

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 5;

    initObjects();
    initListeners();

    clock = new THREE.Clock();
    clock.autoStart = true;
    startTime = clock.getElapsedTime();
    
    animate();

}

var initObjects = function() {

    // for (var i = 0; i < 10; i += 1 ) {
    //     var dim = new RandVector3(-2, 2);
    //     var pos = new RandVector3(-3, 3);
    //     var rot = new RandVector3(-10, 10);
    //     var block = new Block(dim, pos, rot);
    //     objects.push(block);
    // }

    var wall = new DisplacedPlane(10, 10, 50, 50,
                                  new THREE.Vector3(10, 0, -10), // pos
                                  new THREE.Vector3(0,  Math.PI / 2, 0), // rot                                 
                                  function(x, y) { return noise.simplex2(x/ 3, y / 3); },
                                  new THREE.MeshPhongMaterial(),
                                  function(s) {
                                      s.rotation.x += 0.01;
                                      s.rotation.y += 0.01;
                                  });
                                  
    objects.push(wall);

    var light = new PointLight(0, 0, 0, 0xffffff,
                               undefined, undefined,
                               undefined, undefined);
    objects.push(light);
    
    objects.forEach(function(o) {
        scene.add(o);
    });
    
    return objects
}

var initListeners = function() {
    
    var mouseMove = function(e) {
        var percentX = (e.clientX - params.WIDTH / 2) / (params.WIDTH / 2);
        var percentY = -(e.clientY - params.HEIGHT / 2) / (params.HEIGHT / 2);
        camera.position.x = Math.log(percentX);
        camera.position.y = Math.log(percentY);
    }

    // window.addEventListener('mousemove', mouseMove);
}


function animate() {
    requestAnimationFrame( animate );

    currentTime = clock.getElapsedTime();
    
    objects.forEach(function(o) {
        o.animate();
    });    
    
    renderer.render( scene, camera );
}

init();
