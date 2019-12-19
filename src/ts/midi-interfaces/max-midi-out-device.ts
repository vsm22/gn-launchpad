import MidiOutDeviceInterface from './midi-out-device-interface';
import Max from 'max-api';

class MaxMidiOutDevice implements MidiOutDeviceInterface {

    prefix : string = '';

    constructor(prefix : string) {
        if (prefix != undefined && prefix != null && prefix != '') {
            this.prefix = prefix;
        }
    }

    send(msg : string) : void {
        Max.outlet(this.prefix + ' ' + msg);
    }
}

export default MaxMidiOutDevice;