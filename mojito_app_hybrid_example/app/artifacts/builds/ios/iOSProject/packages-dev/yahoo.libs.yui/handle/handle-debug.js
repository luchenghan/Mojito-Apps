YUI.add('handle', function (Y, NAME) {

/**
 * Provides interfaces for managing and communicating with callback-based
 * host services.
 * @module handle
 */

/**
 * The Handle class provides a generic interface
 * for communicating with callback-based hosts.
 * Event, option, and additional customization left
 * for subclasses.
 *
 * @class Handle
 * @private
 * @constructor
 */
function Handle() {
    this.init.apply(this, arguments);
}

Handle.prototype = {
    constructor: Handle,

    _handleId: '',
    _serviceId: '',
    _tId: '',

    /**
     * A map of options to use with calls to the host method.
     * @property _options
     * @protected
     * @type Object
     * @default null
     */
    _options: null,

    // TODO: null events?
    /**
     * A map of events to use with calls to the host method.
     * @property _events
     * @protected
     * @type Object
     */
    _events: {

        /**
         * The success callback to pass to pass when calling the host.
         * @method _events.success
         * @protected
         */
        success: function() {
            Y.log('host query succeeded', 'info', 'handle');
        },

        /**
         * The failure callback to pass when calling the host.
         * @method _events.failure
         * @protected
         */
        failure: function() {
            Y.log('host query failed', 'info', 'handle');
        }
    },

    /**
     * Initializes events and options based on the provided config.
     * Called from the constructor.
     * @method init
     * @protected
     * @param {Object} config
     */
    init: function(config) {
        this._initOptions(config);
        this._initEvents(config);
        this._initHandle();
    },

    /**
     * Invoke an async service method.
     * @method invoke
     * @private
     */
    _invoke: function(method, options, success, failure) {
        return Y.Bridge.invokeMethod(
            this._handleId,
            method,
            options,
            {
                success: success, // TODO: event prefixes?
                failure: failure
            });
    },

    _fireFailure: function(code) {
            // fire async failure
            var msg = Handle.Error.messages[code],
                handle = this;
            Y.later(0, handle, handle._events.failure, {
                code: code,
                message: msg
            }, 0);
            Y.log(msg, 'info', 'handle');
    },

    _detach: {
        /**
         * Clears the host watch when the change listener is detached.
         * @method _detach.change
         * @private
         */
        change: function() {
            //cancelMethod with invocationId
            Y.Bridge.cancelMethod(this._watchId);
        }
    },

    /**
     * Calls the event's detach implementation, if provided.
     * @method detach
     * @param {String} key The name of the event to detach.
     */
    detach: function(key) {
        var handle = this;
        if (key) {
            if (handle._events[key] && handle._detach[key]) {
                handle._detach[key].call(handle);
            }
        } else { // detach all
            Y.each(handle._events, function(v, n) {
                handle.detach(n);
            });
        }
    },

    /**
     * Abstract method for subclass destruction.
     * Called from destroy method.
     * @method destructor
     * @protected
     */
    destructor: function() {
        Y.log('destructor called', 'info', 'handle');
    },

    /**
     * Destroys the handle instance.
     * @method destroy
     */
    destroy: function() {
        this.detach();
        this.destructor.apply(this, arguments);
        Y.Bridge.destroyHandle(this._handleId);
    },

    /**
     * Iterates the default config, copying either the supplied
     * config or the default to the named field on the instance.
     * @method _initConfig
     * @protected
     * @param {Object} config The object to copy to the handle
     * instance.
     * @param {String} name The name of the property containing the
     * fields to be configured.
     */
    _initConfig: function(config, name) {
        var handle = this,
            copy = {};

        if (handle[name]) {
            Y.each(handle[name], function(val, key) {
                if (config && key in config) {
                    val = config[key];
                }

                copy[key] = val;
            });
        }

        handle[name] = copy;
    },

    _initHandle: function() {
        this._handleId = Y.Bridge.createHandle(
            this._serviceId,
            this._tId,
            this._options,
            this._events
        );
    },

    /**
     * Initializes handle options from config and/or defaults.
     * @method _initOptions
     * @protected
     * @param {Object} config The user supplied configuration object.
     */
    _initOptions: function(config) {
        this._initConfig(config, '_options');
    },

    /**
     * Initializes handle events from config and/or defaults.
     * @method _initEvents
     * @protected
     * @param {Object} config The user supplied configuration object.
     */
    _initEvents: function(config) {
        config = config || {};
        this._initConfig(config.on, '_events');
    }
};

Y.Handle = Handle;


}, '@VERSION@', {"requires": ["oop", "bridge"]});
