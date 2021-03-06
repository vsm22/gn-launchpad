import MidiInDeviceInterface from '../midi-interfaces/midi-in-device-interface';
import MidiOutDeviceInterface from '../midi-interfaces/midi-out-device-interface';
import OutputCodes from '../util/output-codes';
import Scene from '../scenes/scene';
import GNLPLoader from './gn-lp-loader';

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
                    textOut: MidiOutDeviceInterface) {

        this.midiIn = midiIn;
        this.toLaunchpad = toLaunchpad;
        this.midiOut = midiOut;
        this.textOut = textOut;

        this.loadScenes();
        this.reset();
    }

    loadScenes() {
        GNLPLoader.launchpadScenes['scenes'].forEach(sceneJson => this.scenes.push(new Scene(this.midiIn, this.toLaunchpad, sceneJson)));
    }

    parseSceneJson(configJson: object) {
        if (configJson['scenes'] !== undefined) {
            configJson['scenes'].forEach(sceneJson => this.scenes.push(new Scene(this.midiIn, this.toLaunchpad, sceneJson)));
        }
    }

    handleMidiMessage(msg: string) {
        console.log("handleMidiMessage | msg=>" + msg);
        console.log("handleMidiMessage | this.curSceneIdx=>" + this.curSceneIdx);
        console.log("handleMidiMessage | this.scenes[this.curSceneIdx]=>" + this.scenes[this.curSceneIdx]);

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