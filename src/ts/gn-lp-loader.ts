/**
 * Abstract base class that must be extended by all loaders.
 * Extending this class ensures that all loaders implement the 
 * correct behavior for loading the necessary configuration etc.
 * Implementing loaders should call super in their constructor.
 */
abstract class GNLPLoader {

    launchpadConfig: object;
    launchpadScenes: object;
    xyButtonMap: object;
    eventMap: object;

    constructor() {
        this.launchpadConfig = this.loadLaunchpadConfig();
    }

    /**
     * Load the main config file.
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
     * Load the XY button map. 
     * 
     * @return - Object representing the XY Button map.
     */
    abstract loadXYButtonMap(): object;

    /**
     * Load the event map.
     * 
     * @return - Object representing the event map.
     */
    abstract loadEventMap(): object;
}

export default GNLPLoader;