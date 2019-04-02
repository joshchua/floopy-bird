import * as THREE from 'three';
import 'three-examples/controls/OrbitControls';
import { GameState } from '../game/models/GameState';


export function renderGame() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    let controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh(geometry, material);
    scene.add( cube );

    camera.position.z = 5;
    controls.update();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    return (state: any) => {
        controls.update();
        renderer.render(scene, camera);
    }
}