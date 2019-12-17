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
}
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