import MidiInDeviceInterface from '../midi-interfaces/midi-in-device-interface';
import MidiOutDeviceInterface from '../midi-interfaces/midi-out-device-interface';
import Handler from './handler';
import MidiEvent from './midi-event';
import SideEffect from './side-effect';
import HandlerLoader from './handler-loader';

/**
 * Class representing a launchpad Scene.
 * 
 * A Scene is a generalized term to describe a configuration of the launchpad
 * to act as the interface for a particular task. For example a scene may be 
 * a drum-machine, or a sequencer, or a toggle-box, or a mixer. The scene 
 * basically determines what the launchpad is currently beign used as. A
 * musician may switch between scenes in the middle of a performance to,
 * for example, go between programming a drum-machine, and adjusting levels
 * on a mixer.
 */
class Scene {

    sceneName: string = '';
    sceneIndex: number = 0;
    handlers: Array<Handler> = [];

    midiIn: MidiInDeviceInterface;
    toLaunchpad: MidiOutDeviceInterface;

    constructor(midiIn: MidiInDeviceInterface, toLaunchpad: MidiOutDeviceInterface, sceneJson: object) {
        this.midiIn = midiIn;
        this.toLaunchpad = toLaunchpad;

        this.loadScene(sceneJson);
    }

    /**
     * Handle a midi event that pertains to current scene.
     * 
     * This method will be called by the GNLaunchpad object for its current scene
     * whenever it receives a MIDI message to process. The appropriate handler for 
     * the given MIDI message will be found based on the handler's assigned MIDI
     * bytes, and the hanlder's {@link Handler#handleEvent} will be invoked.
     * 
     * @param msg - The MIDI message to process
     */
    handleMidiEvent(msg: string) {

        let midiBytes: Array<number> = msg.split(' ').map(byteStr => parseInt(byteStr));
        let midiEvent: MidiEvent = new MidiEvent(midiBytes, Date.now());
        let handler = this.handlers.find(handler => 
            handler.midiBytes[0] === midiBytes[0]
            && handler.midiBytes[1] === midiBytes[1]
        );

        if (handler !== undefined) {
            handler.handleEvent(midiEvent);
        }
    }

    /**
     * Process notifications from a {@link Hanlder}.
     * 
     * This method is the subscriber API for handling notifications in the
     * observer event handling pattern model between {@link Scene} and {@link Handler}.
     * 
     * @param handler - The handler issuing the notification.
     */
    notify(handler: Handler) {
        let msg: string = this.constructToLaunchpadMessage(handler);
        this.toLaunchpad.send(msg);
        this.sendSideEffects(handler);
    }

    /**
     * Construct a MIDI message to send to the launchpad.
     * 
     * @param handler - The handler for which to construct the message.
     * @return - Formatted MIDI message.
     */
    constructToLaunchpadMessage(handler: Handler) {

        let msg: string = handler.midiBytes[0] + ' ' +
            handler.midiBytes[1] + ' ' +
            handler.curHandlerState.colorCode;

        return msg;
    }

    /**
     * Send side-effect messages to the launchpad.
     * 
     * @param handler - The handler invoking the event.
     */
    sendSideEffects(handler: Handler) {
        let sideEffects: Array<SideEffect> = handler.curHandlerState.sideEffects;

        sideEffects.forEach(sideEffect => {
        
        });
    }

    /**
     * Invoke loading the current scene from a JSON definition.
     * 
     * This method is called from the constructor, and is the entry-point for loading 
     * a Scene using the provided JSON definition. It uses the {@link HandlerLoader}
     * utility to load the Handlers for the given scene.
     * 
     * @param sceneJson - The JSON definition for the current scene.
     */
    loadScene(sceneJson : object) {

        this.sceneName = sceneJson['sceneName'] !== undefined ? sceneJson['sceneName'] : this.sceneName;
        this.sceneIndex = sceneJson['sceneIndex'] !== undefined ? sceneJson['sceneIndex'] : this.sceneIndex;

        let handlerJsonArr: Array<object> = sceneJson['handlers'] !== undefined ? sceneJson['handlers'] : [];
        
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