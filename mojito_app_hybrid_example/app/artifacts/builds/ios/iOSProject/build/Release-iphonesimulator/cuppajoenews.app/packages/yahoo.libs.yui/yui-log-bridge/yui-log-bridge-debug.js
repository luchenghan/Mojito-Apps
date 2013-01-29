YUI.add('yui-log-bridge', function (Y, NAME) {


var SERVICE_HANDLE = "sLogging",
    BRIDGE_SRC = "bridge-base",
    METHOD = "log",

    LEVEL_MAP = {
        "off" : 0,
        "critical" : 1,
        "error" : 2,
        "warn" : 3,
        "info" : 4,
        "debug" : 5,
        "trace" : 6
    },

    DEFAULT_LEVEL = LEVEL_MAP.info;

Y.after("yui:log", function(e) {

    var severity = LEVEL_MAP[e.cat] || DEFAULT_LEVEL;

    // Don't route bridge-base logs across the bridge to avoid infinite recursion
    if ((BRIDGE_SRC !== e.src) && Y.Bridge) {
        Y.Bridge.invokeMethod(SERVICE_HANDLE, METHOD, {
            message: e.msg,
            component : e.src,
            severity : severity
        });
    }
});


}, '@VERSION@', {"condition": {"trigger": "bridge-base", "when": "after"}, "requires": ["yui-log", "event-custom-base", "bridge-base"]});
