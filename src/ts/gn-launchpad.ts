import Max from 'max-api';
import Util from './gn-lp-util';
import MidiInDeviceInterface from './midi-interfaces/midi-in-device-interface';
import MidiOutDeviceInterface from './midi-interfaces/midi-out-device-interface';
import OutputCodes from './output-codes';
import Scene from './scenes/scene';

class GnLaunchpad {

    midiIn : MidiInDeviceInterface;
    midiOut: MidiOutDeviceInterface;

    scenes : Array<Scene>;
    curScene : Scene;

    constructor(midiIn : MidiInDeviceInterface, midiOut : MidiOutDeviceInterface) {
        this.midiIn = midiIn;
        this.midiOut = midiOut;
        this.reset();
    }

    loadScenes(scenes : Array<object>) {
        scenes.forEach(scene => {

        });
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

    //FIXME
    curCount = 0;

    handleXYGridEvent(row : number, col : number, vel : number) {
        this.midiOut.send("vel: " + vel);

        if (vel > 0) {
            let colors = ['red', 'green', 'amber', 'off'];
            this.midiOut.send('144 ' + Util.getXYButton(row, col) + ' ' + Util.colors[colors[this.curCount % colors.length]]);
            this.curCount++;
        }
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