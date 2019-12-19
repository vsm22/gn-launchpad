import Util from '../gn-lp-util';
import MidiInDeviceInterface from '../midi-interfaces/midi-in-device-interface';
import MidiOutDeviceInterface from '../midi-interfaces/midi-out-device-interface';
import XYButton from '../buttons/xy-button';
import ButtonBehaviorMode from '../buttons/button-behavior-mode';
import ButtonBehavior from '../buttons/button-behavior';

class Scene {

    sceneName : string;
    xyButtons : Array<Array<XYButton>> = [];

    midiIn : MidiInDeviceInterface;
    midiOut: MidiOutDeviceInterface;

    constructor(midiIn : MidiInDeviceInterface, midiOut : MidiOutDeviceInterface, sceneJson : object) {
        this.midiIn = midiIn;
        this.midiOut = midiOut;

        for (let row = 0; row < 8; row++) {
            console.log('...will init');
            console.log('...helllo?');
            this.xyButtons[row] = [];
            console.log('...init row: ' + this.xyButtons[row]);
            for (let col = 0; col < 8; col++) {
                this.xyButtons[row][col] = new XYButton(midiIn, midiOut);
            }
        }
        this.loadSceneFromJson(sceneJson);
    }

    loadSceneFromJson(json : object) {
        this.sceneName = json['sceneName'];

        if (json['xyButtons']) {

            // 'all' means behavior applicable for all buttons
            if (json['xyButtons']['all']) {
        
                if (json['xyButtons']['all']['behavior']) {

                    let behavior = json['xyButtons']['all']['behavior'];

                    // Default behavior mode is 'toggle', otherwise take from json
                    let behaviorMode : ButtonBehaviorMode = ButtonBehaviorMode.toggle;
                    if (behavior['mode'] && 
                        (behavior['mode'] === ButtonBehaviorMode.toggle 
                        || behavior['mode'] === ButtonBehaviorMode.toggleRelease
                        || behavior['mode'] === ButtonBehaviorMode.push)) {
                        behaviorMode = behavior['mode'];
                    }

                    let jsonStages : Array<object> = json['xyButtons']['all']['behavior']['stages'];
                    console.log('json stages ==> ' + jsonStages);

                    [].concat(...this.xyButtons).forEach(btn => {

                        btn.mode = behaviorMode;

                        jsonStages.forEach((jsonStage, i) => {

                            // Set the stage index - the index is the order in which the stage appears
                            let stageIndex;
                            if (jsonStage['index']) {
                                stageIndex = jsonStage['index'];
                            } else {
                                stageIndex = i;
                            }

                            if (!btn.stages[stageIndex]) {
                                btn.stages[stageIndex] = new ButtonBehavior();
                            }

                            // Set stage behavior properties
                            if (jsonStage['color']) {
                                btn.stages[stageIndex].color = Util.parseColor(jsonStage['color']);
                            }

                            if (jsonStage['colorCode']) {
                                btn.stages[stageIndex].color = jsonStage['colorCode'];
                            }
                        });
                    });
                }
            }
        }

    }

    handleMidiEvent(msg : string) {
        console.log('msg: ' + msg);
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
            
            // 176 is top-row menu and user buttons
            } else if (event === 176) {
                col = col - 8;     
                this.handleMenuBtnEvent(col, vel);
            } 
    }

    handleXYBtnEvent(row : number, col : number, vel : number) {
        this.midiOut.send("vel: " + vel);
        this.xyButtons[row][col].handleNoteEvent(vel);
    }

    handleLaunchBtnEvent(row : number, vel : number) {
        this.midiOut.send('play: ' + row + ' ' + vel);
    }

    handleMenuBtnEvent(col : number, vel : number) {
        this.midiOut.send('menu: ' + col + ' ' + vel);
    }
}

export default Scene;