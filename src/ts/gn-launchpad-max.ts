import Max from 'max-api';
import Launchpad from './gn-launchpad';
import MaxMidiOutDevice from './midi-interfaces/max-midi-out-device';
import MaxMidiInDevice from './midi-interfaces/max-midi-in-device';
import GNLPLoader from './gn-lp-loader';

const midiInDevice = new MaxMidiInDevice();
const toLaunchpad = new MaxMidiOutDevice('to_launchpad');
const midiOutDevice = new MaxMidiOutDevice('launchpad_midi');
const textOutDevice = new MaxMidiOutDevice('launchpad_text');

class GNLPMaxLoader extends GNLPLoader {
    constructor() {
        super();
    }

    /**
     * Load the main config file.
     * 
     * @return - Object representing the JSON configuration.
     */
    loadLaunchpadConfig(): object {
        return {};
    };

    /**
     * Load the scenes.
     * 
     * @return - Object representing the JSON scenes configuration.
     */
    loadLaunchpadScenes(): object {
        return {};
    };

    /**
     * Load the XY button map. 
     * 
     * @return - Object representing the XY Button map.
     */
    loadXYButtonMap(): object {
        return {};
    };

    /**
     * Load the event map.
     * 
     * @return - Object representing the event map.
     */
    loadEventMap(): object {
        return {};
    };    
}

let gnlpmaxloader = new GNLPMaxLoader();

// const launchpad = new Launchpad(midiInDevice, toLaunchpad, midiOutDevice, textOutDevice, '');

// Max.addHandler('from_launchpad', (msg) => {
//     launchpad.handleMidiMessage(msg);
// });

