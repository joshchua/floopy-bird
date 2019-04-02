import * as THREE from 'three';
import { Hill } from './Hill';
const Ground = require('../../../assets/textures/ground.png');

export class World extends THREE.Group {
    constructor() {
        super();

        function createPlane() {
            let texture = new THREE.TextureLoader().load(Ground);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            texture.repeat.set( 20, 20 );

            let geometry = new THREE.PlaneBufferGeometry( 400, 400, 32 );
            let material = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide, map: texture} );
            let plane = new THREE.Mesh( geometry, material );
            plane.rotateX(Math.PI / 2);
            return plane;
        }

        function createHills() {
            let hillProps  = [
                [20, 30, 0x287256],
                [15, 20, 0x287256],
                [15, 20, 0x287256],
                [18, 28, 0x287256],
                [18, 28, 0x287256],
                [18, 28, 0x287256]
            ];

            let hillPos = [
                [50, -100],
                [50, -80],
                [-60, -75],
                [-100, -100],
                [-80, -50],
                [60, -40]
            ];

            let hills: Array<Hill> = [];
            hillProps.forEach((p, i) => {
                let hill = new Hill(p[0], p[1], p[2]);
                let pos = hillPos[i];
                hill.position.x = pos[0];
                hill.position.z = pos[1];
                hills.push(hill);
            }, this);
            return hills;
        }
        
        
        createHills().forEach(h => this.add(h), this);
        this.add(createPlane());
    }
}