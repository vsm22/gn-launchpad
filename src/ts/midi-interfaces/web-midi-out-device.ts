import MidiOutDeviceInterface from './midi-out-device-interface';

class WebMidiOutDevice implements MidiOutDeviceInterface {

    prefix: string = '';
    midiAccess: object = null;

    constructor(prefix: string) {
        if (prefix != undefined && prefix != null && prefix != '') {
            this.prefix = prefix;
        }

        navigator.requestMIDIAccess()
            .then(midiAccess => {
                this.midiAccess = midiAccess;
                console.log('Web MIDI init Success');
            },
            () => {
                console.log('Web MIDI init Failure');
            });
    }

    send(msg : string): void {
        // TODO:
        // Max.outlet(this.prefix + ' ' + msg);
    }
}

export default MaxMidiOutDevice;