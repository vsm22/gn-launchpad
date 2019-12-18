"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class XYButton {
    constructor(midiIn, toLauchpad) {
        this.curStageIdx = 0;
        this.midiIn = midiIn;
        this.toLaunchpad = toLauchpad;
    }
    handlePush() {
        this.curStageIdx = (this.curStageIdx + 1) % this.stages.length;
        this.stages[this.curStageIdx].
        ;
    }
}
exports.default = XYButton;
//# sourceMappingURL=xy-button.js.map