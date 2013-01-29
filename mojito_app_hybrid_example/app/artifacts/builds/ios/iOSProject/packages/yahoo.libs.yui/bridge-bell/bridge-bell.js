YUI.add('bridge-bell', function (Y, NAME) {

/**
 * Provides the bell transport implementation for use with Y.BridgeBase, which uses
 * a doorbell url dispatch to notify the native implementation that there are messages
 * to pick up. The native implementation is responsible for picking up messages by
 * invoking the Bridge's getRequests() methods.
 *
 * @module bridge-bell
 */

/**
 * Constructor for the Doorbell Bridge Transport implementation.
 *
 * Provides the bell transport implementation for use with Y.BridgeBase, which uses
 * a doorbell url dispatch to notify the native implementation that there are messages
 * to pick up.
 *
 * The native implementation is responsible for picking up messages by
 * invoking the Bridge `getRequests()` method and sending responses by invoking the
 * Bridge `sendResponses()` method.
 *
 * @class BridgeBase.Bell
 * @constructor
 *
 * @param {Object} [cfg] An optional configuration hash, with the following properties:
 *   @param {BridgeBase} [cfg.bridge] The bridge instance which owns this transport.
 *   @param {String} [cfg.url=bridge://bell] The doorbell url.
 *   @param {String} [nodeTemplate] Either "window", "win" or the template HTML to be passed to Y.Node.create,
 *   to create the node used to generate bell requests. If not window, the node needs to
 *   support a "src" attribute (e.g. img, iframe, script). Defaults to "window"
 */
function Bell(cfg) {
    this._init(cfg);
}

Y.mix(Bell.prototype, {

    /**
     * The default url to use for doorbell requests. User can override by
     * passing into constructor.
     *
     * @property url
     * @public
     * @type String
     * @value "bridge://bell"
     */
    url : "bridge://bell",

    /**
     * The template for the node type to use to dispatch requests. e.g. &lt;iframe&gt;, &lt;img&gt;
     * The node will be created using Y.Node.create, and placed outside the viewport. The node needs
     * to support a "src" attribute.
     *
     * The special value "window" or "win" is also supported, if the window is to be used for dispatch.
     *
     * @property nodeTemplate
     * @type String|HTML
     * @value "window"
     */
    nodeTemplate : "window",

    /**
     * Dispatches a request across the bridge
     *
     * @method sendMessage
     * @public
     */
    sendMessage : function() {
        if (this._impl === this._win) {
            this._impl.set("location.href", this.url);
        } else {
            this._impl.set("src", this.url);
        }
    },

    /**
     * The method the bridge should use to format the request messages array
     * for transport across the bridge through `getRequests()`
     *
     *   - The input to this method is always an array.
     *   - The output depends on what the other side of the bridge implement
     *     can support
     *
     * Bell generates a JSON string representation of the array.
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
     * Bell parses the input messages JSON into an array.
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
     * For Bell, the dispatch method used by sendMessage is inherently secure,
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
        var transport = this._impl;

        if (transport && transport !== this._win) {
            transport.remove(true);
        }

        this._impl = null;
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
            "bridge",
            "url",
            "nodeTemplate"
        ]);

        this._impl = this._create();
    },

    /**
     * Creates the element we'll use for the transport
     *
     * @method _create
     * @protected
     */
    _create : function() {

        var transportNode;

        // Defaults to window...
        if (this.nodeTemplate === "window" || this.nodeTemplate === "win") {
            this._win = Y.one("window");
            transportNode = this._win;
        } else {
            transportNode = Y.Node.create(this.nodeTemplate);

            transportNode.set("id", this.bridge.id + "_impl");

            // Accessibility
            transportNode.set("title", "Bridge Transport");
            transportNode.set("alt", "Bridge Transport");
            transportNode.set("role", "presentation");
            transportNode.set("tabIndex", "-1");

            transportNode.setStyles({
                width: "1px",
                height: "1px",
                overflow:"hidden",
                position: "absolute",
                top: "-10000px",
                left: "-10000px"
            });

            Y.Node.one("body").appendChild(transportNode);
        }

        return transportNode;
    }

});

Y.BridgeBase.Bell = Bell;

Y.BridgeBase.addTransport("bell", Y.BridgeBase.Bell, true);


}, '@VERSION@', {"requires": ["node", "bridge-base"]});
