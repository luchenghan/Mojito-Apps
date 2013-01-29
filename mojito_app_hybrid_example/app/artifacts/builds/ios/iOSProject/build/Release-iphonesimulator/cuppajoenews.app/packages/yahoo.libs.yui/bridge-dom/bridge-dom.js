YUI.add('bridge-dom', function (Y, NAME) {

var CONTEXT_ID = Y.guid();

Y.DOMService = {
    _clearWatch: {},

    ERROR: {
        SERVICE_UNAVAILABLE: 1
    },

    ERROR_MESSAGE: {
        SERVICE_UNAVAILABLE: 'service unavailable'
    },

    services: {
        sContext: {
            getContextId: function(success, failure, options, response) {
                response.a = {id: CONTEXT_ID};
                response.c = 'success';
                setTimeout(function() {
                    Y.Bridge.sendResponses([response]);
                }, 0);
            },

            cancelMethod: function(success, failure, options) {
                var clearFn = Y.DOMService._clearWatch[options.i];

                if (clearFn) {
                    clearFn();
                    delete Y.DOMService._clearWatch[options.i];
                }
            }
        }
    },

    sendMessage: function(msgs) {
        var i, len, request;

        for (i = 0, len = msgs.length; i < len; i++) {
            request = new Y.DOMService.Request(msgs[i]);
            request.send();
        }
    },

    _unavailableFailure: function(msg, callback) {
        msg.c = 'failure';
        msg.a = {
            code: Y.DOMService.ERROR.SERVICE_UNAVAILABLE,
            message: Y.DOMService.ERROR_MESSAGE.SERVICE_UNAVAILABLE
        };

        setTimeout(function() {
            callback(msg.a);
        }, 0);
    },

    Request: function(config) {
        this.init(config);
    }
};

Y.DOMService.Request.prototype = {
    init: function(msg) {
        this.msg = msg;
        this.id = msg.i;
        this.service = msg.h;
        this.method = msg.m;
    },

    send: function() {
        var msg = this.msg,
            services = Y.DOMService.services,
            service = this.service || 'sContext',
            success = Y.bind(this.onCallback, this, 'success'),
            failure = Y.bind(this.onCallback, this, 'failure'),
            method = msg.m,
            ret;

        if (service && services[service] && services[service][method]) {
            if (typeof services[service][method] === 'function') { // call custom function
                ret = services[service][method](success, failure, msg.a, msg);
            }
        } else {
            Y.DOMService._unavailableFailure(msg, failure);
        }

        return ret;
    },

    onCallback: function(type, e) {
        var msg = this.msg;
        msg.a = e;
        msg.d = [CONTEXT_ID];
        msg.c = type;
        msg.p = msg.p || {};
        Y.Bridge.sendResponses([msg]);
    }
};

var AccelerometerService = {
    _onMotion: function(success, failure, options, response, fireOnce) {
        var win = Y.config.win,
            callback;

        if ('ondevicemotion' in win && 'addEventListener' in win) {
            // Wrap the success callback to massage the event payload.
            callback = function(e) {
                AccelerometerService._watch(success, failure, e);

                // Remove after first callback if not watching.
                if (fireOnce) {
                    win.removeEventListener('devicemotion', callback, true);
                }
            };

            if (!fireOnce) {
                // Signal Y.Bridge to hold onto callbacks for repeat usage.
                response.p = {c: false};

                // Register clearWatch to be called from cancelMethod via
                // Y.Accelerometer.clearWatch() when watching.
                Y.DOMService._clearWatch[response.i] = function() {
                    win.removeEventListener('devicemotion', callback, true);
                };
            }

            // Tease acceleration data from the device motion event.
            win.addEventListener('devicemotion', callback, true);
        } else {
            Y.DOMService._unavailableFailure(response, failure);
        }

    },

    _watch: function(success, failure, e) {
        var payload = {
            timestamp: Number(new Date())
        };

        // Remap event payload to Y.Accelerometer success payload.
        if (e.acceleration) {
            Y.mix(payload, e.acceleration);
            success(payload);
        } else if (failure) {
            // Add error codes when no acceleration data is available
            // from the event payload.
            // TODO: Is there a more appropriate error to use?
            payload.code = Y.DOMService.ERROR.SERVICE_UNAVAILABLE;
            payload.message = Y.DOMService.ERROR_MESSAGE.SERVICE_UNAVAILABLE;
            failure(payload);
        }
    },

    getAcceleration: function(success, failure, options, response) {
        AccelerometerService._onMotion(success, failure, options, response, true);
    },

    watchAcceleration: function(success, failure, options, response) {
        AccelerometerService._onMotion(success, failure, options, response, false);
    }
};

Y.DOMService.services.sAccelerometer = AccelerometerService;
Y.DOMService.services.sGeo = {
    getLocation: function(success, failure, options) {
        Y.config.win.navigator.geolocation.getCurrentPosition(success, failure, options);
    },

    watchLocation: function(success, failure, options, response) {
        response.p = {c: false};
        var geo = Y.config.win.navigator.geolocation,
            watchId = geo.watchPosition(success, failure, options);

        Y.DOMService._clearWatch[response.i] = function() {
            geo.clearWatch(watchId);
        };
    }
};
/**
 * Constructor for the DOM Bridge Transport implementation
 *
 * @constructor DOM
 * @extends BridgeBase.Delegate
 * @param cfg {Object} An optional configuration hash. The current implementation
 * doesn't support any configuration options, but it's maintained for consistency and
 * extensibility.
 */
function DOMBridge() {
    DOMBridge.superclass.constructor.apply(this, arguments);
}

Y.extend(DOMBridge, Y.BridgeBase.Delegate, {

    /**
     * The method the bridge should use to format the request messages array
     * for transport across the bridge through `getRequests()`
     *
     *   - The input to this method is always an array.
     *   - The output depends on what the other side of the bridge implemention
     *     can support
     *
     * DOM simply returns the unmodified array, since we're staying on the JS side
     * of the fence, we don't need to take on the serialization cost.
     *
     * @method format
     * @param {Array} messages
     * @return {Array} An array of messages. Since we're staying in the JS world,
     * we don't need to serialize
     */
    format : function(messages) {
        // TODO: Make sure we don't need to concat, to isolate the array
        return messages;
    },

    /**
     * The method the bridge should use to parse the response messages
     * transported across the bridge through `sendResponses()` into an array.
     *
     *   - The output of this method is always an array.
     *   - The input depends on what the other side of the bridge implement
     *     can support.
     *
     * DOM simply returns the unmodified array, since we're staying on the JS side
     * of the fence, we don't need to take on the deserialization cost.
     *
     * @method parse
     * @param {Array} messages
     * @return {Array} The parsed array of messages
     */
    parse : function(messages) {
        // TODO: Make sure we don't need to concat, to isolate the array
        return messages;
    },

    /**
     * Returns the delegate implementation which should be used.
     *
     * The delegate implementation is expected to support a `sendMessage()`
     * method, which accepts the array of messages output by `getRequests()`
     *
     * @method _getDelegateImpl
     * @return {Object} An object with a `sendMessages(array)` method.
     *
     * BridgeBase.DOM returns the `DOMService` attached to the current YUI instance.
     */
    _getDelegateImpl : function() {
        return Y.DOMService;
    }

});

Y.BridgeBase.addTransport("dom", DOMBridge, true);
Y.BridgeBase.DOM = DOMBridge;

// TODO : By 1.0, setup meta-data to set up Y.Bridge consistently out of the box,
// and allow CocktailsRT to override it.

Y.Bridge = new Y.BridgeBase({type:"dom"});


}, '@VERSION@', {"requires": ["bridge-delegate"]});
