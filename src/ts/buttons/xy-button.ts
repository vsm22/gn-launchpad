import ButtonBehavior from './button-behavior';
import MidiInDevice from './midi-interfaces/midi-in-device-interface';
import MidiOutDevice from './midi-interfaces/midi-out-device-interface';

class XYButton {

    curStageIdx : number = 0;
    stages : Array<ButtonBehavior>;
    mode : string;

    midiIn : MidiInDevice;
    toLaunchpad : MidiOutDevice;
 
    constructor(midiIn : MidiInDevice, toLauchpad : MidiOutDevice) {
        this.midiIn = midiIn;
        this.toLaunchpad = toLauchpad;
    }

    handlePush() {
        this.curStageIdx = (this.curStageIdx + 1) % this.stages.length;
        this.stages[this.curStageIdx].
    }
}

export default XYButton;