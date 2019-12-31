import Util from '../gn-lp-util';
import Impact from './impact';
import Scene from './scene';

class SceneStage {

    scene : Scene = null;
    stageIndex : number = 0;
    row : number = 0;
    col : number = 0;
    color : number = 0;
    impacts : Array<Impact>  = [];

    constructor(json, row, col, scene) {
        this.scene = scene;
        this.row = row;
        this.col = col;

        this.stageIndex = json['stageIndex'] !== null && json['stageIndex'] !== undefined ? json['stageIndex'] : 0;
        this.color = json['color'] ? Util.parseColor(json['color']) : this.color;
        this.color = json['colorCode'] ? json['colorCode'] : this.color;

        if (json['impacts']) {
            json['impacts'].forEach(impactJson => this.addImpact(impactJson));
        }
    }

    addImpact(impactJson) {

        let rows = [];
        let cols = [];

        if (impactJson['row'] === 'all') {
            for (let row = 0; row < 8; row++) {
                rows.push(row);
            }
        } else if (impactJson['row'] === 'same') {
            rows.push(this.row);
        } else if (typeof impactJson['row'] === 'number') {
            rows.push(impactJson['row']);
        }

        if (impactJson['col'] === 'all') {
            for (let col = 0; col < 8; col++) {
                cols.push(col);
            }
        } else if (impactJson['col'] === 'same') {
            cols.push(this.row);
        } else if (typeof impactJson['col'] === 'number') {
            cols.push(impactJson['col']);
        }

        rows.forEach(row => {
            cols.forEach(col => {
                this.impacts.push(new Impact(impactJson, row, col));
            });
        })

    }
}

export default SceneStage;