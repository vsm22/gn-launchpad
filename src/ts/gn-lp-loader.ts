/**
 * Abstract base class that must be extended by all loaders.
 * Extending this class ensures that all loaders implement the 
 * correct behavior for loading the necessary configuration etc.
 * Implementing loaders should call super in their constructor.
 */
abstract class GNLPLoader {

    static launchpadConfig: object;
    static launchpadScenes: object;
    static xyButtonMap: Map<string, Array<number>>;
    static eventMap: object;

    constructor() {
        GNLPLoader.launchpadConfig = this.loadLaunchpadConfig();
        GNLPLoader.xyButtonMap = this.loadXYButtonMap();
        GNLPLoader.launchpadScenes = this.loadLaunchpadScenes();
    }

    /**
     * Load the main config file.
     * 
     * Possible properties:
     * {
     *  // File path to the scenes config json file
     *  launchpadScenesJsonPath:
     * 
     * }
     * 
     * @return - Object representing the JSON configuration.
     */
    abstract loadLaunchpadConfig(): object;

    /**
     * Load the scenes.
     * 
     * @return - Object representing the JSON scenes configuration.
     */
    abstract loadLaunchpadScenes(): object;

    /**
     /** 
     * Load and keep a map of MIDI bytes that correspond to each XY Button. 
     * The map is loaded from a JSON file called xy_button_map.json, where the mappings are 
     * stored by row, col, and mapped to the first two MIDI bytes of the corresponding message.
     * The resultant map is key string contructed from 'row' + 'col', value array of bytes
     * 
     * @return - Object representing the XY Button map.
     */
    abstract loadXYButtonMap(): Map<string, Array<number>>;

    /**
     * Load the event map.
     * 
     * @return - Object representing the event map.
     */
    abstract loadEventMap(): object;
}

export default GNLPLoader;