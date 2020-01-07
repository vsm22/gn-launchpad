"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MidiEvent {
    constructor(midiBytes, timestamp) {
        this.midiBytes = [];
        this.timestamp = 0;
        midiBytes.forEach((byte, i) => {
            this.midiBytes[i] = byte;
        });
        this.timestamp = timestamp;
    }
}
exports.default = MidiEvent;
//# sourceMappingURL=midi-event.js.map