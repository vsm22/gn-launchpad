import MidiInDeviceInterface from './midi-interfaces/midi-in-device-interface';
import MidiOutDeviceInterface from './midi-interfaces/midi-out-device-interface';
import OutputCodes from './output-codes';
import Scene from './scenes/scene';

class GnLaunchpad {

    midiIn : MidiInDeviceInterface;
    toLaunchpad: MidiOutDeviceInterface;
    midiOut: MidiOutDeviceInterface;
    textOut: MidiOutDeviceInterface;

    scenes : Array<Scene> = [];
    curSceneIdx = 0;
    
    constructor(midiIn : MidiInDeviceInterface,
        toLaunchpad : MidiOutDeviceInterface,
        midiOut: MidiOutDeviceInterface,
        textOut: MidiOutDeviceInterface,
        configJsonPath: string) {

        this.midiIn = midiIn;
        this.toLaunchpad = toLaunchpad;
        this.midiOut = midiOut;
        this.textOut = textOut;
        configJsonPath = (configJsonPath != undefined && configJsonPath != null && configJsonPath != '') ?
            configJsonPath : './config/launchpad_scenes.json';
        this.loadScenes(configJsonPath);
        this.reset();
    }

    loadScenes(filepath : string) {
        let configJson = require(filepath);
        if (configJson['scenes']) {
            let scenes = configJson['scenes'];
            scenes.forEach(sceneJson => {
                let newScene = new Scene(this.midiIn, this.toLaunchpad, sceneJson);
                this.scenes.push(newScene);
            });
        }
    } 

    handleMidiMessage(msg : string) {
        this.scenes[this.curSceneIdx].handleMidiEvent(msg);
        //
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