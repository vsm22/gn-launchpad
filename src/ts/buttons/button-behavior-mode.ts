enum ButtonBehaviorMode {
    toggle = "toggle", // toggle means state changes on non-zero velocity
    toggleRelease = "toggleRelease", //  toggleRelease means state changes on zero velocity
    push = "push", // push means state changes on both zero and non-zero velocity
    hold = "hold", // hold means hold for a number of milliseconds
    holdRelease = "holdRelease", // hold release means hold for a number of miliseconds, then release
    doubleTap = "doubleTap" // double-tap - similar to doulbe-click
}

export default ButtonBehaviorMode;