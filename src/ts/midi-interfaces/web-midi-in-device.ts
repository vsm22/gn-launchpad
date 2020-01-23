import MidiInDeviceInterface from './midi-in-device-interface';

class WebMidiInDevice implements MidiInDeviceInterface {

    constructor() {

    }

    onMessage(handler: (msg: string) => void): void {
        
    }
}

export default WebMidiInDevice;