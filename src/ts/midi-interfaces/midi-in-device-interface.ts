interface MidiInDeviceInterface {
    onMessage(handler : (msg : string) => void) : void;
}

export default MidiInDeviceInterface;