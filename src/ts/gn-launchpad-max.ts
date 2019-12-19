import Max from 'max-api';
import Launchpad from './gn-launchpad';
import MaxMidiOutDevice from './midi-interfaces/max-midi-out-device';
import MaxMidiInDevice from './midi-interfaces/max-midi-in-device';

const midiInDevice = new MaxMidiInDevice();
const toLaunchpad = new MaxMidiOutDevice('to_launchpad');
const midiOutDevice = new MaxMidiOutDevice('launchpad_midi');
const textOutDevice = new MaxMidiOutDevice('launchpad_text');

const launchpad = new Launchpad(midiInDevice, toLaunchpad, midiOutDevice, textOutDevice, '');

Max.addHandler('from_launchpad', (msg) => {
    launchpad.handleMidiMessage(msg);
});

