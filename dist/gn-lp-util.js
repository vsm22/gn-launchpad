"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GnLpUtil {
    static getXYButton(row, col) {
        return (row * 16) + col;
    }
    /**
     * Get row and col of button for given midi pitch number
     * @param midiPitch
     */
    static getRowCol(midiPitch) {
        let rowcol;
        let row = Math.floor(midiPitch / 16);
        let col = midiPitch % 16;
        rowcol = [row, col];
        return rowcol;
    }
    static parseColor(colorName) {
        return this.colors[colorName];
    }
    /**
     * Get the MIDI bytes for the corresponding XY Button by row and col.
     * @param row
     * @param col
     */
    static getXYButtonMidiBytes(row, col) {
        let midiBytes = this.xyButtonMap.get(row + ' ' + col);
        return midiBytes;
    }
    /**
     * Get the row col for a particular midi byte combination
     * @param byte0
     * @param byte1
     */
    static getXYButtonRowColFromMidiBytes(byte0, byte1) {
        let xyArr = [];
        this.xyButtonMap.forEach((val, key) => {
            if (val[0] === byte0 && val[1] === byte1) {
                let rowColStrArr = key.split(' ');
                xyArr[0] = parseInt(rowColStrArr[0]);
                xyArr[1] = parseInt(rowColStrArr[1]);
            }
        });
        return xyArr;
    }
}
GnLpUtil.launchpadConfig = (function () {
    return require('./config/launchpad_config.json');
}());
/**
 * Load and keep a map of MIDI bytes that correspond to each XY Button.
 * The map is loaded from a JSON file called xy_button_map.json, where the mappings are
 * stored by row, col, and mapped to the first two MIDI bytes of the corresponding message.
 * The resultant map is key string contructed from 'row' + 'col', value array of bytes
 */
GnLpUtil.xyButtonMap = (function () {
    let xyButtonMap = new Map();
    let xyButtonMapJson = require('./config/xy_button_map.json');
    for (let row = 0; row < 8; row++) {
        let rowJson = xyButtonMapJson['' + row];
        for (let col = 0; col < 8; col++) {
            let rowColJson = rowJson['' + col];
            xyButtonMap.set(row + ' ' + col, rowColJson);
        }
    }
    return xyButtonMap;
}());
GnLpUtil.colors = {
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
};
exports.default = GnLpUtil;
//# sourceMappingURL=gn-lp-util.js.map