"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const button_behavior_mode_1 = __importDefault(require("./button-behavior-mode"));
class XYButton {
    constructor(midiIn, toLauchpad) {
        this.curStageIdx = 0;
        this.stages = [];
        this.behaviorMode = button_behavior_mode_1.default.toggle;
        this.waitingToRelease = false;
        this.midiIn = midiIn;
        this.toLaunchpad = toLauchpad;
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
        this.curStageIdx = (this.curStageIdx + 1) % this.stages.length;
    }
    executeCurStage() {
        let curStage = this.stages[this.curStageIdx];
    }
}
exports.default = XYButton;
//# sourceMappingURL=xy-button.js.map