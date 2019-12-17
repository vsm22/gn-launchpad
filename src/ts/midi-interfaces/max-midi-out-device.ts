import MidiOutDeviceInterface from './midi-out-device-interface';
import Max from 'max-api';

class MaxMidiOutDevice implements MidiOutDeviceInterface {
    send(msg : string) : void {
        Max.outlet('to_launchpad ' + msg);
    }
}

export default MaxMidiOutDevice;