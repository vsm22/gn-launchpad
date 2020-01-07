import MidiInDeviceInterface from '../midi-interfaces/midi-in-device-interface';
import MidiOutDeviceInterface from '../midi-interfaces/midi-out-device-interface';
import Handler from './handler';
import MidiEvent from './midi-event';
import SideEffect from './side-effect';
import HandlerLoader from './handler-loader';

class Scene {

    sceneName : string = '';
    sceneIndex : number = 0;
    handlers : Array<Handler> = [];

    midiIn : MidiInDeviceInterface;
    toLaunchpad: MidiOutDeviceInterface;

    constructor(midiIn : MidiInDeviceInterface, toLaunchpad : MidiOutDeviceInterface, sceneJson : object) {
        this.midiIn = midiIn;
        this.toLaunchpad = toLaunchpad;

        this.loadScene(sceneJson);
    }

    handleMidiEvent(msg : string) {
        let midiBytes : Array<number> = msg.split(' ').map(byteStr => parseInt(byteStr));
        let midiEvent : MidiEvent = new MidiEvent(midiBytes, Date.now());
        let handler = this.handlers.find(handler => 
            handler.midiBytes[0] === midiBytes[0]
            && handler.midiBytes[1] === midiBytes[1]
        );

        if (handler !== undefined) {
            handler.handleEvent(midiEvent);
        }
    }

    notify(handler : Handler) {
        console.log('Notify...');
        let msg : string = this.constructToLaunchpadMessage(handler);
        this.toLaunchpad.send(msg);
        this.sendSideEffects(handler);
    }

    constructToLaunchpadMessage(handler : Handler) {
        console.log('Handler: ' + handler);
        console.log('Curhandlerstate: ' + handler.curHandlerState);

        let msg : string = handler.midiBytes[0] + ' ' +
            handler.midiBytes[1] + ' ' +
            handler.curHandlerState.colorCode;

        return msg;
    }

    sendSideEffects(handler : Handler) {
        let sideEffects : Array<SideEffect> = handler.curHandlerState.sideEffects;

        sideEffects.forEach(sideEffect => {
        
        });
    }

    loadScene(sceneJson : object) {
        this.sceneName = sceneJson['sceneName'] !== undefined ? sceneJson['sceneName'] : this.sceneName;
        this.sceneIndex = sceneJson['sceneIndex'] !== undefined ? sceneJson['sceneIndex'] : this.sceneIndex;

        let handlerJsonArr : Array<object> = sceneJson['handlers'] !== undefined ? sceneJson['handlers'] : [];
        
        handlerJsonArr.forEach(handlerJson => {
            let handlers : Array<Handler> = HandlerLoader.loadHandlers(handlerJson);
            handlers.forEach(handler => {
                handler.subscribe(this);
                this.handlers.push(handler);
            });
        });
    }
}

export default Scene;