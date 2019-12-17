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
}

export default GnLpUtil;