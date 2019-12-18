enum ButtonBehaviorMode {
    toggle = "toggle", // toggle means state changes on non-zero velocity
    toggleRelease = "toggleRelease", //  toggleRelease means state changes on zero velocity
    push = "push" // push means state changes on both zero and non-zero velocity
}

export default ButtonBehaviorMode;