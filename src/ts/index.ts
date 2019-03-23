import './../sass/index.sass';

import { interval, animationFrameScheduler } from 'rxjs';
import { scan } from 'rxjs/operators';
import * as Immutable from 'immutable';

interface Tick {
    time: DOMHighResTimeStamp,
    delta: number
}

function createClock() {
    const start: Tick = {
        time: performance.now(),
        delta: 0
    };

    const state = Immutable.fromJS(start);    

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

let clock = createClock();