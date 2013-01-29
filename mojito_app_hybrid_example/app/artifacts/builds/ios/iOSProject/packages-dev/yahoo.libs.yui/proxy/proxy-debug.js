YUI.add('proxy', function (Y, NAME) {

/**
 * Provides a proxy API.
 * @module proxy
 */
/**
 * The Proxy class provides methods for sending and streaming data.
 * @class Proxy
 * @constructor
 */
function Proxy() {
    this.init.apply(this, arguments);
}

Y.extend(Proxy, Y.Handle, {

    _tId: 'tProxy',
    _serviceId: 'sProxy',

    _options : {
    },

    _events: {
        success: null,
        failure: null
    },

    init: function(success, failure) {
        var config = {
            on: {
                success: success,
                failure: failure
            }
        };

        Proxy.superclass.init.call(this, config);
    },

    /**
     * Send data across the proxy service.
     *
     * The data parameter is optional, and if provided, must represent a data
     * literal - for example, form data, binary encoded as base64 string, etc.
     * It must not represent a URL to the data. For such use cases, you must use
     * the streamData method.
     * @method sendData
     * @param {Object} callbacks A hash of named callbacks.
     *  @param {Function} callbacks.success The callback to run when the call succeeds.
     *      @param {Object} callbacks.success.data The argument passed to the success callback.
     *          @param {Number} callbacks.success.data.status
     *          @param {String} callbacks.success.data.statusText
     *          @param {Object} callbacks.success.data.headers
     *          @param {String} [callbacks.success.data.response]
     *          @param {Object} [callbacks.success.data.arguments]
     *  @param {Function} [callbacks.failure] The callback run when the call fails.
     *  @param {Object} callbacks.failure.error The argument passed to the failure callback.
     *      @param {Number} callbacks.failure.error.code The error code.
     *      @param {String} callbacks.failure.error.message A message explaining the error.
     *      @param {Object} callbacks.failure.error.detail Additional error information.
     *  @param {Function} callbacks.start
     *      @param {Object} callbacks.start.data The argument passed to the callback.
     *          @param {Object} [callbacks.start.data.arguments]
     *  @param {Function} callbacks.end
     *      @param {Object} callbacks.end.data The argument passed to the callback.
     *          @param {Object} [callbacks.end.data.arguments]
     *  @param {Function} callbacks.complete The callback to run when the call completes.
     *      @param {Object} callbacks.complete.data The argument passed to the success callback.
     *          @param {Object} callbacks.success.data.headers
     *          @param {String} [callbacks.success.data.response]
     *          @param {Object} [callbacks.success.data.arguments]
     * @param {Object} [options] The options to pass to the host method.
     *   @param {String} options.url
     *   @param {String} [options.method]
     *   @param {Object} [options.headers]
     *   @param {String} [options.data] Form data, binary encoded as base64 string, etc.
     *   It must not represent a URL to the data. For such use cases, you must
     *   use the streamData method.
     *   @param {Object} [options.arguments]
     * @return {String} The invocationId returned from the bridge.
     */
    sendData: function(callbacks, options) {
        return Y.Bridge.invokeMethod(this._handleId, 'sendData', options, callbacks);
    },

    /**
     * Stream data across the proxy service.
     * @method streamData
     * @param {Object} callbacks A hash of named callbacks.
     *  @param {Function} callbacks.success The callback to run when the call succeeds.
     *      @param {Object} callbacks.success.data The argument passed to the success callback.
     *          @param {Number} callbacks.success.data.status
     *          @param {String} callbacks.success.data.statusText
     *          @param {Object} callbacks.success.data.headers
     *          @param {String} [callbacks.success.data.response]
     *          @param {Object} [callbacks.success.data.arguments]
     *  @param {Function} [callbacks.failure] The callback run when the call fails.
     *  @param {Object} callbacks.failure.error The argument passed to the failure callback.
     *      @param {Number} callbacks.failure.error.code The error code.
     *      @param {String} callbacks.failure.error.message A message explaining the error.
     *      @param {Object} callbacks.failure.error.detail Additional error information.
     *  @param {Function} callbacks.start
     *      @param {Object} callbacks.start.data The argument passed to the callback.
     *          @param {Object} [callbacks.start.data.arguments]
     *  @param {Function} callbacks.end
     *      @param {Object} callbacks.end.data The argument passed to the callback.
     *          @param {Object} [callbacks.end.data.arguments]
     *  @param {Function} callbacks.complete The callback to run when the call completes.
     *      @param {Object} callbacks.complete.data The argument passed to the success callback.
     *          @param {Object} callbacks.success.data.headers
     *          @param {String} [callbacks.success.data.response]
     *          @param {Object} [callbacks.success.data.arguments]
     * @param {Object} [options] The options to pass to the host method.
     *   @param {String} options.url
     *   @param {String} [options.method]
     *   @param {Object} [options.headers]
     *   @param {String} options.data A valid url.
     *   @param {Object} [options.arguments]
     * @return {String} The invocationId returned from the bridge.
     */
    streamData: function(callbacks, options) {
        return Y.Bridge.invokeMethod(this._handleId, 'streamData', options, callbacks);
    }

});

Y.Proxy = Proxy;


}, '@VERSION@', {"requires": ["handle"]});
