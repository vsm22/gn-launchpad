"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gn_lp_util_1 = __importDefault(require("../gn-lp-util"));
class SceneStage {
    constructor(json, row, col) {
        this.row = 0;
        this.col = 0;
        this.color = 0;
        this.others = [];
        this.row = row;
        this.col = col;
        this.color = json['color'] ? gn_lp_util_1.default.parseColor(json['color']) : this.color;
        this.color = json['colorCode'] ? json['colorCode'] : this.color;
        if (json['others']) {
            json['others'].forEach(other => {
                if (other['row'] === 'all') {
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
exports.default = SceneStage;
//# sourceMappingURL=scene-stage.js.map