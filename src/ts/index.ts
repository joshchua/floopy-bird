import './../sass/index.sass';

import { interval, animationFrameScheduler, Observable, fromEvent } from 'rxjs';
import { scan } from 'rxjs/operators';
import { fromJS, Map } from 'immutable';

import * as THREE from 'three';
import 'three-examples/controls/OrbitControls';

interface Tick {
    time: DOMHighResTimeStamp,
    delta: number
}

interface GameInput {
    pressed: boolean
}

/**
 * Creates a clock observable
 * 
 * @returns The clock observable
 */
function createClock(): Observable<Map<string, Tick>> {
    const start: Tick = {
        time: performance.now(),
        delta: 0
    };

    const state = fromJS(start);    

    return interval(0, animationFrameScheduler).pipe(
        scan((prev) => {
            const time = performance.now();
            let tick: Tick = {
                time: time,
                delta: time - prev.get('time')
            };
            return state.merge(tick);
        }, state)
    );
}

/**
 * Creates an observable of game inputs
 * 
 * @returns The game input observable
 */
function createInputObservable(): Observable<Map<string, GameInput>> {
    const input: GameInput = {
        pressed: false
    };

    const state = fromJS(input);

    return fromEvent(document, 'keypress').pipe(
        scan((previous, event: KeyboardEvent) => {
            if (event.keyCode == 32) {
                previous.update('pressed', () => true);
            } else {
                previous.update('pressed', () => false);
            }
            return previous;
        }, state)
    )
}

/**
 * Sets up the initial Three.js scene, camera, and objects
 */
function initGraphics(): void {
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

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

//let clock = createClock();
initGraphics();