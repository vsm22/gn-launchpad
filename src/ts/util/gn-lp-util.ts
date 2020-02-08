import GNLPLoader from "../core/gn-lp-loader";

class GnLpUtil {

    static colors = {
        'off': 12,
        'red-low': 13,
        'red': 15,
        'red-flash': 11,
        'amber-low': 29,
        'amber': 63,
        'amber-flash': 59,
        'yellow': 62,
        'yellow-flash': 58,
        'green-low': 28,
        'green': 60,
        'green-flash': 56
    }

    static getXYButton(row: number, col: number) {
        return (row * 16) + col;
    }

    /**
     * Get row and col of button for given midi pitch number
     * @param midiPitch
     */
    static getRowCol(midiPitch: number): Array<number> {

        let rowcol: Array<number>;

        let row = Math.floor(midiPitch / 16); 
        let col = midiPitch % 16;
        rowcol = [row, col];

        return rowcol;
    }

    static parseColor(colorName: string): number {
        return this.colors[colorName];
    }

    /**
     * Get the MIDI bytes for the corresponding XY Button by row and col.
     * @param row 
     * @param col 
     */
    static getXYButtonMidiBytes(row: number, col: number): Array<number> {
        let midiBytes = GNLPLoader.xyButtonMap.get(row + ' ' + col);
        return midiBytes;
    }

    /**
     * Get the row col for a particular midi byte combination
     * @param byte0
     * @param byte1
     */
    static getXYButtonRowColFromMidiBytes(byte0: number, byte1: number): Array<number> {
        let xyArr: Array<number> = [];
        GNLPLoader.xyButtonMap.forEach((val: Array<number>, key: string) => {
            if (val[0] === byte0 && val[1] === byte1) {
                let rowColStrArr: Array<string> = key.split(' ');
                xyArr[0] = parseInt(rowColStrArr[0]);
                xyArr[1] = parseInt(rowColStrArr[1]);
            }
        });
        return xyArr;
    }
}

export default GnLpUtil;