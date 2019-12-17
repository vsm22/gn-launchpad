import Max from 'max-api';
import Util from './gn-lp-util';
import MidiInDeviceInterface from './midi-interfaces/midi-in-device-interface';
import MidiOutDeviceInterface from './midi-interfaces/midi-out-device-interface';
import OutputCodes from './output-codes';

class GnLaunchpad {

    midiIn : MidiInDeviceInterface;
    midiOut: MidiOutDeviceInterface;

    constructor(midiIn : MidiInDeviceInterface, midiOut : MidiOutDeviceInterface) {
        this.midiIn = midiIn;
        this.midiOut = midiOut;
        this.reset();
    }

    onMessage(handler : (msg : string) => void) : void {
        this.midiIn.onMessage((msg) => {
            let midiBytes : Array<number> = msg.split(' ').map(byteStr => parseInt(byteStr));
            let event = midiBytes[0];
            let rowCol = Util.getRowCol(midiBytes[1]);
            let row = rowCol[0];
            let col = rowCol[1];
            let vel = midiBytes[2];
            
            // 144 is button grid (cols 0 - 7) and right-hand-side 'play' buttons (col 8)
            if (event === 144) {
                
                // is it X-Y grid buttons ( < 8) or right-hand-side 'play' buttons?
                if (col < 8) {
                    this.handleXYGridEvent(row, col, vel);
                } else {
                    this.handlePlayBtnEvent(row, vel);
                }
            
            // 176 is top-row menu and user buttons
            } else if (event === 176) {
                col = col - 8;     
                this.handleMenuBtnEvent(col, vel);
            } 
        });
    }

    handleXYGridEvent(row : number, col : number, vel : number) {
        this.midiOut.send("xy: " + row + " " + col + " " + vel);
    }

    handlePlayBtnEvent(row : number, vel : number) {
        this.midiOut.send('play: ' + row + ' ' + vel);
    }

    handleMenuBtnEvent(col : number, vel : number) {
        this.midiOut.send('menu: ' + col + ' ' + vel);
    }

    reset() {
        this.midiOut.send(OutputCodes.reset);
    }

    lowBrightnessTest() {
        this.midiOut.send(OutputCodes.lowBrightnessTest);
    }

    mediumBrightnessTest() {
        this.midiOut.send(OutputCodes.mediumBrightnessTest);
    }

    fullBrightnessTest() {
        this.midiOut.send(OutputCodes.fullBrightnessTest);
    }
}

export default GnLaunchpad;