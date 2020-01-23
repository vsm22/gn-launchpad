import MidiInDeviceInterface from './midi-interfaces/midi-in-device-interface';
import MidiOutDeviceInterface from './midi-interfaces/midi-out-device-interface';
import OutputCodes from './output-codes';
import Scene from './scenes/scene';
import { pathToFileURL } from 'url';
var fs = require('file-system');

class GnLaunchpad {

    midiIn: MidiInDeviceInterface;
    toLaunchpad: MidiOutDeviceInterface;
    midiOut: MidiOutDeviceInterface;
    textOut: MidiOutDeviceInterface;
    scenes: Array<Scene> = [];
    curSceneIdx = 0;
    
    constructor(midiIn: MidiInDeviceInterface,
                    toLaunchpad: MidiOutDeviceInterface,
                    midiOut: MidiOutDeviceInterface,
                    textOut: MidiOutDeviceInterface,
                    configJsonPath: string) {

        this.midiIn = midiIn;
        this.toLaunchpad = toLaunchpad;
        this.midiOut = midiOut;
        this.textOut = textOut;
        configJsonPath = (configJsonPath != undefined && configJsonPath != null && configJsonPath != '') ?
            configJsonPath : 'launchpad_scenes.json';

        console.log(__dirname);
        this.loadScenes(configJsonPath);
        this.reset();
    }

    loadScenes(filepath: string) {
        let configJson : object;

        fs.readFile(filepath, (err, data) => {
            if (err) {
                console.log('Error reading ' + filepath);
            } else {
                configJson = JSON.parse(data.toString());
                this.parseSceneJson(configJson);
            }
        });
    }

    parseSceneJson(configJson: object) {
        if (configJson['scenes'] !== undefined) {
            configJson['scenes'].forEach(sceneJson => this.scenes.push(new Scene(this.midiIn, this.toLaunchpad, sceneJson)));
        }
        console.log('Cursceneidx: ' + this.curSceneIdx);
    }

    handleMidiMessage(msg: string) {
        this.scenes[this.curSceneIdx].handleMidiEvent(msg);
    }

    reset() {
        this.toLaunchpad.send(OutputCodes.reset);
    }

    lowBrightnessTest() {
        this.toLaunchpad.send(OutputCodes.lowBrightnessTest);
    }

    mediumBrightnessTest() {
        this.toLaunchpad.send(OutputCodes.mediumBrightnessTest);
    }

    fullBrightnessTest() {
        this.toLaunchpad.send(OutputCodes.fullBrightnessTest);
    }
}

export default GnLaunchpad;