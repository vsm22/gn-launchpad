"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SideEffect {
    constructor() {
        this.midiBytes = [];
        this.colorCode = null;
        this.delay = null;
    }
    setMidiBytes(midiBytes) {
        midiBytes.forEach((byte, i) => {
            this.midiBytes[i] = byte;
        });
    }
    setColorCode(colorCode) {
        this.colorCode = colorCode;
    }
    setDelay(delay) {
        this.delay = delay;
    }
}
exports.default = SideEffect;
//# sourceMappingURL=side-effect.js.map