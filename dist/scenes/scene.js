"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gn_lp_util_1 = __importDefault(require("../gn-lp-util"));
const xy_button_1 = __importDefault(require("../buttons/xy-button"));
const button_behavior_mode_1 = __importDefault(require("../buttons/button-behavior-mode"));
const button_behavior_1 = __importDefault(require("../buttons/button-behavior"));
class Scene {
    constructor(midiIn, midiOut, sceneJson) {
        this.xyButtons = [];
        this.midiIn = midiIn;
        this.midiOut = midiOut;
        for (let row = 0; row < 8; row++) {
            console.log('...will init');
            console.log('...helllo?');
            this.xyButtons[row] = [];
            console.log('...init row: ' + this.xyButtons[row]);
            for (let col = 0; col < 8; col++) {
                this.xyButtons[row][col] = new xy_button_1.default(midiIn, midiOut);
            }
        }
        this.loadSceneFromJson(sceneJson);
    }
    loadSceneFromJson(json) {
        this.sceneName = json['sceneName'];
        if (json['xyButtons']) {
            // 'all' means behavior applicable for all buttons
            if (json['xyButtons']['all']) {
                if (json['xyButtons']['all']['behavior']) {
                    let behavior = json['xyButtons']['all']['behavior'];
                    // Default behavior mode is 'toggle', otherwise take from json
                    let behaviorMode = button_behavior_mode_1.default.toggle;
                    if (behavior['mode'] &&
                        (behavior['mode'] === button_behavior_mode_1.default.toggle
                            || behavior['mode'] === button_behavior_mode_1.default.toggleRelease
                            || behavior['mode'] === button_behavior_mode_1.default.push)) {
                        behaviorMode = behavior['mode'];
                    }
                    let jsonStages = json['xyButtons']['all']['behavior']['stages'];
                    console.log('json stages ==> ' + jsonStages);
                    [].concat(...this.xyButtons).forEach(btn => {
                        btn.mode = behaviorMode;
                        jsonStages.forEach((jsonStage, i) => {
                            // Set the stage index - the index is the order in which the stage appears
                            let stageIndex;
                            if (jsonStage['index']) {
                                stageIndex = jsonStage['index'];
                            }
                            else {
                                stageIndex = i;
                            }
                            if (!btn.stages[stageIndex]) {
                                btn.stages[stageIndex] = new button_behavior_1.default();
                            }
                            // Set stage behavior properties
                            if (jsonStage['color']) {
                                btn.stages[stageIndex].color = gn_lp_util_1.default.parseColor(jsonStage['color']);
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
    handleMidiEvent(msg) {
        console.log('msg: ' + msg);
        let midiBytes = msg.split(' ').map(byteStr => parseInt(byteStr));
        let event = midiBytes[0];
        let rowCol = gn_lp_util_1.default.getRowCol(midiBytes[1]);
        let row = rowCol[0];
        let col = rowCol[1];
        let vel = midiBytes[2];
        // 144 is button grid (cols 0 - 7) and right-hand-side 'launch' buttons (col 8)
        if (event === 144) {
            // is it X-Y grid buttons ( < 8) or right-hand-side 'launch' buttons?
            if (col < 8) {
                this.handleXYBtnEvent(row, col, vel);
            }
            else {
                this.handleLaunchBtnEvent(row, vel);
            }
            // 176 is top-row menu and user buttons
        }
        else if (event === 176) {
            col = col - 8;
            this.handleMenuBtnEvent(col, vel);
        }
    }
    handleXYBtnEvent(row, col, vel) {
        this.midiOut.send("vel: " + vel);
        this.xyButtons[row][col].handleNoteEvent(vel);
    }
    handleLaunchBtnEvent(row, vel) {
        this.midiOut.send('play: ' + row + ' ' + vel);
    }
    handleMenuBtnEvent(col, vel) {
        this.midiOut.send('menu: ' + col + ' ' + vel);
    }
}
exports.default = Scene;
//# sourceMappingURL=scene.js.map