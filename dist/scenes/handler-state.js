"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HandlerState {
    constructor() {
        this.index = null;
        this.transitions = new Map();
        this.colorCode = null;
        this.sideEffects = [];
    }
    clone() {
        let newHandlerState = new HandlerState();
        newHandlerState.setIndex(this.index);
        newHandlerState.setColorCode(this.colorCode);
        newHandlerState.setTransitions(this.transitions);
        newHandlerState.setSideEffects(this.sideEffects);
        return newHandlerState;
    }
    setIndex(index) {
        this.index = index;
    }
    setColorCode(colorCode) {
        this.colorCode = colorCode;
    }
    setTransitions(transitions) {
        this.transitions = new Map();
        transitions.forEach((val, key) => {
            this.transitions.set(key, val);
        });
    }
    setSideEffects(sideEffects) {
        this.sideEffects = [];
        sideEffects.forEach(sideEffect => {
            this.sideEffects.push(sideEffect);
        });
    }
    getNextEventStateIndex(interaction) {
        return this.transitions.get(interaction);
    }
}
exports.default = HandlerState;
//# sourceMappingURL=handler-state.js.map