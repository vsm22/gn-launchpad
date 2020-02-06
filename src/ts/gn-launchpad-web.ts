import Launchpad from './gn-launchpad';
import WebMidiOutDevice from './midi-interfaces/max-midi-out-device';
import WebMidiInDevice from './midi-interfaces/max-midi-in-device';

const midiInDevice = new WebMidiInDevice();
const toLaunchpad = new WebMidiOutDevice('');
const midiOutDevice = new WebMidiOutDevice('');
const textOutDevice = new WebMidiOutDevice('');

const launchpad = new Launchpad(midiInDevice, toLaunchpad, midiOutDevice, textOutDevice);