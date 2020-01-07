import Util from '../gn-lp-util';

class SideEffect {
    
    midiBytes : Array<number> = [];
    colorCode : number = null;
    delay : number = null;

    setMidiBytes(midiBytes : Array<number>) {
        midiBytes.forEach((byte, i) => {
            this.midiBytes[i] = byte;
        });
    }

    setColorCode(colorCode : number) {
        this.colorCode = colorCode;
    }

    setDelay(delay : number) {
        this.delay = delay;
    }
}

export default SideEffect;