import Handler from './handler';
import HandlerType from './handler-type';
import HandlerState from './handler-state';

import Util from '../gn-lp-util';
import EventType from './event-type';
import SideEffect from './side-effect';

class HandlerLoader {

    /**
     * Create the necessary handlers from a single handler json definition.
     * Note - the handlerJson object being passed here is a single handler
     * definition. It may return an array of one, several, or many handlers
     * depedning on the row and col specification.
     */
    static loadHandlers(handlerJson: object): Array<Handler> {
        
        let handlers: Array<Handler> = [];
        
        let type: HandlerType = HandlerType.midi;
                    
        switch (handlerJson['type']) {
            case 'xyButton': type = HandlerType.xyButton; break;
            case 'menuButton': type = HandlerType.menuButton; break;
            case 'launchButton': type = HandlerType.launchButton; break;
            case 'midi': type = HandlerType.midi; break;
            default: break;
        }

        // Create appropriate number of handlers and set the midi bytes
        if (type === HandlerType.xyButton) {

            let rowJson = handlerJson['row'] !== undefined ? handlerJson['row'] : 'all';
            let colJson = handlerJson['col'] !== undefined ? handlerJson['col'] : 'all';

            let rows : Array<number> = [];
            let cols : Array<number> = [];

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
                    let buttonMidiBytes : Array<number> = Util.getXYButtonMidiBytes(row, col);
                    let handler : Handler = new Handler();
                    handler.setMidiBytes(buttonMidiBytes);
                    handlers.push(handler);
                })
            });
 
        } else if (type === HandlerType.launchButton) {

        } else if (type === HandlerType.menuButton) {

        } else {

        }

        
        handlers.forEach(handler => {

            let handlerStates: Array<HandlerState> = [];

            // We need to do this inside handler loop because side effects depend on the handler
            let handlerStateJsonArr: Array<object> = handlerJson['handlerStates'] !== undefined ? handlerJson['handlerStates'] : [];
            handlerStateJsonArr.forEach(handlerStateJson => {
                let handlerState = HandlerLoader.loadHandlerState(handlerStateJson, handler);
                handlerStates.push(handlerState);
            });
            
            handler.setHandlerStates(handlerStates);
        });

        return handlers;
    }

    static loadHandlerState(stateJson: object, handler: Handler): HandlerState {
        let handlerState = new HandlerState();

        let index = stateJson['index'] !== undefined ? stateJson['index'] : 0;
        handlerState.setIndex(index);

        let color = stateJson['color'] !== undefined ? stateJson['color'] : 'off';
        let colorCode = Util.parseColor(color);
        colorCode = stateJson['colorCode'] !== undefined ? stateJson['colorCode'] : colorCode;
        handlerState.setColorCode(colorCode);

        let transitionsJson = stateJson['transitions'] !== undefined ? stateJson['transitions'] : [];
        let transitions : Map<EventType, number> = HandlerLoader.loadTransitions(transitionsJson);
        handlerState.setTransitions(transitions);

        let sideEffectsJson = stateJson['sideEffects'] !== undefined ? stateJson['sideEffects'] : [];
        let sideEffects : Array<SideEffect> = HandlerLoader.loadSideEffects(sideEffectsJson, handler);
        handlerState.setSideEffects(sideEffects);
        
        return handlerState;
    }

    static loadTransitions(transitionsJson: Array<object>): Map<EventType, number> {

        let transitions: Map<EventType, number> = new Map();
        
        transitionsJson.forEach(transitionJson => {

            let eventTypeStr = transitionJson['eventType'] !== undefined ? transitionsJson['interaction'] : 'midiEvent';
            let eventType : EventType = EventType.midiEvent;
            
            switch (eventTypeStr) {
                case 'push': eventType = EventType.push; break;
                case 'release': eventType = EventType.release; break;
                case 'hold': eventType = EventType.hold; break;
                case 'holdRelease': eventType = EventType.holdRelease; break;
                case 'longHold': eventType = EventType.longHold; break;
                case 'longHoldRelease': eventType = EventType.longHoldRelease; break;
                case 'doubleTap': eventType = EventType.doubleTap; break;
                case 'midiEvent': eventType = EventType.midiEvent; break;
                default: break;
            }

            let toIdx: number = transitionJson['toIndex'];
        
            transitions.set(eventType, toIdx);
        });

        transitions.forEach((val, key) => {
            console.log('transition: ' + key + ' ' + val);
        });
        return transitions;
    }

    static loadSideEffects(sideEffectsJsonArr: Array<object>, handler: Handler): Array<SideEffect> {

        let sideEffects: Array<SideEffect> = [];

        sideEffectsJsonArr.forEach(sideEffectJson => {

            let rowJson : string|number = sideEffectJson['row'] !== undefined ? sideEffectJson['row'] : 'all';
            let colJson : string|number = sideEffectJson['col'] !== undefined ? sideEffectJson['col'] : 'all';

            let color = sideEffectJson['color'] !== undefined ? sideEffectJson['color'] : 'off';
            let colorCode = Util.parseColor(color);
            colorCode = sideEffectJson['colorCode'] !== undefined ? sideEffectJson['colorCode'] : colorCode;
    
            let delay: number = sideEffectJson['delay'] !== undefined ? sideEffectJson['delay'] : 0;
            
            let rows = [];
            let cols = [];
            let handlerRowCol = Util.getXYButtonRowColFromMidiBytes(handler.midiBytes[0], handler.midiBytes[1]);

            if (typeof rowJson === 'number') {
                rows.push(rowJson);
            } else if (rowJson === 'all') {
                for (let r = 0; r < 8; r++) {
                    rows.push(r);
                }
            } else if (rowJson === 'same') {
                let handlerRow = handlerRowCol[0];
                rows.push(handlerRow);
            }

            if (typeof colJson === 'number') {
                cols.push(colJson);
            } else if (colJson === 'all') {
                for (let c = 0; c < 8; c++) {
                    cols.push(c);
                }
            } else if (colJson === 'same') {
                let handlerCol = handlerRowCol[1];
                cols.push(handlerCol);
            }

            rows.forEach(row => {
                cols.forEach(col => {
                    if (row !== handlerRowCol[0] || col !== handlerRowCol[1]) {
                        let sideEffect = new SideEffect();
                        let midiBytes = Util.getXYButtonMidiBytes(row, col);

                        sideEffect.setMidiBytes(midiBytes);
                        sideEffect.setDelay(delay);
                        sideEffect.setColorCode(colorCode);

                        sideEffects.push(sideEffect);
                    }
                })
            })
        });

        return sideEffects;
    }
}

export default HandlerLoader;