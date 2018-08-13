var Block = function(dim, position, rotation, color, animation) {
        
    var geometry = new THREE.BoxGeometry( dim.x, dim.y, dim.z );
    var c = color || Math.random() * 0xffffff;
    var material = new THREE.MeshBasicMaterial( { color: c } );
    var self = new THREE.Mesh( geometry, material );

    self.position.set(position.x, position.y, position.z);
    self.rotation.set(rotation.x, rotation.y, rotation.z);
    
    if (animation) {
        self.animate = function() { animation(self); };
    }
    else {
        self.animate = function() {};
    }
    
    return self;
}

