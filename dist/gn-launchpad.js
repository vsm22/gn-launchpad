"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const output_codes_1 = __importDefault(require("./output-codes"));
const scene_1 = __importDefault(require("./scenes/scene"));
class GnLaunchpad {
    constructor(midiIn, toLaunchpad, midiOut, textOut, configJsonPath) {
        this.scenes = [];
        this.curSceneIdx = 0;
        this.midiIn = midiIn;
        this.toLaunchpad = toLaunchpad;
        this.midiOut = midiOut;
        this.textOut = textOut;
        configJsonPath = (configJsonPath != undefined && configJsonPath != null && configJsonPath != '') ?
            configJsonPath : './config/launchpad_scenes.json';
        this.loadScenes(configJsonPath);
        this.reset();
    }
    loadScenes(filepath) {
        let configJson = require(filepath);
        if (configJson['scenes']) {
            let scenes = configJson['scenes'];
            scenes.forEach(sceneJson => {
                let newScene = new scene_1.default(this.midiIn, this.toLaunchpad, sceneJson);
                this.scenes.push(newScene);
            });
        }
    }
    handleMidiMessage(msg) {
        this.scenes[this.curSceneIdx].handleMidiEvent(msg);
        //
    }
    reset() {
        this.toLaunchpad.send(output_codes_1.default.reset);
    }
    lowBrightnessTest() {
        this.toLaunchpad.send(output_codes_1.default.lowBrightnessTest);
    }
    mediumBrightnessTest() {
        this.toLaunchpad.send(output_codes_1.default.mediumBrightnessTest);
    }
    fullBrightnessTest() {
        this.toLaunchpad.send(output_codes_1.default.fullBrightnessTest);
    }
}
exports.default = GnLaunchpad;
//# sourceMappingURL=gn-launchpad.js.map