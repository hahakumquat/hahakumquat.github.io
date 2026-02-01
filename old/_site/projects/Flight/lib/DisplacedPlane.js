var DisplacedPlane = function(width, height, widthSegments, heightSegments, position, rotation, displacement, material, animation) {

    width = width || 10;
    height = height || 10;
    widthSegments = widthSegments || 10;
    heightSegments = heightSegments || 10;    
    var geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);

    var displacement = displacement || function(x, y) { return 0 };
    
    var material = material || new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });

    material.side = THREE.DoubleSide;
    
    var self = new THREE.Mesh( geometry, material );

    for (var i = 0; i < widthSegments; i += 1) {
        for (var j = 0; j < heightSegments; j += 1) {
            var v = self.geometry.vertices[i * widthSegments + j];
            v['z'] += displacement(v['x'], v['y']);
        }
    }
    
    self.position.set(position.x || 0, position.y || 0, position.z || 0);
    self.rotation.set(rotation.x || 0, rotation.y || 0, rotation.z || 0);

    self.castShadow = true;
    self.receiveShadow = true;
    
    if (animation) {
        self.animate = function() { animation(self); };
    }
    else {
        self.animate = function() {};
    }

    return self;
}
