"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebMidiOutDevice {
    constructor(prefix) {
        this.prefix = '';
        if (prefix != undefined && prefix != null && prefix != '') {
            this.prefix = prefix;
        }
        window.navigator.requestMIDIAccess()
            .then(midiAccess => {
            console.log('Success');
        }, () => {
            console.log('Failure');
        });
    }
    send(msg) {
        // TODO:
        // Max.outlet(this.prefix + ' ' + msg);
    }
}
exports.default = MaxMidiOutDevice;
//# sourceMappingURL=web-midi-out-device.js.map