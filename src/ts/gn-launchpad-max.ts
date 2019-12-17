import Max from 'max-api';
import Launchpad from './gn-launchpad';
import MaxMidiOutDevice from './midi-interfaces/max-midi-out-device';
import MaxMidiInDevice from './midi-interfaces/max-midi-in-device';

const lp= new Launchpad(new MaxMidiInDevice(), new MaxMidiOutDevice());

lp.onMessage(msg => Max.outlet(msg));

let isBang : boolean = false;

Max.addHandler('bang', () => {
    if (isBang) {
        lp.reset();
        isBang = false;
    } else {
        lp.fullBrightnessTest();
        isBang = true;
    }
});