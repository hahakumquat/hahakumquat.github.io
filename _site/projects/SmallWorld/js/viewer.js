var WIDTH, HEIGHT;
var camera, renderer, scene, bg;
var earth, mat, mat2, geom, tex, ellipse;
var group = new THREE.Object3D();
var rootMesh;
var rotation;
var lines = [];
var balls = [];

var LINECOLOR = 0xaaffff;
var MARKCOLOR = 0xffffff;
var ROOTCOLOR = 0x4488ff;
var HIGHLIGHT = 0x0000ff;
var DOTSIZE = 0.02;
var ELEVATION = 2;
var LINEWIDTH = 1;
var OFFSET = 15;
var controls;

var raycaster = new THREE.Raycaster();
var mouse = {};

init();

function init() {

    ////////// NEEDED STUFF
    var canvas = document.getElementById("container");
    canvas.setAttribute("style","width:90%");
    canvas.setAttribute("style","height:90%");
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(30, WIDTH / HEIGHT, 0.0001, 1000);
    camera.position.z = 2.5;
    scene.add(camera);

    // ////////// LIGHT
    var light = new THREE.PointLight(0xffffff, 1, 10000);
    light.position.set(1.1, 1.1, 1.1);
    scene.add(light);
    
    var light = new THREE.AmbientLight( 0xbbbbbb );
    scene.add( light );

    // ////////// GEOMETRY AND MESHES
    geom = new THREE.SphereGeometry(0.5, 100, 100);

    var loader = new THREE.TextureLoader();
    var bgl = loader.load("img/bg.jpg");
    var diffuse = loader.load("img/earthdiffuse.jpg");
    var alpha = loader.load("img/earthalpha.jpg");
    var bump = loader.load("img/earthbump.jpg");
    
    mat = new THREE.MeshBasicMaterial({
        map: diffuse,
        wireframe: true
    });
    mat2 = new THREE.MeshPhongMaterial({
        map: diffuse,
        bumpMap: bump,
        bumpScale: 0.02,
        specularMap: alpha,
        opacity: 0.4,
        transparent: true,
        specular: new THREE.Color("#111111"),
    });
    earth = new THREE.Mesh(geom, mat);
    earth2 = new THREE.Mesh(geom, mat2);

    bg = new THREE.Mesh(new THREE.SphereGeometry(5), new THREE.MeshBasicMaterial({
        map: bgl,
        side: THREE.DoubleSide
    }));
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    ////////// events
    document.addEventListener("click", disturb, false);
    document.addEventListener("keydown", function(e) {
        if (e.keyCode == 32)
            drawMap();
    }, false);

    canvas.appendChild(renderer.domElement);
    drawMap();

    animate();
}

function drawMap() {
    rotation = group.rotation.y;
    var locs = genData();
    setData(locs);
    addToGroup();
}

function genData() {
    var locs = [[37.7749, -122.4194]];
    for (var k = 0; k < Math.random() * 5 + 10; k++) {
        locs.push([locs[0], [Math.random() * 360 - 180, Math.random() * 360 - 180]]);
    }
    return locs;
}

function addToGroup() {
    group = new THREE.Object3D();
    group.add(earth);
    group.add(earth2);
    group.add(bg);
    var lineSet = new Set(lines);
    lineSet.forEach(function(x) {
        group.add(x);
    });
    var ballSet = new Set(balls);
    ballSet.forEach(function(x) {
        group.add(x);
    });
    group.rotation.y = rotation;
    scene.add(group);
}

function disturb(e, click) {
    mouse.x = e.clientX / WIDTH * 2 - 1;
    mouse.y = e.clientY / HEIGHT * -2 + 1;
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(balls);

    var w = new THREE.Color(MARKCOLOR);
    var y = new THREE.Color(HIGHLIGHT);
    var p = new THREE.Color(ROOTCOLOR);
    if (intersects.length > 0) {
        var mesh = intersects[0].object;
        if (mesh.material.color.b !== y) {
            balls.forEach(function(b) {
                if (b.position.x == rootMesh.position.x &&
                    b.position.y == rootMesh.position.y &&
                    b.position.z == rootMesh.position.z)
                    b.material.color = p;
                else
                    b.material.color = w;
            });
            mesh.material.color = y;
        }
    }
}

function setData(data) {
    clearData();
    renderData(data);
}

function clearData() {
    lines.forEach(function(s) {
        scene.remove(s);
    });
    lines = [];
    
    balls.forEach(function(s) {
        scene.remove(s);
    });
    balls = [];
    scene.remove(group);
}

function renderData(arr) {
    console.log(arr);
    arr.forEach(function(arc, i) {
        var start = latLongToVector3(arc[0][0], arc[0][1], 0.5, 0);
        var end = latLongToVector3(arc[1][0], arc[1][1], 0.5, 0);
        var dist = new THREE.Vector3(start.x - end.x,
                                     start.y - end.y,
                                     start.z - end.z);
        makeLink(start, end, DOTSIZE, ELEVATION, LINEWIDTH);
    });
    if (arr.length != 0) {
        var root = latLongToVector3(arr[0][0], arr[0][1], 0.5, 0);
        rootMesh = mark(root.x, root.y, root.z, 0.03);
        rootMesh.material.color = new THREE.Color(ROOTCOLOR);
        rootMesh.material.transparent = false;
        balls.push(rootMesh);
    }
    addToGroup();
}

function makeLink(loc1, loc2, dotsize, elevation, width) {
    var size = dotsize * Math.random() * 2 + 0.02;
    balls.push(mark(loc2.x, loc2.y, loc2.z, size));
    for (var k = 0; k < size * 500; k++) {
        lines.push(draw(loc1, loc2, elevation * Math.random() + 0.5, width));
    }
}

function draw(v1, v2, elevation, width) {
    var midpoint = new THREE.Vector3((v1.x + v2.x) / 2, (v1.y + v2.y) / 2, (v1.z + v2.z) / 2);
    var scaled = new THREE.Vector3(midpoint.x * elevation, midpoint.y * elevation, midpoint.z * elevation);
    var curveQuad = new THREE.QuadraticBezierCurve3(v1, scaled, v2);
    var cp = new THREE.CurvePath();
    cp.add(curveQuad);
    var curvedLineMaterial =  new THREE.LineBasicMaterial({color: LINECOLOR, linewidth: width});
    var curvedLine = new THREE.Line(cp.createPointsGeometry(20), curvedLineMaterial);
    return curvedLine;
}

function mark(x, y, z, r) {
    var geom = new THREE.SphereGeometry(r, 20, 20);
    var mat = new THREE.MeshLambertMaterial({
        color: MARKCOLOR,
        transparent: true,
        opacity: 0.3,
        // emissive: new THREE.Color("#ffffff")
        
    });
    var m = new THREE.Mesh(geom, mat);
    m.position.set(x, y, z);
    return m;
}

function latLongToVector3(lat, lon, radius, height) {
    var phi = (lat)*Math.PI/180;
    var theta = (lon-180)*Math.PI/180;
    
    var x = -(radius+height) * Math.cos(phi) * Math.cos(theta);
    var y = (radius+height) * Math.sin(phi);
    var z = (radius+height) * Math.cos(phi) * Math.sin(theta);
    
    var asdf =  new THREE.Vector3(x,y,z);
    return asdf;
}

function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.002;
    renderer.render(scene, camera);
}
