import Util from '../gn-lp-util';

class SceneStage {

    row : number = 0;
    col : number = 0;
    color : number = 0;
    others : Array<SceneStage> = [];

    constructor(json, row, col) {
        this.row = row;
        this.col = col;

        this.color = json['color'] ? Util.parseColor(json['color']) : this.color;
        this.color = json['colorCode'] ? json['colorCode'] : this.color;

        if (json['others']) {
            json['others'].forEach(other => {

                // For all other rows
                if (other['row'] === 'all') {

                    // For all other rows and cols
                    if (other['col'] === 'all') {
                        for (let row = 0; row < 8; row++) {
                            for (let col = 0; col < 8; col++) {
                                if (row !== this.row || col != this.col) {
                                    let otherSceneStage = new SceneStage(other, row, col);
                                    this.others.push(otherSceneStage);
                                }
                            }
                        }
                    }
                }
            });
        }
    }
}

export default SceneStage;