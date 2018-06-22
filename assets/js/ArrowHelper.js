var lineGeometry, coneGeometry;

var Object3D = THREE.Object3D;
var Vector3 = THREE.Vector3;
var BufferGeometry = THREE.BufferGeometry;
var Float32BufferAttribute = THREE.Float32BufferAttribute;
var CylinderBufferGeometry = THREE.CylinderBufferGeometry;
var Line = THREE.Line;
var LineBasicMaterial = THREE.LineBasicMaterial;
var Mesh = THREE.Mesh;
var MeshBasicMaterial = THREE.MeshBasicMaterial;

function ArrowHelper( dir, origin, length, color, headLength, headWidth ) {

    // dir is assumed to be normalized

    Object3D.call( this );

    if ( color === undefined ) color = 0xffff00;
    if ( length === undefined ) length = 1;
    if ( headLength === undefined ) headLength = 0.2 * length;
    if ( headWidth === undefined ) headWidth = 0.2 * headLength;

    if ( lineGeometry === undefined ) {

	lineGeometry = new BufferGeometry();
	lineGeometry.addAttribute( 'position', new Float32BufferAttribute( [ 0, 0, 0, 0, 1, 0 ], 3 ) );

	coneGeometry = new CylinderBufferGeometry( 0, 0.5, 1, 5, 1 );
	coneGeometry.translate( 0, - 0.5, 0 );

    }

    this.position.copy( origin );

    this.line = new Line( lineGeometry, new LineBasicMaterial( { color: color } ) );
    this.line.matrixAutoUpdate = false;
    this.add( this.line );

    this.cone = new Mesh( coneGeometry, new MeshBasicMaterial( { color: color } ) );
    this.cone.matrixAutoUpdate = false;
    this.add( this.cone );

    this.setDirection( dir );
    this.setLength( length, headLength, headWidth );

}

ArrowHelper.prototype = Object.create( Object3D.prototype );
ArrowHelper.prototype.constructor = ArrowHelper;

ArrowHelper.prototype.setDirection = ( function () {

    var axis = new Vector3();
    var radians;

    return function setDirection( dir ) {

	// dir is assumed to be normalized

	if ( dir.y > 0.99999 ) {

	    this.quaternion.set( 0, 0, 0, 1 );

	} else if ( dir.y < - 0.99999 ) {

	    this.quaternion.set( 1, 0, 0, 0 );

	} else {

	    axis.set( dir.z, 0, - dir.x ).normalize();

	    radians = Math.acos( dir.y );

	    this.quaternion.setFromAxisAngle( axis, radians );

	}

    };

}() );

ArrowHelper.prototype.setLength = function ( length, headLength, headWidth ) {

    if ( headLength === undefined ) headLength = 0.2 * length;
    if ( headWidth === undefined ) headWidth = 0.2 * headLength;

    this.line.scale.set( 1, Math.max( 0, length - headLength ), 1 );
    this.line.updateMatrix();

    this.cone.scale.set( headWidth, headLength, headWidth );
    this.cone.position.y = length;
    this.cone.updateMatrix();

};

ArrowHelper.prototype.setColor = function ( color ) {

    this.line.material.color.copy( color );
    this.cone.material.color.copy( color );

};
