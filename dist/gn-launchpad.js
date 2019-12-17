"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const output_codes_1 = __importDefault(require("./output-codes"));
class GnLaunchpad {
    constructor(midiIn, midiOut) {
        this.midiIn = midiIn;
        this.midiOut = midiOut;
        this.reset();
    }
    onMessage(handler) {
        this.midiIn.onMessage(handler);
    }
    reset() {
        this.midiOut.send(output_codes_1.default.reset);
    }
    lowBrightnessTest() {
        this.midiOut.send(output_codes_1.default.lowBrightnessTest);
    }
    mediumBrightnessTest() {
        this.midiOut.send(output_codes_1.default.mediumBrightnessTest);
    }
    fullBrightnessTest() {
        this.midiOut.send(output_codes_1.default.fullBrightnessTest);
    }
}
exports.default = GnLaunchpad;
//# sourceMappingURL=gn-launchpad.js.map