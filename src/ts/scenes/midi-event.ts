class MidiEvent {
    midiBytes : Array<number> = [];
    timestamp : number = 0;

    constructor(midiBytes : Array<number>, timestamp : number) {
        midiBytes.forEach((byte, i) => {
            this.midiBytes[i] = byte;
        });
        this.timestamp = timestamp;
    }
}

export default MidiEvent;