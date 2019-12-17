"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gn_lp_util_1 = __importDefault(require("./gn-lp-util"));
const output_codes_1 = __importDefault(require("./output-codes"));
class GnLaunchpad {
    constructor(midiIn, midiOut) {
        this.midiIn = midiIn;
        this.midiOut = midiOut;
        this.reset();
    }
    onMessage(handler) {
        this.midiIn.onMessage((msg) => {
            let midiBytes = msg.split(' ').map(byteStr => parseInt(byteStr));
            let event = midiBytes[0];
            let rowCol = gn_lp_util_1.default.getRowCol(midiBytes[1]);
            let row = rowCol[0];
            let col = rowCol[1];
            let vel = midiBytes[2];
            // 144 is button grid (cols 0 - 7) and right-hand-side 'play' buttons (col 8)
            if (event === 144) {
                // is it X-Y grid buttons ( < 8) or right-hand-side 'play' buttons?
                if (col < 8) {
                    this.handleXYGridEvent(row, col, vel);
                }
                else {
                    this.handlePlayBtnEvent(row, vel);
                }
                // 176 is top-row menu and user buttons
            }
            else if (event === 176) {
                col = col - 8;
                this.handleMenuBtnEvent(col, vel);
            }
        });
    }
    handleXYGridEvent(row, col, vel) {
        this.midiOut.send("xy: " + row + " " + col + " " + vel);
    }
    handlePlayBtnEvent(row, vel) {
        this.midiOut.send('play: ' + row + ' ' + vel);
    }
    handleMenuBtnEvent(col, vel) {
        this.midiOut.send('menu: ' + col + ' ' + vel);
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