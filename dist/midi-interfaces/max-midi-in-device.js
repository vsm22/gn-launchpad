"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const max_api_1 = __importDefault(require("max-api"));
class MaxMidiInDevice {
    onMessage(handler) {
        max_api_1.default.addHandler('from_launchpad', (msg) => {
            handler(msg);
        });
    }
}
exports.default = MaxMidiInDevice;
//# sourceMappingURL=max-midi-in-device.js.map