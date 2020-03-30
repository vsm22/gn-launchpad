import Handler from './handler';
import HandlerType from './handler-type';
import HandlerState from './handler-state';

import Util from '../util/gn-lp-util';
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

            handlers = HandlerLoader.createXYButtonHandlers(handlerJson);

        } else if (type === HandlerType.launchButton) {
            // TODO: create launchButton handlers
        } else if (type === HandlerType.menuButton) {
            // TODO: create launchButton handlers
        } else {
            // TODO: create launchButton handlers
        }

        
        handlers.forEach(handler => {

            handler.setType(type);

            let handlerStates: Array<HandlerState> = [];

            // We need to do this inside handler loop because side effects depend on the handler
            let handlerStateJsonArr: Array<object> = handlerJson['handlerStates'] !== undefined ? handlerJson['handlerStates'] : [];
            handlerStateJsonArr.forEach((handlerStateJson, idx) => {
                let handlerState = HandlerLoader.loadHandlerState(handlerStateJson, handler, idx);
                handlerStates.push(handlerState);
            });
            
            handler.setHandlerStates(handlerStates);
        });

        return handlers;
    }

    /**
     * Create XY-Button handlers from handlerJson.
     * XY-buttons are the 16 main buttons in the center of the controller.
     * Depending on the 'row' and 'col' specification in the handlerJson,
     * different numbers of handlers may be returned. For example, if 'row' and
     * 'col' are both specific numbers, then only 1 handler will be returned for 
     * that specific row and col. If 'row' is a specific number, but 'col' is 'all',
     * then 8 handlers will be returned for each XY-Button in that specific row.
     * If 'row' and 'col' are both 'all', then 16 handlers will be returned for
     * the all 16 buttons.
     *
     * @param handlerJson
     * @returns Array of handlers. The specific number of handlers returned depends 
     *          on the row and column
     */
    static createXYButtonHandlers(handlerJson: object): Array<Handler> {

        let handlers: Array<Handler> = [];

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

        return handlers;
    }

    /**
     * Load a single HandlerState. A HandlerState represents a particular state of a handler,
     * including it's current color, index, transitions, and sideEffects.
     * 
     * @param stateJson 
     * @param handler 
     * @param defaultIdx 
     */
    static loadHandlerState(stateJson: object, handler: Handler, defaultIdx: number): HandlerState {

        let handlerState = new HandlerState();

        let index = stateJson['index'] !== undefined ? stateJson['index'] : defaultIdx;
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

    /**
     * Load the transitions for a given handlerState. A transition specifies which handlerState index
     * to transition the handler to in response to a given event. The returned map of transitions has 
     * keys defined as eventTypes (i.e 'push', 'release', 'hold' etc.) and values defined as indexes
     * of handlerState to transition to in response to the given event.
     * 
     * @param transitionsJson
     * @return - Map of [eventType: handlerStateIndex] where eventType is the type of event that triggers
     * a given transition, and handlerStateIndex is the index of the handlerState to transition to.
     */
    static loadTransitions(transitionsJson: Array<object>): Map<EventType, number> {

        let transitions: Map<EventType, number> = new Map();
        
        transitionsJson.forEach(transitionJson => {

            let eventTypeStr = transitionJson['eventType'] !== undefined ? transitionJson['eventType'] : 'midiEvent';
            let eventType: EventType = EventType.midiEvent;
            
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

        return transitions;
    }

    /**
     * Load side effects. Side effects are changes that affect other handlers in response to an event
     * that occurs on the current handler. For example, when pressing a particular button, you may 
     * want to turn off all other buttons in the current row.
     * 
     * @param sideEffectsJsonArr 
     * @param handler 
     */
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