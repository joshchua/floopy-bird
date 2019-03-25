import './../sass/index.sass';

import { interval, animationFrameScheduler, Observable, fromEvent, merge } from 'rxjs';
import { scan, withLatestFrom, map, startWith } from 'rxjs/operators';

import * as THREE from 'three';
import 'three-examples/controls/OrbitControls';

interface Tick {
    time: DOMHighResTimeStamp,
    delta: number
}

interface InputState {
    pressed: boolean
}

interface Player {
    position: number
}

interface Pipe {
    distance: number,
    gapPosition: number
}

interface GameState {
    state: string,
    player: Player,
    pipes: Pipe[],
    score: number
}

/**
 * Creates a clock observable
 * 
 * @returns The clock observable
 */
function createClock(): Observable<Tick> {
    return interval(0, animationFrameScheduler).pipe(
        map(() => {
            return {
                time: performance.now(),
                delta: 0
            }
        }),
        scan((previous, current) => ({
            time: performance.now(),
            delta: current.time - previous.time
        }))
    );
}

/**
 * Creates an observable of game inputs
 * 
 * @returns The game input observable
 */
function createInputObservable(): Observable<InputState> {
    return merge(
        fromEvent(document, 'keydown').pipe(
            map<Event, boolean>((event: KeyboardEvent) => {
                return false;
            })
        )
    ).pipe(
        map<boolean, InputState>((b) => ({pressed: b}))
    );
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

function createGame() {
    const clock = createClock();
    const input = createInputObservable().pipe(
        startWith(({pressed: false}))
    );

    const events = clock.pipe(withLatestFrom(input));
    //events.subscribe((x) => console.log(x));

}

createGame();

//let clock = createClock();
initGraphics();