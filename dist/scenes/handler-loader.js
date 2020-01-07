"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = __importDefault(require("./handler"));
const handler_type_1 = __importDefault(require("./handler-type"));
const handler_state_1 = __importDefault(require("./handler-state"));
const gn_lp_util_1 = __importDefault(require("../gn-lp-util"));
const event_type_1 = __importDefault(require("./event-type"));
const side_effect_1 = __importDefault(require("./side-effect"));
class HandlerLoader {
    /**
     * Create the necessary handlers from a single handler json definition.
     * Note - the handlerJson object being passed here is a single handler
     * definition. It may return an array of one, several, or many handlers
     * depedning on the row and col specification.
     */
    static loadHandlers(handlerJson) {
        let handlers = [];
        let type = handler_type_1.default.midi;
        switch (handlerJson['type']) {
            case 'xyButton':
                type = handler_type_1.default.xyButton;
                break;
            case 'menuButton':
                type = handler_type_1.default.menuButton;
                break;
            case 'launchButton':
                type = handler_type_1.default.launchButton;
                break;
            case 'midi':
                type = handler_type_1.default.midi;
                break;
            default: break;
        }
        // Create appropriate number of handlers and set the midi bytes
        if (type === handler_type_1.default.xyButton) {
            let rowJson = handlerJson['row'] !== undefined ? handlerJson['row'] : 'all';
            let colJson = handlerJson['col'] !== undefined ? handlerJson['col'] : 'all';
            let rows = [];
            let cols = [];
            if (typeof rowJson === 'number') {
                rows.push(rowJson);
            }
            if (typeof colJson === 'number') {
                cols.push(colJson);
            }
            if (rowJson === 'all') {
                for (let r = 0; r < 8; r++) {
                    rows.push(r);
                }
            }
            if (colJson === 'all') {
                for (let c = 0; c < 8; c++) {
                    cols.push(c);
                }
            }
            rows.forEach(row => {
                cols.forEach(col => {
                    let buttonMidiBytes = gn_lp_util_1.default.getXYButtonMidiBytes(row, col);
                    let handler = new handler_1.default();
                    handler.setMidiBytes(buttonMidiBytes);
                    handlers.push(handler);
                });
            });
        }
        else if (type === handler_type_1.default.launchButton) {
        }
        else if (type === handler_type_1.default.menuButton) {
        }
        else {
        }
        handlers.forEach(handler => {
            let handlerStates = [];
            // We need to do this inside handler loop because side effects depend on the handler
            let handlerStateJsonArr = handlerJson['handlerStates'] !== undefined ? handlerJson['handlerStates'] : [];
            handlerStateJsonArr.forEach(handlerStateJson => {
                let handlerState = HandlerLoader.loadHandlerState(handlerStateJson, handler);
                handlerStates.push(handlerState);
            });
            handler.setHandlerStates(handlerStates);
        });
        return handlers;
    }
    static loadHandlerState(stateJson, handler) {
        let handlerState = new handler_state_1.default();
        let index = stateJson['index'] !== undefined ? stateJson['index'] : 0;
        handlerState.setIndex(index);
        let color = stateJson['color'] !== undefined ? stateJson['color'] : 'off';
        let colorCode = gn_lp_util_1.default.parseColor(color);
        colorCode = stateJson['colorCode'] !== undefined ? stateJson['colorCode'] : colorCode;
        handlerState.setColorCode(colorCode);
        let transitionsJson = stateJson['transitions'] !== undefined ? stateJson['transitions'] : [];
        let transitions = HandlerLoader.loadTransitions(transitionsJson);
        handlerState.setTransitions(transitions);
        let sideEffectsJson = stateJson['sideEffects'] !== undefined ? stateJson['sideEffects'] : [];
        let sideEffects = HandlerLoader.loadSideEffects(sideEffectsJson, handler);
        handlerState.setSideEffects(sideEffects);
        return handlerState;
    }
    static loadTransitions(transitionsJson) {
        let transitions = new Map();
        transitionsJson.forEach(transitionJson => {
            let eventTypeStr = transitionJson['eventType'] !== undefined ? transitionsJson['interaction'] : 'midiEvent';
            let eventType = event_type_1.default.midiEvent;
            switch (eventTypeStr) {
                case 'push':
                    eventType = event_type_1.default.push;
                    break;
                case 'release':
                    eventType = event_type_1.default.release;
                    break;
                case 'hold':
                    eventType = event_type_1.default.hold;
                    break;
                case 'holdRelease':
                    eventType = event_type_1.default.holdRelease;
                    break;
                case 'longHold':
                    eventType = event_type_1.default.longHold;
                    break;
                case 'longHoldRelease':
                    eventType = event_type_1.default.longHoldRelease;
                    break;
                case 'doubleTap':
                    eventType = event_type_1.default.doubleTap;
                    break;
                case 'midiEvent':
                    eventType = event_type_1.default.midiEvent;
                    break;
                default: break;
            }
            let toIdx = transitionJson['toIndex'];
            transitions.set(eventType, toIdx);
        });
        transitions.forEach((val, key) => {
            console.log('transition: ' + key + ' ' + val);
        });
        return transitions;
    }
    static loadSideEffects(sideEffectsJsonArr, handler) {
        let sideEffects = [];
        sideEffectsJsonArr.forEach(sideEffectJson => {
            let rowJson = sideEffectJson['row'] !== undefined ? sideEffectJson['row'] : 'all';
            let colJson = sideEffectJson['col'] !== undefined ? sideEffectJson['col'] : 'all';
            let color = sideEffectJson['color'] !== undefined ? sideEffectJson['color'] : 'off';
            let colorCode = gn_lp_util_1.default.parseColor(color);
            colorCode = sideEffectJson['colorCode'] !== undefined ? sideEffectJson['colorCode'] : colorCode;
            let delay = sideEffectJson['delay'] !== undefined ? sideEffectJson['delay'] : 0;
            let rows = [];
            let cols = [];
            let handlerRowCol = gn_lp_util_1.default.getXYButtonRowColFromMidiBytes(handler.midiBytes[0], handler.midiBytes[1]);
            if (typeof rowJson === 'number') {
                rows.push(rowJson);
            }
            else if (rowJson === 'all') {
                for (let r = 0; r < 8; r++) {
                    rows.push(r);
                }
            }
            else if (rowJson === 'same') {
                let handlerRow = handlerRowCol[0];
                rows.push(handlerRow);
            }
            if (typeof colJson === 'number') {
                cols.push(colJson);
            }
            else if (colJson === 'all') {
                for (let c = 0; c < 8; c++) {
                    cols.push(c);
                }
            }
            else if (colJson === 'same') {
                let handlerCol = handlerRowCol[1];
                cols.push(handlerCol);
            }
            rows.forEach(row => {
                cols.forEach(col => {
                    if (row !== handlerRowCol[0] || col !== handlerRowCol[1]) {
                        let sideEffect = new side_effect_1.default();
                        let midiBytes = gn_lp_util_1.default.getXYButtonMidiBytes(row, col);
                        sideEffect.setMidiBytes(midiBytes);
                        sideEffect.setDelay(delay);
                        sideEffect.setColorCode(colorCode);
                        sideEffects.push(sideEffect);
                    }
                });
            });
        });
        return sideEffects;
    }
}
exports.default = HandlerLoader;
//# sourceMappingURL=handler-loader.js.map