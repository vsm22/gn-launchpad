"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const max_api_1 = __importDefault(require("max-api"));
class MaxMidiOutDevice {
    constructor(prefix) {
        this.prefix = '';
        if (prefix != undefined && prefix != null && prefix != '') {
            this.prefix = prefix;
        }
    }
    send(msg) {
        max_api_1.default.outlet(this.prefix + ' ' + msg);
    }
}
exports.default = MaxMidiOutDevice;
//# sourceMappingURL=max-midi-out-device.js.map