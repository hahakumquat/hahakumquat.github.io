var RandVector3 = function(min, max) {

    if (min > max) {
        throw "min must be less than max.";
    }
    var Unif = function(min, max) {
        var sUnif = (Math.random() - 0.5);
        var shift = (max + min) / 2;
        var scale = sUnif * (max - min);
        return scale + shift;
    }

    var self = new THREE.Vector3(Unif(min, max),
                                 Unif(min, max),
                                 Unif(min, max));
    return self;
}
