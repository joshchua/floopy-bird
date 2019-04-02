import * as THREE from 'three';
const Ground = require('../../../assets/textures/ground.png');

export class World extends THREE.Group {
    constructor() {
        super();

        var texture = new THREE.TextureLoader().load(Ground);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.repeat.set( 20, 20 );

        var geometry = new THREE.PlaneBufferGeometry( 400, 400, 32 );
        var material = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide, map: texture} );
        var plane = new THREE.Mesh( geometry, material );
        plane.rotateX(Math.PI / 2);
        this.add(plane);
    }
}