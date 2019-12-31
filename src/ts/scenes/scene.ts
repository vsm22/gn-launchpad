import Util from '../gn-lp-util';
import MidiInDeviceInterface from '../midi-interfaces/midi-in-device-interface';
import MidiOutDeviceInterface from '../midi-interfaces/midi-out-device-interface';
import XYButton from '../buttons/xy-button';
import ButtonBehaviorMode from '../buttons/button-behavior-mode';
import SceneStage from './scene-stage';

class Scene {

    sceneName : string;
    xyButtons : Array<Array<XYButton>> = [];

    midiIn : MidiInDeviceInterface;
    toLaunchpad: MidiOutDeviceInterface;

    constructor(midiIn : MidiInDeviceInterface, toLaunchpad : MidiOutDeviceInterface, sceneJson : object) {
        this.midiIn = midiIn;
        this.toLaunchpad = toLaunchpad;

        for (let row = 0; row < 8; row++) {
            this.xyButtons[row] = [];
            for (let col = 0; col < 8; col++) {
                this.xyButtons[row][col] = new XYButton(midiIn, toLaunchpad, row, col, this);
            }
        }
        this.loadSceneFromJson(sceneJson);
    }

    loadSceneFromJson(json : object) {
        this.sceneName = json['sceneName'];

        if (json['handlers'] !== undefined) {

            if (json['handlers']['xyButtons']) {

                json['handlers']['xyButtons'].forEach(buttonJson => {

                    if (buttonJson['row'] === 'all') {
                        if (buttonJson['col'] === 'all') {

                            let behavior = buttonJson['mode'];
                            // Default behavior mode is 'toggle', otherwise take from json
                            let behaviorMode : ButtonBehaviorMode = ButtonBehaviorMode.toggle;
                            if (behavior['mode'] && 
                                (behavior['mode'] === ButtonBehaviorMode.toggle 
                                || behavior['mode'] === ButtonBehaviorMode.toggleRelease
                                || behavior['mode'] === ButtonBehaviorMode.push
                                || behavior['mode'] === ButtonBehaviorMode.hold
                                || behavior['mode'] === ButtonBehaviorMode.holdRelease
                                || behavior['mode'] === ButtonBehaviorMode.doubleTap)) {

                                behaviorMode = behavior['mode'];
                            }

                            let jsonStages : Array<object> = buttonJson['stages'];

                            [].concat(...this.xyButtons).forEach(btn => {
                                btn.mode = behaviorMode;
                                jsonStages.forEach(jsonStage => {
                                    btn.addSceneStage(new SceneStage(jsonStage, btn.row, btn.col, this));
                                });
                            });
                        }
                    }
                });
            }
        }
    }

    handleMidiEvent(msg : string) {

        let midiBytes : Array<number> = msg.split(' ').map(byteStr => parseInt(byteStr));
        let event = midiBytes[0];
        let rowCol = Util.getRowCol(midiBytes[1]);
        let row = rowCol[0];
        let col = rowCol[1];
        let vel = midiBytes[2];
        
        // 144 is button grid (cols 0 - 7) and right-hand-side 'launch' buttons (col 8)
        if (event === 144) {
            // is it X-Y grid buttons ( < 8) or right-hand-side 'launch' buttons?
            if (col < 8) {
                this.handleXYBtnEvent(row, col, vel);
            } else {
                this.handleLaunchBtnEvent(row, vel);
            }
        } else if (event === 176) { // 176 is top-row menu and user buttons
            col = col - 8;     
            this.handleMenuBtnEvent(col, vel);
        } 
    }

    handleXYBtnEvent(row : number, col : number, vel : number) {
        this.xyButtons[row][col].handleNoteEvent(vel);
    }

    handleLaunchBtnEvent(row : number, vel : number) {
        this.toLaunchpad.send('play: ' + row + ' ' + vel);
    }

    handleMenuBtnEvent(col : number, vel : number) {
        this.toLaunchpad.send('menu: ' + col + ' ' + vel);
    }
}

export default Scene;