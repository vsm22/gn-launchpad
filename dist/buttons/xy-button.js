"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const button_behavior_mode_1 = __importDefault(require("./button-behavior-mode"));
const gn_lp_util_1 = __importDefault(require("../gn-lp-util"));
class XYButton {
    constructor(midiIn, toLauchpad, row, col) {
        this.row = 0;
        this.col = 0;
        this.curStageIdx = 0;
        this.sceneStages = [];
        this.behaviorMode = button_behavior_mode_1.default.toggle;
        this.waitingToRelease = false;
        this.midiIn = midiIn;
        this.toLaunchpad = toLauchpad;
        this.row = row;
        this.col = col;
    }
    addSceneStage(sceneStage) {
        this.sceneStages.push(sceneStage);
    }
    handleNoteEvent(vel) {
        if (!this.waitingToRelease) {
            if (this.behaviorMode === button_behavior_mode_1.default.push) {
            }
            else if (this.behaviorMode === button_behavior_mode_1.default.toggle) {
                if (vel > 0) {
                    this.nextStage();
                }
            }
            else if (this.behaviorMode === button_behavior_mode_1.default.toggleRelease) {
                if (vel === 0) {
                    this.nextStage();
                }
            }
            else if (this.behaviorMode === button_behavior_mode_1.default.hold) {
                if (vel > 0) {
                    setTimeout(() => this.waitingToRelease = true, 1000);
                    // start timer
                    // ignore next release
                }
            }
            else if (this.behaviorMode === button_behavior_mode_1.default.holdRelease) {
            }
            else if (this.behaviorMode === button_behavior_mode_1.default.doubleTap) {
            }
        }
        else if (vel === 0) {
            this.waitingToRelease = false;
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
        this.toLaunchpad.send("144 " + gn_lp_util_1.default.getXYButton(this.row, this.col) + " " + curStage.color);
        this.executeOthers();
    }
    executeOthers() {
        let curStage = this.sceneStages[this.curStageIdx];
        curStage.others.forEach(other => {
            console.log("other " + other.row + " " + other.col + " " + "144 " + gn_lp_util_1.default.getXYButton(other.row, other.col) + " " + other.color);
            this.toLaunchpad.send("144 " + gn_lp_util_1.default.getXYButton(other.row, other.col) + " " + other.color);
        });
    }
}
exports.default = XYButton;
//# sourceMappingURL=xy-button.js.map