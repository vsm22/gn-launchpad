import Max from 'max-api';

class GnLaunchpad {

    lights : Array<string> = ["144, 0, 60", "144, 0, 62"];

    colors = {
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

    run() {

        let msg : string = '';

        for (let color in this.colors) {
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    
                }
            }   
        }
    }

    setOne(row, col, color) {
        let msg = '144, ' + this._getButtonMidi(row, col) + ', ' + color;
        msg = 'to_launchpad ' + msg;
        Max.outlet(msg);
    }

    go() {

        const _this = this;

        for (let i = 0; i < 1000; i++) {
            for (let color in this.colors) {
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 8; col++) {
                        setTimeout(() => {
                            _this.setOne(row, col, color); 
                        }, 500);
                    }
                }   
            }
        }  
    }

    _getButtonMidi(row, col) {
        return (row * 16) + col;
    }
}

const gnl = new GnLaunchpad();

Max.addHandler('bang', () => {
    gnl.go();
});