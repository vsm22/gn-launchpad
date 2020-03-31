import { assert } from 'chai';
import Scene from '../../../src/ts/scenes/scene';
import MidiInDeviceInterface from '../../../src/ts/midi-interfaces/midi-in-device-interface';
import WebMidiInDevice from '../../../src/ts/midi-interfaces/web-midi-in-device';
import WebMidiOutDevice from '../../../src/ts/midi-interfaces/web-midi-out-device';
import { mock } from 'ts-mockito';
import MidiOutDeviceInterface from '../../../src/ts/midi-interfaces/midi-out-device-interface';

describe('Scene', () => {
    it('should initialize a scene', () => {
        const midiIn: MidiInDeviceInterface = mock(WebMidiInDevice);
        const midiOut: MidiOutDeviceInterface = mock(WebMidiOutDevice);
        const result = new Scene(midiIn, midiOut, {});
        assert.exists(result);
    });
});