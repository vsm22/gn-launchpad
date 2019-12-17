"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const max_api_1 = __importDefault(require("max-api"));
class GnLaunchpad {
    constructor() {
        this.lights = ["144, 0, 60", "144, 0, 62"];
        this.colors = {
            'off': 12,
            'red-low': 13,
            'red': 15,
            'red-flash': 11,
            'amber-low': 29,
            'amber': 63,
            'amber-flash': 59,
            'yellow': 62,
            'yellow-flash': 58,
            'green-low': 28,
            'green': 60,
            'green-flash': 56
        };
    }
    run() {
        let msg = '';
        for (let color in this.colors) {
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                }
            }
        }
    }
    setOne(row, col, color) {
        let msg = '144, ' + this._getButtonMidi(row, col) + ', ' + color;
        msg = 'to_launchpad ' + msg;
        max_api_1.default.outlet(msg);
    }
    go() {
        const _this = this;
        for (let i = 0; i < 1000; i++) {
            for (let color in this.colors) {
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 8; col++) {
                        setTimeout(() => {
                            _this.setOne(row, col, color);
                        }, 500);
                    }
                }
            }
        }
    }
    _getButtonMidi(row, col) {
        return (row * 16) + col;
    }
}
const gnl = new GnLaunchpad();
max_api_1.default.addHandler('bang', () => {
    gnl.go();
});
//# sourceMappingURL=gn-launchpad.js.map