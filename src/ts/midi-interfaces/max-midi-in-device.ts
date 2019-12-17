import MidiInDeviceInterface from './midi-in-device-interface';
import Max from 'max-api';

class MaxMidiInDevice implements MidiInDeviceInterface {

    onMessage(handler : (msg : string) => void) : void {
        Max.addHandler('from_launchpad', (msg) => {
            handler(msg);
        });
    }
}

export default MaxMidiInDevice;