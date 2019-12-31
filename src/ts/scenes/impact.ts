import Util from '../gn-lp-util';

class Impact {
    row : number = 0;
    col : number = 0;
    colorCode : number = null;
    delay : number = null;
    stageIndex : number = null;

    constructor(json : object, row : number, col : number) {

        this.row = row;
        this.col = col;

        if (json['color'] !== null && json['color'] !== undefined) {
            this.colorCode = Util.parseColor(json['color']);
        }

        if (json['colorCode'] !== null && json['colorCode'] !== undefined) {
            this.colorCode = json['colorCode'];
        }

        if (json['delay'] !== null && json['delay'] !== undefined) {
            this.delay = json['delay'];
        }

        if (json['stageIndex'] !== null && json['stageIndex'] !== undefined) {
            this.stageIndex = json['stageIndex'];
        }
    }
}

export default Impact;