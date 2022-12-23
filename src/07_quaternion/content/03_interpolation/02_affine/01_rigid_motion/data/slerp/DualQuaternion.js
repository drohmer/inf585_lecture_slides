// File:src/math/DualQuaternion.js

/**
 * @author lars ivar hatledal / http://laht.info
 */

THREE.DualQuaternion = function ( r, d ) {

	this._real = r || new THREE.Quaternion( 0, 0, 0, 1 );
	this._real.normalize();
	if ( d ) {
		if ( d instanceof THREE.Vector3 ) {
			this._dual = new THREE.Quaternion( d.x, d.y, d.z, 0 ).multiply( this._real ).multiplyScalar( 0.5 );
		} else {
			this._dual = d;
		}
	} else {
		this._dual = new THREE.Quaternion( 0, 0, 0, 0 );
	}
};

THREE.DualQuaternion.prototype = {

	constructor: THREE.DualQuaternion,

	_real: new THREE.Quaternion( 0, 0, 0, 1 ), _dual: new THREE.Quaternion( 0, 0, 0, 0 ),

	get real () {

		return this._real;

	},

	get dual () {

		return this._dual;

	},

	set: function ( real, dual ) {

		this._real = real.normalize();
		this._dual = dual;

		return this;

	},

	identity : function () {

		this._real = new THREE.Quaternion ( 0, 0, 0, 1 );
		this._dual = new THREE.Quaternion ( 0, 0, 0, 0 );

		return this;

	},

	compose: function ( position, quaternion ) {

		this._real = quaternion.normalize();
		this._dual = new THREE.Quaternion( position.x, position.y, position.z, 0 ).multiply( this._real ).multiplyScalar( 0.5 );

	},

	makeTranslation: function ( x, y, z ) {

		this._real = new THREE.Quaternion ( 0, 0, 0, 1 );
		this._dual = new THREE.Quaternion( x, y, z, 0 ).multiply( this._real ).multiplyScalar( 0.5 );

		return this;

	},

	makeRotation: function ( q ) {

		this._real = q.normalize();
		this.dual = new THREE.Quaternion ( 0, 0, 0, 0 );

		return this;

	},

	makeRotationX: function ( angle ) {

		return new THREE.DualQuaternion().makeRotation( new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3( 1, 0, 0 ), angle ) );

	},

	makeRotationY: function ( angle ) {

		return new THREE.DualQuaternion().makeRotation( new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3( 0, 1, 0 ), angle ) );

	},

	makeRotationZ: function ( angle ) {

		return new THREE.DualQuaternion().makeRotation( new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3( 0, 0, 1 ), angle ) );

	},

	normalize: function () {

		var n = 1.0 / this._real.length();
		this._real.multiplyScalar( n );
		this._dual.multiplyScalar( n );

		return this;

	},

	conjugate: function () {

		this._real.conjugate();
		this._dual.conjugate();

		return this;

	},

	dot: function ( q ) {

		return this._real.dot( q.real );

	},

	getRotation: function () {

		return this._real;

	},

	getEuler: function () {
		var ex, ey, ez;

		var r = this._real;
		var x = r.x; var y = r.y; var z = r.z; var w = r.w;

		var sqw = w * w;
		var sqx = x * x;
		var sqy = y * y;
		var sqz = z * z;
		var unit = sqx + sqy + sqz + sqw; // if normalized is one, otherwise
		// is correction factor
		var test = x * y + z * w;
		if ( test > 0.499 * unit ) { // singularity at north pole
		    ey = 2 * Math.atan2( x, w );
		    ez = Math.PI * 0.5;
		    ex = 0;
		} else if ( test < -0.499 * unit ) { // singularity at south pole
		    ey = -2 * Math.atan2( x, w );
		    ez = -Math.PI * 0.5;
		    ex = 0;
		} else {
		    ey = Math.atan2( 2 * y * w - 2 * x * z, sqx - sqy - sqz + sqw );
		    ez = Math.asin( 2 * test / unit );
		    ex = Math.atan2( 2 * x * w - 2 * y * z, -sqx + sqy - sqz + sqw );
		}

		return new THREE.Euler( ex, ey, ez );

	},

	getTranslation: function () {

		var t = new THREE.Quaternion().multiplyQuaternions( this._dual.clone().multiplyScalar( 2 ), this._real.clone().conjugate() );

		return new THREE.Vector3( t.x, t.y, t.z );

	},

	setTranslation: function ( v ) {
		this._dual.multiplyQuaternions( new THREE.Quaternion( v.x, v.y, v.z, 0 ), this._real ).multiplyScalar( 0.5 );

		return this;
	},

	multiplyScalar: function( scalar ) {

		this._real.multiplyScalar( scalar ).normalize();
		this._dual.multiplyScalar( scalar );

		return this;

	},

	multiply: function ( q ) {

		return this.multiply( this, q );

	},

	multiply: function ( q1, q2  ) {

		q1 = q1.clone().normalize();
		q2 = q2.clone().normalize();

		this._real.multiplyQuaternions( q1.real, q2.real );
		this._real.normalize();
		this._dual.multiplyQuaternions( q1.real, q2.dual )
						.add( new THREE.Quaternion().multiplyQuaternions( q1.dual, q2.real ) );

		return this;

	},

	setFromAxisAngleAndTranslation: function ( axis, angle, v ) {

		this._real.setFromAxisAngle( axis, angle ).normalize();
		this._dual.set( v.x, v.y, v.z, 0 ).multiply(this._real).multiplyScalar( 0.5 );

		return this;

	},

	setFromEulerAndTranslation: function ( x, y, z, v) {

		this._real.setFromEuler( new THREE.Euler( x,y,z ) ).normalize();
		this._dual.set( v.x, v.y, v.z, 0 ).multiply(this._real).multiplyScalar( 0.5 );

		return this;

	},

	copy: function ( q ) {

		this._real = new THREE.Quaternion().copy( q.real );
		this._dual = new THREE.Quaternion().copy( q.dual );

		return this

	},

	clone: function () {

		return new THREE.DualQuaternion( this._real.clone(), this._dual.clone() );

	}

};

THREE.DualQuaternion.ScLERP = function( from, to, t ) {

        var dot = from.real.dot(to.real);

        if (dot < 0) {
            to = to.clone().multiplyScalar( -1 );
        }

        var diff = new THREE.DualQuaternion().multiply( from.clone().conjugate(), to );

        var vr = new THREE.Vector3(diff.real.x, diff.real.y, diff.real.z);
        var vd = new THREE.Vector3(diff.dual.x, diff.dual.y, diff.dual.z);

        var invr = 1.0 / Math.sqrt(vr.dot(vr));

        var angle = 2 * Math.acos(diff.real.w);
        var pitch = -2 * diff.dual.w * invr;
        var direction = new THREE.Vector3().copy(vr).multiplyScalar(invr);
        var moment = new THREE.Vector3().copy(vd).sub(new THREE.Vector3().copy(direction).multiplyScalar(pitch * diff.real.w * 0.5));
	moment.multiplyScalar(invr);

        angle *= t;
        pitch *= t;

        var sinAngle = Math.sin(0.5 * angle);
        var cosAngle = Math.cos(0.5 * angle);

	var v = new THREE.Vector3().copy(direction).multiplyScalar(sinAngle);
        var real = new THREE.Quaternion(v.x, v.y, v.z, cosAngle);
	v.copy(moment.multiplyScalar(sinAngle).add(direction.multiplyScalar(pitch * 0.5 * cosAngle)));
        var dual = new THREE.Quaternion(v.x, v.y, v.z, -pitch * 0.5 * sinAngle);

        return new THREE.DualQuaternion().multiply(from, new THREE.DualQuaternion(real, dual));

}
