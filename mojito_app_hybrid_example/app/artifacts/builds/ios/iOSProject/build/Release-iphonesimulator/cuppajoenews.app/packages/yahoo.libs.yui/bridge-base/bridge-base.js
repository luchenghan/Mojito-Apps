YUI.add('bridge-base', function (Y, NAME) {

/**
 * Provides the `Y.BridgeBase` class, which can be instantiated with various transports
 *
 * ----
 *
 * This module does not instantiate a `Y.Bridge` instance when loaded. It just provides
 * the `Y.BridgeBase` class.
 *
 * Currently, CocktailsRT's `bridge` module instantiates the `Y.Bridge` instance, and is
 * pulled in automatically when using the service APIs.
 *
 * CocktailsRT's `bridge` module will create A `Y.Bridge` instance with a transport
 * which matches the native implementation (`bridge-bell` on iOS for example,
 * or `bridge-delegate` on android).
 *
 * Within a YUI instance, service developers can rely on a `Y.Bridge` reference to
 * the same bridge instance.
 *
 * Native implementations which normally only have access to the global scope, can
 * invoke `YUI.Env._BridgeContext.[transport].getRequests` and `YUI.Env._BridgeContext.[transport].sendResponses`.
 * where [transport] is the type of the transport the native implementation supports.
 * for example,
 *
 *     var jsonArrayOfRequestMessages = YUI.Env._BridgeContext.bell.getRequests();
 *     // NOTE: sendResponses can be passed a JSON Array or an actual Array.
 *     YUI.Env._BridgeContext.bell.sendResponses(jsonArrayOfMessages);
 *
 * Usage Example For Developers Writing JS Services:
 *
 *     YUI().use("bridge", function() {
 *
 *         var invocationId = Y.Bridge.invokeMethod("SomeService",
 *              "someMethod",
 *              {
 *                  arg1: 10,
 *                  arg2: 30
 *              },
 *              {
 *                  success: function() {},
 *                  failure: function() {}
 *              }
 *         );
 *
 *     });
 *
 * TODO: Need to provide RPC message format docs outside of CocktailsRT, for developers
 * looking to create new native Bridge implementations.
 *
 * The ultimate goal is to provide a DOMService transport, which can be instantiated
 * out of the box for YUI, without CocktailsRT, to maintain the same bridging API for
 * DOM based Geo, Accelerometer and other services which may have native equivalents.
 *
 * @module bridge-base
 */

var HANDLE_PREFIX = "h_",

    Lang = Y.Lang,

    DESTROY_HANDLE = "destroyHandle",
    CREATE_HANDLE = "createHandle",
    CANCEL_METHOD = "cancelMethod",
    GET_CONTEXT_ID = "getContextId",
    CHECK_AVAILABLE_SERVICES = "checkAvailableServices";

/**
 * The private location for native implementations to send and recieve
 * messages from Bridges across multiple YUI instances.
 *
 * This property is an implementation detail, for use by the native implementations,
 * and subject to change across releases, along with the native low-level bridge
 * implementations.
 *
 * @property YUI.Env._BridgeContext
 * @private
 * @static
 */
YUI.namespace("Env._BridgeContext");

/**
 * Bridge Constructor
 *
 * NOTE: Currently, CocktailsRT's "bridge" module instantiates the `Y.Bridge` instance,
 * based on a transport which matches the native implementation, as discussed in the
 * <a href="../modules/bridge-base.html">"bridge-base" module</a> documentation.
 * It is not instantiated by the "bridge-base" module.
 *
 * @class BridgeBase
 * @constructor
 * @param {Object} [cfg] An optional configuration hash, with the following properties:
 *   @param {String} [cfg.type] The registered transport type to use for the bridge instance.
 *   If not provided, the default transport registered with BridgeBase is used.
 *   @param {Integer} [cfg.throttle=10] The ms for which to throttle requests. Defaults to 10.
 *
 * In addition to the above generic bridge properties, each transport has it's own set of
 * configurable properties.
 */
function BridgeBase(cfg) {
    this._init(cfg);
}

Y.mix(BridgeBase, {

    /**
     * Register a new transport type
     *
     * @method addTransport
     * @static
     * @public
     * @param {String} type The transport type.
     * @param {Function} impl The constructor for the transport to use.
     * @param {boolean} [isDefault] Whether or not the transport should be the default transport.
     * The last transport to register as default, wins.
     */
    addTransport : function(type, impl, isDefault) {
        this._transports[type] = impl;
        impl.prototype.type = type;

        if (isDefault) {
            BridgeBase.setDefaultTransport(type);
        }
    },

    /**
     * Whether or not the given transport type is registered.
     *
     * @method hasTransport
     * @static
     * @public
     * @param {String} type The transport type
     * @return {boolean} true if the transport type has been registered, false otherwise.
     */
    hasTransport : function(type) {
        return !!(this._transports[type]);
    },

    /**
     * Get the transport constructor for the registered type, or the default type,
     * if no type is passed in.
     *
     * @method getTransport
     * @static
     * @public
     * @param {String} type The transport type
     * @return {Function} The constructor for the requested transport type
     */
    getTransport : function(type) {
        type = type || this._defaultTransport;
        return this._transports[type];
    },

    /**
     * Update the default transport type, to one of the registered types.
     *
     * @method setDefaultTransport
     * @static
     * @public
     * @param {String} type The transport type
     */
    setDefaultTransport : function(type) {
        if (this.getTransport(type)) {
            this._defaultTransport = type;
        }
    },

    /**
     * A hash of transport type strings to transport constructor functions.
     *
     * @property _transports
     * @static
     * @private
     */
    _transports : {}
});

Y.mix(BridgeBase.prototype, {

    /**
     * The ms for which to throttle calls. User can override by passing into constructor.
     *
     * @property throttle
     * @public
     * @type int
     * @default 10
     */
    throttle: 10,

    /**
     * Callbacks are invoked asynchronously, so that `sendResponses()` execution
     * doesn't block the native thread or UI. This property controls the ms timeout used
     * when dispatching callbacks asynchronously.
     *
     * NOTE: Unlike asyncMessageTimeout, this cannot be set to -1. Callbacks are always invoked asynchronously.
     *
     * @property asyncCallbackTimeout
     * @public
     * @type int
     * @default 0
     */
    asyncCallbackTimeout : 0,

    /**
     * The lowest level call to invoke methods across the bridge. NOTE: null should be passed in for
     * non-terminating optional parameters, to maintain argument positions.
     *
     * @method invokeMethod
     * @public
     * @param {String} [handleId] Name (for statics) or instance id of the object to invoke the method on.
     * @param {String} method The name of the method to invoke.
     * @param {Object} [args] The hash of arguments to pass to the method.
     * @param {Object} [callbacks] A hash of callback names to functions. e.g.
     *
     *      {
     *          success: function(o) {...},
     *          failure: function(o) {...}
     *      }
     *
     * @param {Object} [opts] The hash of bridge invocation options to use for this method invocation
     */
    invokeMethod : function(handleId, method, args, callbacks, opts) {

        var invocationId = this._bId + ":" + this._context.txId++,
            message = this._createMessage(invocationId, handleId, method, args, callbacks, opts);

        this.sendMessage(null, message);

        return invocationId;
    },

    /**
     * Pass through to the YUI global context sendResponses method. Will be removed soon.
     *
     * @method sendResponses
     * @deprecated
     */
    sendResponses : function(jsonMessages) {
        return YUI.Env._BridgeContext[this._transport.type].sendResponses(jsonMessages);
    },

    /**
     * Pass through to the YUI global context getRequests method. Will be removed soon.
     *
     * @method sendResponses
     * @deprecated
     */
    getRequests : function() {
        return YUI.Env._BridgeContext[this._transport.type].getRequests();
    },

    /**
     * Invokes the callback defined in the provided bridge response. The callback is invoked
     * asynchronously, to free up the native thread.
     *
     * @method _invokeCallback
     * @param message {Object} The response message from the bridge, with the callback and args to invoke
     * @private
     */
    _invokeCallback : function(message) {

        var bridge = this,
            contextId = this._context.contextId,
            callbackMap = this._callbackMap,
            callbacks,
            callbackFn,
            invocationId,
            asyncCallback,
            args;

        // TODO: Fix for > 1 destination when we get to destination routing.
        if ((!contextId && this._isContextIdResponse(message)) || (message.d && message.d[0] === contextId)) {

            invocationId = message.i;
            callbacks = callbackMap[invocationId];

            if (callbacks) {

                callbackFn = callbacks[message.c];

                if (!(message.p && message.p.c === false)) {
                    delete callbackMap[invocationId];
                }

                if (callbackFn) {
                    if (!message.hasOwnProperty("a")) {
                        asyncCallback = this._bind(callbackFn, null);
                    } else {
                        args = message.a;
                        asyncCallback = this._bind(callbackFn, null, args);
                    }

                    setTimeout(asyncCallback, bridge.asyncCallbackTimeout);
                }
            }
        }
    },

    /**
     * Cleans up external references used by the bridge
     *
     * @method destroy
     * @public
     */
    destroy : function() {
        var context = this._context,
            throttleTimer;

        this._transport.destroy();

        delete context.bridges[this.id];

        if (Y.Object.size(context.bridges) === 0) {
            throttleTimer = context.throttleTimer;

            if (throttleTimer) {
                throttleTimer.cancel();
            }

            YUI.Env._BridgeContext.bell = null;
        }
    },

    /**
     * Adds a message to the queue and sends it across the bridge, when throttle limits allow.
     *
     * @method sendMessage
     * @param {String} destinationId The destination to which the message is to be sent, or null.
     * @param {Object} message The message to send
     * @public
     */
    sendMessage : function(destinationId, message) {

        // We may not have a contextId, until our bridge request for a context Id completes.
        var context = this._context,
            contextId = context.contextId;

        if (destinationId) {
            message.d = destinationId;
        }

        if (contextId) {
            message.s = [contextId];

            context.reqQueue.push(message);
            this._throttledSend();

        } else {

            // Handle calls while we're waiting for contextId
            if (this._isContextIdInvocation(message)) {
                context.reqQueue.push(message);
                this._transport.sendSecureMessage();
            } else {
                context.tmpQueue.push(message);
            }

        }
    },

    /**
     * Helper method, to add multiple messages to the queue in a single shot,
     * and send out a dispatch. It's used currently to dispatch requests queued
     * up waiting for a contextId.
     *
     * @method _sendMessages
     * @private
     * @param {Array} messages An array of messages, with destination already filled out, but which may be missing a contextId
     */
    _sendMessages : function(messages) {

        var i,
            l,
            message,
            context = this._context,
            contextId = context.contextId;

        for (i = 0, l = messages.length; i < l; i++) {
            message = messages[i];
            if (!message.s) {
                message.s = [contextId];
            }
            this._context.reqQueue.push(message);
        }

        this._throttledSend();
    },

    /**
     * Creates a new handle instance on the native side, mapped to the handleId provided
     *
     * @method createHandle
     * @public
     * @param {String} serviceId The registered service for which a handle is to be created (e.g "sGeo").
     * @param {String} handleType The registered type for which a handle is to be created (e.g "GeoMonitor").
     * @param {Object} [args] The hash of arguments which the Service should use when creating the new handle instance.
     * @param {Function|Object} [success] The callback to invoke if we
     * successfully created the handle. No args are passed to success.
     * Or, a hash of callbacks, containing the callback functions as expected
     * by 'invokeMethod'.
     * @param {Function} [failure] The callback to invoke if we cannot create the
     * handle. An object with failure information is passed as the only argument to callback.
     *
     * @return {String} handleId The unique handleId generated for the handle instance.
     */
    createHandle : function(serviceId, handleType, args, success, failure) {

        var handleId = Y.guid(HANDLE_PREFIX),
            imArgs = this._imHandleArgs(handleId),
            imCallbacks = this._imCallbacks(success, failure);

        if (handleType) {
            imArgs.t = handleType;
        }

        if (args) {
            imArgs.a = args;
        }

        this.invokeMethod(serviceId, CREATE_HANDLE, imArgs, imCallbacks);

        return handleId;
    },

    /**
     * Asks the native side for a list of available services.
     *
     * @method checkAvailableServices
     * @public
     * @param {Object} [args] The hash which contains the services to filter by.
     * @param {Function} [success] The callback to invoke if we successfully retrieve the available services.
     * @param {Function} [failure] The callback to invoke if we cannot retrieve any available services.
    */
    checkAvailableServices : function(args, success, failure) {
      this.invokeMethod(null, CHECK_AVAILABLE_SERVICES, args, this._imCallbacks(success, failure));
    },

    /**
     * Asks the native side to destroy an existing handle.
     *
     * @method destroyHandle
     * @public
     * @param {String} handleId The id of the handle to destroy.
     * @param {Function} [success] The callback to invoke if we successfully created the handle. No args are passed to success.
     * @param {Function} [failure] The callback to invoke if we cannot create the handle.
     * An object with failure information is passed as the only argument to the callback.
     */
    destroyHandle : function(handleId, success, failure) {

        var imArgs = this._imHandleArgs(handleId),
            imCallbacks = this._imCallbacks(success, failure);

        this.invokeMethod(null, DESTROY_HANDLE, imArgs, imCallbacks);
    },

    /**
     * @method cancelMethod
     * @param {String} invocationId The invocationId to cancel
     * @param {Function} [success] The callback to invoke if we successfully cancelled the invocation. No args are passed to success.
     * @param {Function} [failure] The callback to invoke if we cannot create the handle.
     * An object with failure information is passed as the only argument to the callback.
     */
    cancelMethod : function(invocationId, success, failure) {
        var imArgs = {
                i : invocationId
            },
            imCallbacks = this._imCallbacks(success, failure);

        if (imCallbacks) {
            imCallbacks.success = this._onCancelMethodSuccess(invocationId, imCallbacks.success);
        }

        this.invokeMethod(null, CANCEL_METHOD, imArgs, imCallbacks);
    },

    /**
     * @method _onCancelMethodSuccess
     * @private
     * @param {String} invocationId The invocationId which got cancelled.
     * @param {Function} [successFn] The user provided success callback, if it exists.
     * @return {Function} The wrapped success handler.
     */
    _onCancelMethodSuccess : function(invocationId, successFn) {

        var bridge = this,
            successHandler = function() {
                if (bridge._callbackMap[invocationId]) {
                    delete bridge._callbackMap[invocationId];
                }
                if (successFn) {
                    successFn.apply(this, arguments);
                }
            };

        return successHandler;
    },

    /**
     * Utility method to bind callbacks to a given context and args, based on the type of args
     * @method _bind
     * @private
     * @param {Function} fn The function to be bound
     * @param {Object} context The context to bind to.
     * @param {Any} [args] Either:
     *
     *      1. Not provided, in which case the `fn` is invoked with no arguments
     *      2. An array, in which case `fn.apply()` is used
     *      3. Asingle argument, in which case `fn.call()` is used.
     *
     * @return {Function} The bound function
     */
    _bind : function(fn, context, args) {
        var bound;

        if (arguments.length === 2) {
            bound = function() {
                fn.call(context);
            };
        } else {
            if (Lang.isArray(args)) {
                bound = function() {
                    fn.apply(context, args);
                };
            } else {
                bound = function() {
                    fn.call(context, args);
                };
            }
        }

        return bound;
    },

    /**
     * Internal utility method to construct the baseline arguments to
     * pass to invokeMethod, for handle related methods (e.g. createHandle, destroyHandle)
     *
     * @method _imHandleArgs
     * @private
     * @param {String} handleId The handleId to use
     * @return {Object} The base args object for handle calls.
     */
    _imHandleArgs : function(handleId) {
        return {
            o : handleId
        };
    },

    /**
     * Internal utility method to construct the baseline callback hash to
     * pass to invokeMethod, for handle related methods (e.g. createHandle, destroyHandle)
     *
     * @method _imCallbacks
     * @private
     * @param {Function|Object} [success] The success callback for the invokeMethod call,
     * or the hash of callbacks to pass straight through to `invokeMethod`
     * @param {Function} [failure] The failure callback for the invokeMethod call
     * @return {Object} The normalized array hash for success/failure calls
     */
    _imCallbacks : function(success, failure) {
        var imCallbacks;

        if (Lang.isObject(success, true)) {
            imCallbacks = success;
        } else {
            if (success || failure) {
                imCallbacks = {};

                if (success) {
                    imCallbacks.success = success;
                }

                if (failure) {
                    imCallbacks.failure = failure;
                }
            }
        }

        return imCallbacks;
    },

    /**
     * Dispatch a request across the bridge, or throttle for later dispatch, if it's too soon
     *
     * @method _throttledSend
     * @private
     */
    _throttledSend : function() {

        var context = this._context,

            requestsPending = context.reqQueue.length > 0,
            throttled = context.throttled,
            throttleTime = context.throttle;

        if (requestsPending && !context.waitingForAck) {

            if (!throttled) {
                context.throttled = true;
                context.waitingForAck = true;

                this._transport.sendMessage();
            }

            if (!context.throttleTimer) {
                context.throttleTimer = Y.later(throttleTime, this, function() {
                    context.throttled = false;
                    context.throttleTimer = null;

                    this._throttledSend();
                });
            }
        }
    },

    /**
     * Initializes the transport instance for this bridge, from the configured type
     *
     * @method _initTransport
     * @param {Object} cfg The configuration hash passed to the bridge constructor
     * @private
     */
    _initTransport : function(cfg) {
        var TransportImpl = Y.BridgeBase.getTransport(cfg.type);

        cfg.bridge = this;

        this._transport = new TransportImpl(cfg);

        this.type = this._transport.type;
    },

    /**
     * Utility method to construct message for transfer across the bridge. Not serialized.
     *
     * NOTE: null should be passed in for non-terminating optional arguments, to maintain
     * argument position.
     *
     * @method _createMessage
     * @protected
     *
     * @param {String} invocationId The unique invocation id (for this context) to use for the call.
     * @param {String} [handleId] Name (for statics) or instance id of the object to invoke the method on.
     * @param {String} [method] The name of the method to invoke.
     * @param {Object} [args] The hash of arguments to pass to the method.
     * @param {Object} [callbacks] A hash of callback names to functions. e.g.
     *
     *      {
     *          success: function(o) {...},
     *          failure: function(o) {...}
     *      }
     *
     * @param {Object} [opts] The hash of bridge invocation options to use for this method invocation
     * @return {Object} The constructed message, with the following fields, if passed in as arguments:
     *
     *     {
     *         i : invocationId,
     *         h : handleId,
     *         m : method,
     *         a : args,
     *         c : callbackNameArray, // e.g. ["success", "failure"]
     *         p : opts
     *     }
     */
    _createMessage : function(invocationId, handleId, method, args, callbacks, opts) {

        var message = {},
            callbacksArray;

        if (invocationId) {
            message.i = invocationId;
        }

        if (handleId) {
            message.h = handleId;
        }

        if (method) {
            message.m = method;
        }

        if (args) {
            message.a = args;
        }

        callbacksArray = this._storeCallbacks(message.i, callbacks);

        if (callbacksArray) {
            message.c = callbacksArray;
        }

        if (opts) {
            message.p = opts;
        }

        return message;
    },

    /**
     * Stores the callbacks by invocationId to be used by sendResponses() to look up
     * callback function references.
     *
     * @method _storeCallbacks
     * @protected
     *
     * @param {String} invocationId The unique invocation ID to use to store the callback
     * references. This id will be used to map responses back to the
     * callback functions.
     *
     * @param {Object} callbacks A map of callback name to callback function. e.g.
     *
     *       {
     *         success: function() {...},
     *         failure: function() {...}
     *       }
     *
     * @return {Array} The array of callback names stored. This is normally passed as part of the message, when
     * invoking a method, so that native side handling can be optimized to service just the callbacks the user is
     * interested in. This method will return null if the callbacks param is an empty object, or null.
     */
    _storeCallbacks : function(invocationId, callbacks) {
        var cbMap = this._callbackMap,
            cbArray,
            cbName;

        if (callbacks && invocationId) {
            if (cbMap[invocationId]) {
            } else {
                cbArray = [];

                for (cbName in callbacks) {
                    if (callbacks.hasOwnProperty(cbName)) {
                        cbArray[cbArray.length] = cbName;
                    }
                }

                if (cbArray.length > 0) {
                    cbMap[invocationId] = callbacks;
                }
            }
        }
        // Allow long single line to strip with log calls.
        /*jshint maxlen:1000 */

        return (!cbArray || cbArray.length === 0) ? null : cbArray;
    },

    /**
     * Default initialization method. The base implementation sets up a unique
     * id for the bridge, and initializes the transaction counter to 0.
     *
     * @method _init
     * @protected
     * @param {Object} cfg The configuration object passed to the constructor
     */
    _init : function(cfg) {

        cfg = cfg || {};

        Y.mix(this, cfg, true, [
            "throttle",
            "asyncCallbackTimeout"
        ]);

        this.id = Y.guid();

        this._initCBMap(cfg);
        this._initTransport(cfg);
        this._initContext(this._transport);

        this._initContextId(cfg);
    },

    /**
     * Initializes the callback map.
     *
     * @method _initCBMap
     * @private
     * @param {Object} cfg The configuration object passed to the constructor
     */
    _initCBMap : function() {
        this._callbackMap = {};
    },

    /**
     * Determines if the message is the contextId request
     *
     * @method _isContextIdInvocation
     * @private
     * @param message {Object} The bridge request message
     */
    _isContextIdInvocation : function(message) {
        return message.i && !message.s && !message.h && message.m === GET_CONTEXT_ID;
    },

    /**
     * Determines if the response is the contextId response
     *
     * @method _isContextIdResponse
     * @private
     * @param message {Object} The bridge response message
     */
    _isContextIdResponse : function(message) {
        return (!message.d) || (message.d.length === 0);
    },

    /**
     * Sends out the request to intialize the context id.
     *
     * @method _initContextId
     * @private
     * @param cfg {Object} The configuration object passed to the bridge constructor
     */
    _initContextId : function() {

        var bridge = this,
            context = bridge._context;

        if (!context.contextId && !context.waitingForContextId) {

            bridge.invokeMethod(null, GET_CONTEXT_ID, null, {

                success : function(o) {
                    context.waitingForContextId = false;

                    context.contextId = o.id;

                    if (context.tmpQueue) {
                        bridge._sendMessages(context.tmpQueue);
                        context.tmpQueue = [];
                    }
                },

                failure : function(o) {
                    // TODO: Sync with native on what es, ed, etc. will be.
                    context.waitingForContextId = false;
                }
            });

            context.waitingForContextId = true;
        }
    },

    /**
     * Setup the global (YUI.Env) shared context state which invidivual bridge
     * instances will use. There will be one shared context per Bridge type (bell, delegate etc).
     *
     * The `YUI.Env._BridgeContext` set up by this method is intended to be private, and for use
     * either by Bridge instances to share state, or by the native implementation to talk across
     * the bridge. Implementation details may change across releases.
     *
     * @method _initContext
     * @private
     * @param transport {Object} The transport type which this context supports
     */
    _initContext : function(transport) {

        var type = this.type;

        if (!YUI.Env._BridgeContext[type]) {

            YUI.Env._BridgeContext[type] = {

                txId : 0,
                bId : 0,
                contextId : null,
                throttle : this.throttle,
                bridges : {},
                reqQueue : [],
                tmpQueue : [],
                throttled : false,
                waitingForAck : false,

                format : transport.format,
                parse : transport.parse,

                getRequests : function() {
                    var q = this.reqQueue;

                    this.reqQueue = [];
                    this.waitingForAck = false;

                    return this.format(q);
                },

                sendResponses : function(jsonMessages) {

                    var i,
                        l,
                        bid,
                        invocationId,
                        message,
                        messages = jsonMessages,
                        bridge;

                    if (typeof jsonMessages === "string") {
                        messages = this.parse(jsonMessages);
                    }

                    if (messages) {
                        for (i = 0, l = messages.length;i < l; i++) {
                            message = messages[i];
                            invocationId = message.i;

                            bid = invocationId.substring(0, invocationId.indexOf(":")); // faster than split

                            bridge = this.bridges[bid];

                            if (bridge) {
                                bridge._invokeCallback(message);
                            }
                        }
                    }
                }
            };
        }

        this._context = YUI.Env._BridgeContext[type];
        this._bId = this._context.bId++;
        this._context.bridges[this._bId] = this;
    }

});

Y.BridgeBase = BridgeBase;


}, '@VERSION@', {"requires": ["yui-base", "json"]});
