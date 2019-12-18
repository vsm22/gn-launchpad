interface Scene {
    handleMidiEvent(msg : string) : void;
    handleXYBtnEvent(row : number, col : number, vel : number);
    handleLaunchBtnEvent(row : number, vel : number);
    handleMenuBtnEvent(col : number, vel : number);
}

export default Scene;