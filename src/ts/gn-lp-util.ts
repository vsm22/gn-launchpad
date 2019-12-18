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

    static getXYButton(row : number, col : number) {
        return (row * 16) + col;
    }

    /**
     * Get row and col of button for given midi pitch number
     * @param midiPitch
     */
    static getRowCol(midiPitch : number) : Array<number> {

        let rowcol : Array<number>;

        let row = Math.floor(midiPitch / 16); 
        let col = midiPitch % 16;
        rowcol = [row, col];

        return rowcol;
    }

    static parseColor(colorName : string) {
        return this.colors[colorName];
    }
}

export default GnLpUtil;