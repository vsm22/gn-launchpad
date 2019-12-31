"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gn_lp_util_1 = __importDefault(require("../gn-lp-util"));
const impact_1 = __importDefault(require("./impact"));
class SceneStage {
    constructor(json, row, col, scene) {
        this.scene = null;
        this.stageIndex = 0;
        this.row = 0;
        this.col = 0;
        this.color = 0;
        this.impacts = [];
        this.scene = scene;
        this.row = row;
        this.col = col;
        this.stageIndex = json['stageIndex'] !== null && json['stageIndex'] !== undefined ? json['stageIndex'] : 0;
        this.color = json['color'] ? gn_lp_util_1.default.parseColor(json['color']) : this.color;
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
        }
        else if (impactJson['row'] === 'same') {
            rows.push(this.row);
        }
        else if (typeof impactJson['row'] === 'number') {
            rows.push(impactJson['row']);
        }
        if (impactJson['col'] === 'all') {
            for (let col = 0; col < 8; col++) {
                cols.push(col);
            }
        }
        else if (impactJson['col'] === 'same') {
            cols.push(this.row);
        }
        else if (typeof impactJson['col'] === 'number') {
            cols.push(impactJson['col']);
        }
        rows.forEach(row => {
            cols.forEach(col => {
                this.impacts.push(new impact_1.default(impactJson, row, col));
            });
        });
    }
}
exports.default = SceneStage;
//# sourceMappingURL=scene-stage.js.map