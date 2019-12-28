"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gn_lp_util_1 = __importDefault(require("../gn-lp-util"));
class SceneStage {
    constructor(json) {
        this.color = 0;
        this.color = json['color'] ? gn_lp_util_1.default.parseColor(json['color']) : this.color;
        this.color = json['colorCode'] ? json['colorCode'] : this.color;
    }
}
exports.default = SceneStage;
//# sourceMappingURL=scene-stage.js.map