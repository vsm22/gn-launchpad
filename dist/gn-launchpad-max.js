"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const max_api_1 = __importDefault(require("max-api"));
const gn_launchpad_1 = __importDefault(require("./gn-launchpad"));
const max_midi_out_device_1 = __importDefault(require("./midi-interfaces/max-midi-out-device"));
const max_midi_in_device_1 = __importDefault(require("./midi-interfaces/max-midi-in-device"));
const midiInDevice = new max_midi_in_device_1.default();
const toLaunchpad = new max_midi_out_device_1.default('to_launchpad');
const midiOutDevice = new max_midi_out_device_1.default('launchpad_midi');
const textOutDevice = new max_midi_out_device_1.default('launchpad_text');
const launchpad = new gn_launchpad_1.default(midiInDevice, toLaunchpad, midiOutDevice, textOutDevice, '');
max_api_1.default.addHandler('from_launchpad', (msg) => {
    launchpad.handleMidiMessage(msg);
});
//# sourceMappingURL=gn-launchpad-max.js.map