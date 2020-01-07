"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventType;
(function (EventType) {
    EventType["push"] = "push";
    EventType["release"] = "release";
    EventType["hold"] = "hold";
    EventType["holdRelease"] = "holdRelease";
    EventType["longHold"] = "longHold";
    EventType["longHoldRelease"] = "longHoldRelease";
    EventType["doubleTap"] = "doubleTap";
    EventType["midiEvent"] = "midiEvent";
})(EventType || (EventType = {}));
exports.default = EventType;
//# sourceMappingURL=event-type.js.map