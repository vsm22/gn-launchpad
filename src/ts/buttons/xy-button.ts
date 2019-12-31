import SceneStage from '../scenes/scene-stage';
import ButtonBehaviorMode from './button-behavior-mode';
import MidiInDevice from '../midi-interfaces/midi-in-device-interface';
import MidiOutDevice from '../midi-interfaces/midi-out-device-interface';
import GnLpUtil from '../gn-lp-util';
import Scene from '../scenes/scene';

class XYButton {

    row : number = 0;
    col : number = 0;
    curStageIdx : number = 0;
    scene : Scene = null;
    sceneStages : Array<SceneStage> = [];
    behaviorMode : ButtonBehaviorMode = ButtonBehaviorMode.toggle;
    waitingToRelease : boolean = false;

    midiIn : MidiInDevice;
    toLaunchpad : MidiOutDevice;
 
    constructor(midiIn : MidiInDevice, toLauchpad : MidiOutDevice, row : number, col : number, scene : Scene) {
        this.midiIn = midiIn;
        this.toLaunchpad = toLauchpad;
        this.row = row;
        this.col = col;
        this.scene = scene;
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
            this.waitingToRelease = false;
        }
    }

    nextStage() {
        this.curStageIdx = (this.curStageIdx + 1) % this.sceneStages.length;
        this.executeCurStage();
    }

    executeCurStage() {
        let curStage = this.sceneStages.find(sceneStage => sceneStage.stageIndex === this.curStageIdx);
        this.toLaunchpad.send("144 " + GnLpUtil.getXYButton(this.row, this.col) + " " + curStage.color);
        this.executeImpacts();
    }

    executeImpacts() {
        let curStage = this.sceneStages.find(sceneStage => sceneStage.stageIndex === this.curStageIdx);
        curStage.impacts.forEach(impact => {
            if (impact.row !== this.row || impact.col !== this.col) {

                if (impact.colorCode) {
                    let colorCodeMessage = "144 " + GnLpUtil.getXYButton(impact.row, impact.col) + " " + impact.colorCode;
                    
                    if (impact.delay) {
                        setTimeout(() => this.toLaunchpad.send(colorCodeMessage), impact.delay);
                    } else {
                        this.toLaunchpad.send(colorCodeMessage);
                    }
                }
            
                if (impact.stageIndex !== null && impact.stageIndex !== undefined) {
                    let targetButton = this.scene.xyButtons[impact.row][impact.col];
                    targetButton.curStageIdx = impact.stageIndex;
                }
            }
        });
    }
}

export default XYButton;