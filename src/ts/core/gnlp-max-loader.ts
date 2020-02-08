import Max from 'max-api';
import Launchpad from './gn-launchpad';
import MaxMidiOutDevice from '../midi-interfaces/max-midi-out-device';
import MaxMidiInDevice from '../midi-interfaces/max-midi-in-device';
import GNLPLoader from './gn-lp-loader';
import fs from 'fs';

class GNLPMaxLoader extends GNLPLoader {

    launchpad: Launchpad;

    constructor() {
        super();

        const midiInDevice = new MaxMidiInDevice();
        const toLaunchpad = new MaxMidiOutDevice('to_launchpad');
        const midiOutDevice = new MaxMidiOutDevice('launchpad_midi');
        const textOutDevice = new MaxMidiOutDevice('launchpad_text');

        this.launchpad = new Launchpad(midiInDevice, toLaunchpad, midiOutDevice, textOutDevice);

        Max.addHandler('from_launchpad', (msg) => {
            this.launchpad.handleMidiMessage(msg);
        });
    }

    /**
     * Load the main config file.
     * 
     * @return - Object representing the JSON configuration.
     */
    loadLaunchpadConfig(): object {
        let configStr: string = fs.readFileSync('./config/launchpad_config.json', 'utf8');
        return JSON.parse(configStr);
    };

    /**
     * Load the scenes.
     * 
     * @return - Object representing the JSON scenes configuration.
     */
    loadLaunchpadScenes(): object {
        let launchpadScenesJsonPath = GNLPLoader.launchpadConfig["launchpadScenesJsonPath"];
        launchpadScenesJsonPath = (launchpadScenesJsonPath != undefined && launchpadScenesJsonPath != null && launchpadScenesJsonPath != '') ?
            launchpadScenesJsonPath : './config/launchpad_scenes.json';
        let launchpadScenesJson = JSON.parse(fs.readFileSync(launchpadScenesJsonPath, "utf8"));
        
        return launchpadScenesJson;
    };

    /**
     * Load the XY button map. 
     * 
     * @return - Map representing the XY Button map.
     */
    loadXYButtonMap(): Map<string, Array<number>> {
        let xyButtonMap = new Map();
        let xyButtonMapJson = JSON.parse(fs.readFileSync('./config/xy_button_map.json', 'utf8'));
        for (let row = 0; row < 8; row++) {
            let rowJson = xyButtonMapJson['' + row];
            for (let col = 0; col < 8; col++) {
                let rowColJson : Array<number> = rowJson['' + col];
                xyButtonMap.set(row + ' ' + col, rowColJson);
            }
        }
        return xyButtonMap;
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

export default GNLPMaxLoader;