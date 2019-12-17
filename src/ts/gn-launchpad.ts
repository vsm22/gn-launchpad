import Max from 'max-api';
import LpUtil from './gn-lp-util';
import MidiInDeviceInterface from './midi-interfaces/midi-in-device-interface';
import MidiOutDeviceInterface from './midi-interfaces/midi-out-device-interface';
import OutputCodes from './output-codes';

class GnLaunchpad {

    midiIn : MidiInDeviceInterface;
    midiOut: MidiOutDeviceInterface;

    constructor(midiIn : MidiInDeviceInterface, midiOut : MidiOutDeviceInterface) {
        this.midiIn = midiIn;
        this.midiOut = midiOut;
        this.reset();
    }

    onMessage(handler : (msg : string) => void) : void{
        this.midiIn.onMessage(handler);
    }

    reset() {
        this.midiOut.send(OutputCodes.reset);
    }

    lowBrightnessTest() {
        this.midiOut.send(OutputCodes.lowBrightnessTest);
    }

    mediumBrightnessTest() {
        this.midiOut.send(OutputCodes.mediumBrightnessTest);
    }

    fullBrightnessTest() {
        this.midiOut.send(OutputCodes.fullBrightnessTest);
    }
}

export default GnLaunchpad;