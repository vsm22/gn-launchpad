"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_type_1 = __importDefault(require("./event-type"));
const gn_lp_util_1 = __importDefault(require("../gn-lp-util"));
class Handler {
    constructor() {
        this.type = null;
        this.midiBytes = [];
        this.handlerStates = [];
        this.curHandlerState = null;
        this.handlerEvents = [];
        this.subscribers = [];
    }
    setType(type) {
        this.type = type;
    }
    setMidiBytes(midiBytes) {
        midiBytes.forEach((byte, i) => {
            this.midiBytes[i] = byte;
        });
    }
    setHandlerStates(handlerStates) {
        this.handlerStates = [];
        handlerStates.forEach(handlerState => {
            this.handlerStates.push(handlerState);
        });
        let minIdx = this.handlerStates[0].index;
        this.handlerStates.forEach(handlerState => minIdx = Math.min(minIdx, handlerState.index));
        console.log('this.handlerStates.length: ' + this.handlerStates.length);
        this.curHandlerState = this.handlerStates.find(handlerState => handlerState.index === minIdx);
        console.log('this.curHandlerState: ' + this.curHandlerState);
    }
    subscribe(scene) {
        this.subscribers.push(scene);
    }
    handleEvent(handlerEvent) {
        let handlerState = this.curHandlerState.clone();
        if (handlerEvent.midiBytes[2] > 0) {
            // Publish push event
            this.publishEvent(event_type_1.default.push, handlerState);
            // If there was another push event within double-tap threshold time, publish double tap event
            if (this.handlerEvents[1].midiBytes[2] > 0
                && handlerEvent.timestamp - this.handlerEvents[1].timestamp > gn_lp_util_1.default.launchpadConfig["doubleTapTime"]) {
                this.publishEvent(event_type_1.default.doubleTap, handlerState);
            }
            // If release event has not been published, publish hold event after timeout
            setTimeout(() => {
                if (this.handlerEvents[0].midiBytes[2] > 0) {
                    this.publishEvent(event_type_1.default.hold, handlerState);
                }
            }, gn_lp_util_1.default.launchpadConfig["holdTime"]);
            // If release event has not been published, publish long hold event after timeout
            setTimeout(() => {
                if (this.handlerEvents[0].midiBytes[2] > 0) {
                    this.publishEvent(event_type_1.default.longHold, handlerState);
                }
            }, gn_lp_util_1.default.launchpadConfig["longHoldTime"]);
        }
        else {
            // Publish release event
            this.publishEvent(event_type_1.default.release, handlerState);
            if (this.handlerEvents[0].midiBytes[2] > 0
                && handlerEvent.timestamp - this.handlerEvents[0].timestamp > gn_lp_util_1.default.launchpadConfig["holdTime"]) {
                this.publishEvent(event_type_1.default.holdRelease, handlerState);
            }
            if (this.handlerEvents[0].midiBytes[2] > 0
                && handlerEvent.timestamp - this.handlerEvents[0].timestamp > gn_lp_util_1.default.launchpadConfig["longHoldTime"]) {
                this.publishEvent(event_type_1.default.longHoldRelease, handlerState);
            }
        }
        this.handlerEvents.unshift(handlerEvent);
        if (this.handlerEvents.length > 4) {
            this.handlerEvents = this.handlerEvents.slice(0, 4);
        }
    }
    publishEvent(eventType, handlerState) {
        let nextHandlerStateIdx = handlerState.transitions.get(eventType);
        console.log('nextHandlerStateIdx: ' + nextHandlerStateIdx);
        this.curHandlerState = this.handlerStates.find(hs => hs.index === nextHandlerStateIdx);
        this.subscribers.forEach(scene => {
            console.log('publishEvent this.curHandlerState: ' + this.curHandlerState);
            scene.notify(this);
        });
    }
    /**
     * Transition the current event state to the next state
     * according to the interaction type.
     */
    doTransitionState(interaction) {
        let nextEventStateIdx = this.curHandlerState.getNextEventStateIndex(interaction);
        let nextEventState = this.handlerStates.find(eventState => eventState.index === nextEventStateIdx);
        this.curHandlerState = nextEventState;
        return this.curHandlerState;
    }
}
exports.default = Handler;
//# sourceMappingURL=handler.js.map