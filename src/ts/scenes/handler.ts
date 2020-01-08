import HandlerType from "./handler-type";
import HandlerState from "./handler-state";
import EventType from "./event-type";
import MidiEvent from "./midi-event";
import Util from "../gn-lp-util";
import Scene from "./scene";

class Handler {

    type: HandlerType = null;
    midiBytes: Array<number> = [];
    handlerStates: Array<HandlerState> = [];
    curHandlerState: HandlerState = null;
    handlerEvents: Array<MidiEvent> = [];
    subscribers: Array<Scene> = [];

    setType(type: HandlerType) {
        this.type = type;
    }

    setMidiBytes(midiBytes: Array<number>) {
        midiBytes.forEach((byte, i) => {
            this.midiBytes[i] = byte;
        });
    }

    setHandlerStates(handlerStates: Array<HandlerState>) {
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

    subscribe(scene: Scene) {
        this.subscribers.push(scene);
    }

    handleEvent(handlerEvent: MidiEvent) {

        let handlerState: HandlerState = this.curHandlerState.clone();

        if (handlerEvent.midiBytes[2] > 0) {
            // Publish push event
            this.publishEvent(EventType.push, handlerState);

            // If there was another push event within double-tap threshold time, publish double tap event
            if (this.handlerEvents[1].midiBytes[2] > 0
                    && handlerEvent.timestamp - this.handlerEvents[1].timestamp > Util.launchpadConfig["doubleTapTime"]) {
                this.publishEvent(EventType.doubleTap, handlerState);
            }

            // If release event has not been published, publish hold event after timeout
            setTimeout(() => {
                if (this.handlerEvents[0].midiBytes[2] > 0) {
                    this.publishEvent(EventType.hold, handlerState);
                }
            }, Util.launchpadConfig["holdTime"]);

            // If release event has not been published, publish long hold event after timeout
            setTimeout(() => {
                if (this.handlerEvents[0].midiBytes[2] > 0) {
                    this.publishEvent(EventType.longHold, handlerState);
                }
            }, Util.launchpadConfig["longHoldTime"]);
        } else {
            // Publish release event
            this.publishEvent(EventType.release, handlerState);

            if (this.handlerEvents[0].midiBytes[2] > 0 
                && handlerEvent.timestamp - this.handlerEvents[0].timestamp > Util.launchpadConfig["holdTime"]) {
                this.publishEvent(EventType.holdRelease, handlerState);
            }

            if (this.handlerEvents[0].midiBytes[2] > 0 
                && handlerEvent.timestamp - this.handlerEvents[0].timestamp > Util.launchpadConfig["longHoldTime"]) {
                this.publishEvent(EventType.longHoldRelease, handlerState);
            }
        }

        this.handlerEvents.unshift(handlerEvent);
        if (this.handlerEvents.length > 4) {
            this.handlerEvents = this.handlerEvents.slice(0, 4);
        }
    }

    publishEvent(eventType: EventType, handlerState: HandlerState) {
    
        let nextHandlerStateIdx: number = handlerState.transitions.get(eventType);
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
    doTransitionState(interaction: EventType): HandlerState {
        let nextEventStateIdx = this.curHandlerState.getNextEventStateIndex(interaction);
        let nextEventState = this.handlerStates.find(eventState => eventState.index === nextEventStateIdx);
        this.curHandlerState = nextEventState;
        return this.curHandlerState;
    }

}

export default Handler;