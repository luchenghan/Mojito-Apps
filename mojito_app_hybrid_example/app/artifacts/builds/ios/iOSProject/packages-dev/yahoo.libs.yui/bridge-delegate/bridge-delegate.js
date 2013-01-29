YUI.add('bridge-delegate', function (Y, NAME) {

/**
 * Provides the delegate transport implementation for use with Y.BridgeBase.
 *
 * The delegate transport looks for the `NativeBridgeDelegate` global object, and
 * invokes `sendMessage(msgs)` on it to dispatch messages to the native implementation.
 *
 * The native implementation is responsible for sending responses by invoking the
 * Bridge `sendResponses()` method.
 *
 * @module bridge-delegate
 */

/**
 * Constructor for the Delegate Bridge Transport implementation
 *
 * Provides the delegate transport implementation for use with Y.BridgeBase.
 *
 * The delegate transport looks for the `NativeBridgeDelegate` global object, and
 * invokes `sendMessage(msgs)` on it to dispatch messages to the native implementation.
 *
 * The native implementation is responsible for sending responses by invoking the
 * Bridge `sendResponses()` method.
 *
 * @class BridgeBase.Delegate
 * @constructor
 *
 * @param {Object} cfg An optional configuration hash. The current delegate implementation
 * doesn't support any configuration options, but it's maintained for consistency and
 * extensibility.
 */
function Delegate(cfg) {
    this._init(cfg);
}

Y.mix(Delegate.prototype, {

    /**
     * Dispatches a request across the bridge
     *
     * @method sendMessage
     * @public
     */
    sendMessage : function() {
        var msgs = this.bridge._context.getRequests();
        this._impl.sendMessage(msgs);
    },

    /**
     * The method the bridge should use to format the request messages array
     * for transport across the bridge through `getRequests()`
     *
     *   - The input to this method is always an array.
     *   - The output depends on what the other side of the bridge implement
     *     can support
     *
     * Delegate generates a JSON string representation of the array.
     *
     * @method format
     * @param {Array} messages
     * @return {JSON} The JSON messages array
     */
    format : function(messages) {
        return Y.JSON.stringify(messages);
    },

    /**
     * The method the bridge should use to parse the response messages
     * transported across the bridge through `sendResponses()` into an array.
     *
     *   - The output of this method is always an array.
     *   - The input depends on what the other side of the bridge implement
     *     can support.
     *
     * Delegate parses the input messages JSON into an array.
     *
     * @method parse
     * @param {JSON} messages
     * @return {Array} The parsed array of messages
     */
    parse : function(messages) {
        var m;
        try {
            // TODO : Do we just want native to pass us an object
            m = Y.JSON.parse(messages);
        } catch(e) {
        }
        return m;
    },

    /**
     * Dispatch a secure request across the bridge.
     *
     * For Delegate, the dispatch method used by sendMessage is inherently secure,
     * so this method just delegates to sendMessage.
     *
     * @method sendSecureMessage
     * @public
     */
    sendSecureMessage : function() {
        this.sendMessage();
    },

    /**
     * @method destroy
     * @public
     */
    destroy : function() {
        // noop
    },

    /**
     * Initialize the transport
     *
     * @method _init
     * @private
     * @param {Object} cfg The configuration object for this transport
     */
    _init : function(cfg) {

        Y.mix(this, cfg, true, [
            "bridge"
        ]);

        var impl = this._getDelegateImpl();

        if (impl) {
            this._impl = impl;
        } else {
        }
    },

    /**
     * Returns the delegate implementation which should be used.
     *
     * The delegate implementation is expected to support a `sendMessage()`
     * method, which accepts the array of messages output by `getRequests()`
     *
     * @method _getDelegateImpl
     * @protected
     * @return {Object} An object with a `sendMessages(array)` method.
     *
     * The base implementation returns a global `NativeBridgeDelegate` object
     */
    _getDelegateImpl : function() {
        return Y.config.win.NativeBridgeDelegate;
    }

});

Y.BridgeBase.Delegate = Delegate;

Y.BridgeBase.addTransport("delegate", Y.BridgeBase.Delegate, true);


}, '@VERSION@', {"requires": ["bridge-base"]});
