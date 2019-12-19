import ButtonBehavior from './button-behavior';
import ButtonBehaviorMode from './button-behavior-mode';
import MidiInDevice from '../midi-interfaces/midi-in-device-interface';
import MidiOutDevice from '../midi-interfaces/midi-out-device-interface';

class XYButton {

    curStageIdx : number = 0;
    stages : Array<ButtonBehavior> = [];
    behaviorMode : ButtonBehaviorMode = ButtonBehaviorMode.toggle;
    waitingToRelease : boolean = false;

    midiIn : MidiInDevice;
    toLaunchpad : MidiOutDevice;
 
    constructor(midiIn : MidiInDevice, toLauchpad : MidiOutDevice) {
        this.midiIn = midiIn;
        this.toLaunchpad = toLauchpad;
    }

    handleNoteEvent(vel : number) {
        if (!this.waitingToRelease) {
            if (this.behaviorMode === ButtonBehaviorMode.push) {
                
            } else if (this.behaviorMode === ButtonBehaviorMode.toggle) {
                if (vel > 0) {
                    this.nextStage();
                }
            } else if (this.behaviorMode === ButtonBehaviorMode.toggleRelease) {
                if (vel === 0) {
                    this.nextStage();
                }
            } else if (this.behaviorMode === ButtonBehaviorMode.hold) {
                if (vel > 0) {
                    setTimeout(() => this.waitingToRelease = true, 1000);
                    // start timer
                    // ignore next release
                }
            } else if (this.behaviorMode === ButtonBehaviorMode.holdRelease) {

            } else if (this.behaviorMode === ButtonBehaviorMode.doubleTap) {

            }
        } else if (vel === 0) {
            this.waitingToRelease = false
        }
    }

    nextStage() {
        this.curStageIdx = (this.curStageIdx + 1) % this.stages.length;

    }

    executeCurStage() {
        let curStage = this.stages[this.curStageIdx];
        
    }
}

export default XYButton;