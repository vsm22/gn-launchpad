"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gn_lp_util_1 = __importDefault(require("../gn-lp-util"));
const xy_button_1 = __importDefault(require("../buttons/xy-button"));
const button_behavior_mode_1 = __importDefault(require("../buttons/button-behavior-mode"));
const scene_stage_1 = __importDefault(require("./scene-stage"));
class Scene {
    constructor(midiIn, toLaunchpad, sceneJson) {
        this.xyButtons = [];
        this.midiIn = midiIn;
        this.toLaunchpad = toLaunchpad;
        for (let row = 0; row < 8; row++) {
            this.xyButtons[row] = [];
            for (let col = 0; col < 8; col++) {
                console.log("construct row: " + row);
                console.log("construct col: " + col);
                this.xyButtons[row][col] = new xy_button_1.default(midiIn, toLaunchpad, row, col);
            }
        }
        console.log('before loadSceneFromJson...');
        this.loadSceneFromJson(sceneJson);
    }
    loadSceneFromJson(json) {
        this.sceneName = json['sceneName'];
        console.log('sceneName: ' + this.sceneName);
        console.log('construct loadSceneFromJson...');
        if (json['handlers'] !== undefined) {
            console.log('handlers');
            if (json['handlers']['xyButtons']) {
                console.log('xyButtons');
                // 'all' means behavior applicable for all buttons
                if (json['handlers']['xyButtons']['all']) {
                    console.log('all');
                    let behavior = json['handlers']['xyButtons']['all'];
                    // Default behavior mode is 'toggle', otherwise take from json
                    let behaviorMode = button_behavior_mode_1.default.toggle;
                    if (behavior['mode'] &&
                        (behavior['mode'] === button_behavior_mode_1.default.toggle
                            || behavior['mode'] === button_behavior_mode_1.default.toggleRelease
                            || behavior['mode'] === button_behavior_mode_1.default.push
                            || behavior['mode'] === button_behavior_mode_1.default.hold
                            || behavior['mode'] === button_behavior_mode_1.default.holdRelease
                            || behavior['mode'] === button_behavior_mode_1.default.doubleTap)) {
                        behaviorMode = behavior['mode'];
                    }
                    let jsonStages = json['handlers']['xyButtons']['all']['stages'];
                    console.log('jsonStages: ' + jsonStages);
                    [].concat(...this.xyButtons).forEach(btn => {
                        console.log("xyRow: " + btn.row);
                        console.log("xyCol: " + btn.col);
                        btn.mode = behaviorMode;
                        jsonStages.forEach(jsonStage => {
                            btn.addSceneStage(new scene_stage_1.default(jsonStage));
                        });
                    });
                }
            }
        }
    }
    handleMidiEvent(msg) {
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
        }
        else if (event === 176) { // 176 is top-row menu and user buttons
            col = col - 8;
            this.handleMenuBtnEvent(col, vel);
        }
    }
    handleXYBtnEvent(row, col, vel) {
        this.xyButtons[row][col].handleNoteEvent(vel);
    }
    handleLaunchBtnEvent(row, vel) {
        this.toLaunchpad.send('play: ' + row + ' ' + vel);
    }
    handleMenuBtnEvent(col, vel) {
        this.toLaunchpad.send('menu: ' + col + ' ' + vel);
    }
}
exports.default = Scene;
//# sourceMappingURL=scene.js.map