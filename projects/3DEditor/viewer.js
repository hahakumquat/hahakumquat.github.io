var WIDTH, HEIGHT;
var camera, renderer, scene, raycaster, mouse;
var geom, mat, mesh, line;
var time = 0;

noise.seed(Math.random());

(function main() {

    ////////// UI //////////
    
    // dropdown menu functionality
    $(document).ready(function(){
        $('.dropdown-submenu a.test').on("click", function(e){
            $(this).next('ul').toggle();
            e.stopPropagation();
            e.preventDefault();
        });
    });

    // sets bottom and right panels to resizable
    $('.resize.b').resizable({
        handles: 'n',
        minHeight: window.innerHeight * 0.2,
        maxHeight: window.innerHeight * 0.5
    });

    $('.resize.r').resizable({
        handles: 'w',
        minWidth: window.innerWidth * 0.2,
        maxWidth: window.innerWidth * 0.5
    });

    // resizable UI listener
    var isClicked = false;
    $('.ui-resizable-handle')
        .mouseover(function() {
            resizeViewer();
        })
        .mousedown(function() {
            isClicked = true;
        })
        .mousemove(function() {
            if (isClicked) {
                var newWidth = $('.resize.r').width();
                $('.resize.b').width(window.innerWidth - newWidth);
                resizeViewer();
            }
        })
        .mouseup(function() {
            isClicked = false;
            resizeViewer();
        });

    // resizes the viewer to fit with the panels
    function resizeViewer() {
        var width = $('#bottomPanel').width();
        var height = window.innerHeight - $('#bottomPanel').height();
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    // toggles animation with spacebar
    var animate = false;
    $('body').keypress(function(e) {
        if (e.which === 32) {
            animate = !animate;
            update();
        }
    });    

    ////////// THREEJS INITIALIZATION //////////
    
    var canvas = document.getElementById("viewer");
    WIDTH = window.innerWidth * 0.8;
    HEIGHT = window.innerHeight * 0.8;

    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 0.0001, 1000);
    camera.position.z = 4;
    scene.add(camera);

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    var light = new THREE.PointLight(0xffffff, 1, 10000);
    light.position.set(1, 0, 0);
    light.castShadow = true;
    scene.add(light);
    
    var light = new THREE.PointLight(0xffffff, 1, 10000);
    light.position.set(-1, -1, -1);
    light.castShadow = true;
    scene.add(light);

    var light = new THREE.PointLight(0xffffff, 1, 10000);
    light.position.set(1, -1, -1);
    light.castShadow = true;
    scene.add(light);

    var light = new THREE.PointLight(0xffffff, 1, 10000);
    light.position.set(-1, 1, 1);
    light.castShadow = true;
    scene.add(light); 

    geom = new THREE.PlaneGeometry(1, 1, 10, 10);
    geom.dynamic = true;
    mat = new THREE.MeshStandardMaterial({color: 0x4f948f, side: THREE.DoubleSide});
    mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    var group = new THREE.Group();
    group.add(mesh);
    scene.add(group);
    // scene.add(mesh);

    var arrowEnabled = false;
    var arrowHelper = new THREE.Group();
    var xArrow = new ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xff0000);
    var yArrow = new ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1, 0x00ff00);
    var zArrow = new ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 1, 0x0000ff);
    arrowHelper.add(xArrow);
    arrowHelper.add(yArrow);
    arrowHelper.add(zArrow);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    canvas.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.maxDistance = 1000000000;

    $(canvas).mousemove(function(e) {
        mouse.x = (e.clientX / $(canvas).width()) * 2 - 1;
        mouse.y = (e.clientY / $(canvas).height()) * 2 - 1;
    });

    $(canvas).click(function(e) {
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length == 0) {
            scene.remove(arrowHelper);
            arrowEnabled = false;
        }
        else {
            if (!arrowEnabled) {
                scene.add(arrowHelper);
            }
	    arrowHelper.position = intersects[0].object.position;
            arrowHelper.rotation = intersects[0].object.rotation;
        }
    });

    function update() {
        requestAnimationFrame(update);
        // if (animate) {            
        //     group.rotation.y += 0.005;
        //     group.rotation.z += 0.003;
        //     time += 0.005;
        //     for (var i = 0; i < 10; i += 1) {
        //         for (var j = 0; j < 10; j += 1) {
        //             var noiseval = noise.simplex2(i, j + time);
        //             mesh.geometry.vertices[i * 10 + j]['z'] = noiseval / 5;
        //         }
        //     }
        //     mesh.geometry.verticesNeedUpdate = true;
        // }
        
        renderer.render(scene, camera);        
    }
    
    update();
})();

