"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const button_behavior_mode_1 = __importDefault(require("./button-behavior-mode"));
const gn_lp_util_1 = __importDefault(require("../gn-lp-util"));
class XYButton {
    constructor(midiIn, toLauchpad, row, col, scene) {
        this.row = 0;
        this.col = 0;
        this.curStageIdx = 0;
        this.scene = null;
        this.sceneStages = [];
        this.behaviorMode = button_behavior_mode_1.default.toggle;
        this.waitingToRelease = false;
        this.midiIn = midiIn;
        this.toLaunchpad = toLauchpad;
        this.row = row;
        this.col = col;
        this.scene = scene;
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
        this.curStageIdx = (this.curStageIdx + 1) % this.sceneStages.length;
        this.executeCurStage();
    }
    executeCurStage() {
        let curStage = this.sceneStages.find(sceneStage => sceneStage.stageIndex === this.curStageIdx);
        this.toLaunchpad.send("144 " + gn_lp_util_1.default.getXYButton(this.row, this.col) + " " + curStage.color);
        this.executeImpacts();
    }
    executeImpacts() {
        let curStage = this.sceneStages.find(sceneStage => sceneStage.stageIndex === this.curStageIdx);
        curStage.impacts.forEach(impact => {
            if (impact.row !== this.row || impact.col !== this.col) {
                if (impact.colorCode) {
                    let colorCodeMessage = "144 " + gn_lp_util_1.default.getXYButton(impact.row, impact.col) + " " + impact.colorCode;
                    if (impact.delay) {
                        setTimeout(() => this.toLaunchpad.send(colorCodeMessage), impact.delay);
                    }
                    else {
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
exports.default = XYButton;
//# sourceMappingURL=xy-button.js.map