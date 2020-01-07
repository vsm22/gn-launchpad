"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const midi_event_1 = __importDefault(require("./midi-event"));
const handler_loader_1 = __importDefault(require("./handler-loader"));
class Scene {
    constructor(midiIn, toLaunchpad, sceneJson) {
        this.sceneName = '';
        this.sceneIndex = 0;
        this.handlers = [];
        this.midiIn = midiIn;
        this.toLaunchpad = toLaunchpad;
        this.loadScene(sceneJson);
    }
    handleMidiEvent(msg) {
        let midiBytes = msg.split(' ').map(byteStr => parseInt(byteStr));
        let midiEvent = new midi_event_1.default(midiBytes, Date.now());
        let handler = this.handlers.find(handler => handler.midiBytes[0] === midiBytes[0]
            && handler.midiBytes[1] === midiBytes[1]);
        if (handler !== undefined) {
            handler.handleEvent(midiEvent);
        }
    }
    notify(handler) {
        console.log('Notify...');
        let msg = this.constructToLaunchpadMessage(handler);
        this.toLaunchpad.send(msg);
        this.sendSideEffects(handler);
    }
    constructToLaunchpadMessage(handler) {
        console.log('Handler: ' + handler);
        console.log('Curhandlerstate: ' + handler.curHandlerState);
        let msg = handler.midiBytes[0] + ' ' +
            handler.midiBytes[1] + ' ' +
            handler.curHandlerState.colorCode;
        return msg;
    }
    sendSideEffects(handler) {
        let sideEffects = handler.curHandlerState.sideEffects;
        sideEffects.forEach(sideEffect => {
        });
    }
    loadScene(sceneJson) {
        this.sceneName = sceneJson['sceneName'] !== undefined ? sceneJson['sceneName'] : this.sceneName;
        this.sceneIndex = sceneJson['sceneIndex'] !== undefined ? sceneJson['sceneIndex'] : this.sceneIndex;
        let handlerJsonArr = sceneJson['handlers'] !== undefined ? sceneJson['handlers'] : [];
        handlerJsonArr.forEach(handlerJson => {
            let handlers = handler_loader_1.default.loadHandlers(handlerJson);
            handlers.forEach(handler => {
                handler.subscribe(this);
                this.handlers.push(handler);
            });
        });
    }
}
exports.default = Scene;
//# sourceMappingURL=scene.js.map