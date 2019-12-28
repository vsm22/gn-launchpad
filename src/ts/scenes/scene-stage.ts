import Util from '../gn-lp-util';

class SceneStage {

    color : number = 0;

    constructor(json) {
        this.color = json['color'] ? Util.parseColor(json['color']) : this.color;
        this.color = json['colorCode'] ? json['colorCode'] : this.color;
    }
}

export default SceneStage;