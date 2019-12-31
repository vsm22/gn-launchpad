"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gn_lp_util_1 = __importDefault(require("../gn-lp-util"));
class Impact {
    constructor(json, row, col) {
        this.row = 0;
        this.col = 0;
        this.colorCode = null;
        this.delay = null;
        this.stageIndex = null;
        this.row = row;
        this.col = col;
        if (json['color'] !== null && json['color'] !== undefined) {
            this.colorCode = gn_lp_util_1.default.parseColor(json['color']);
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
exports.default = Impact;
//# sourceMappingURL=impact.js.map