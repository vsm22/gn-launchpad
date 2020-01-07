import EventType from './event-type';
import SideEffect from './side-effect';

class HandlerState {

    index : number = null;
    transitions : Map<EventType, number> = new Map();
    colorCode : number = null;
    sideEffects : Array<SideEffect> = [];

    clone() {
        let newHandlerState = new HandlerState()
        newHandlerState.setIndex(this.index);
        newHandlerState.setColorCode(this.colorCode);
        newHandlerState.setTransitions(this.transitions);
        newHandlerState.setSideEffects(this.sideEffects);
        return newHandlerState;
    }

    setIndex(index : number) {
        this.index = index;
    }

    setColorCode(colorCode : number) {
        this.colorCode = colorCode;
    }

    setTransitions(transitions : Map<EventType, number>) {
        this.transitions = new Map();
        transitions.forEach((val, key) => {
            this.transitions.set(key, val);
        });
    }

    setSideEffects(sideEffects : Array<SideEffect>) {
        this.sideEffects = [];
        sideEffects.forEach(sideEffect => {
            this.sideEffects.push(sideEffect);
        });
    }

    getNextEventStateIndex(interaction : EventType) {
        return this.transitions.get(interaction);
    }
}

export default HandlerState;