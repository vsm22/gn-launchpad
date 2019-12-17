"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const max_api_1 = __importDefault(require("max-api"));
const gn_launchpad_1 = __importDefault(require("./gn-launchpad"));
const max_midi_out_device_1 = __importDefault(require("./midi-interfaces/max-midi-out-device"));
const max_midi_in_device_1 = __importDefault(require("./midi-interfaces/max-midi-in-device"));
const lp = new gn_launchpad_1.default(new max_midi_in_device_1.default(), new max_midi_out_device_1.default());
lp.onMessage(msg => max_api_1.default.outlet(msg));
let isBang = false;
max_api_1.default.addHandler('bang', () => {
    if (isBang) {
        lp.reset();
        isBang = false;
    }
    else {
        lp.fullBrightnessTest();
        isBang = true;
    }
});
//# sourceMappingURL=gn-launchpad-max.js.map