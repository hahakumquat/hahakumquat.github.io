var PointLight = function(x, y, z, color, intensity, distance, decay, animation) {

    color = color || 0xffffff;
    intensity = intensity || 1;
    distance = distance || 0;
    decay = decay || 1;
    
    var self = new THREE.PointLight(color, intensity, distance, decay);

    self.position.x = x;
    self.position.y = y;
    self.position.z = z;

    if (animation) {
        self.animate = function() { animation(self); };
    }
    else {
        self.animate = function() {};
    }

    return self;
}
