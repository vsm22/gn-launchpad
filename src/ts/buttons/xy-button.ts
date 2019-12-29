import SceneStage from '../scenes/scene-stage';
import ButtonBehaviorMode from './button-behavior-mode';
import MidiInDevice from '../midi-interfaces/midi-in-device-interface';
import MidiOutDevice from '../midi-interfaces/midi-out-device-interface';
import GnLpUtil from '../gn-lp-util';

class XYButton {

    row : number = 0;
    col : number = 0;
    curStageIdx : number = 0;
    sceneStages : Array<SceneStage> = [];
    behaviorMode : ButtonBehaviorMode = ButtonBehaviorMode.toggle;
    waitingToRelease : boolean = false;

    midiIn : MidiInDevice;
    toLaunchpad : MidiOutDevice;
 
    constructor(midiIn : MidiInDevice, toLauchpad : MidiOutDevice, row : number, col : number) {
        this.midiIn = midiIn;
        this.toLaunchpad = toLauchpad;
        this.row = row;
        this.col = col;
    }

    addSceneStage(sceneStage : SceneStage) {
        this.sceneStages.push(sceneStage);
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
        console.log('numStages: ' + this.sceneStages.length);
        console.log('curStage: ' + this.curStageIdx);
        this.curStageIdx = (this.curStageIdx + 1) % this.sceneStages.length;
        this.executeCurStage();

    }

    executeCurStage() {
        let curStage = this.sceneStages[this.curStageIdx];
        this.toLaunchpad.send("144 " + GnLpUtil.getXYButton(this.row, this.col) + " " + curStage.color);
        this.executeOthers();
    }

    executeOthers() {
        let curStage = this.sceneStages[this.curStageIdx];
        curStage.others.forEach(other => {
            console.log("other " + other.row + " " + other.col + " " + "144 " + GnLpUtil.getXYButton(other.row, other.col) + " " + other.color);
            this.toLaunchpad.send("144 " + GnLpUtil.getXYButton(other.row, other.col) + " " + other.color);
        });
    }
}

export default XYButton;