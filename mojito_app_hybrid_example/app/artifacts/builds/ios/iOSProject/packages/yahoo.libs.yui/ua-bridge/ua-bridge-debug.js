YUI.add('ua-bridge', function(Y) {

/**
 * Adds bridge specific fields to Y.UA.
 * @module ua-bridge
 * @for Y.UA
 */

var win = Y.config.win,
    device = (win && win.device) ? win.device : false;

Y.mix(Y.UA, {

        /**
         * The model name of the user's device.
         * @property model
         * @type string
         * @default null
         * @static
         */
        model: device.name || null,

        /**
         * The uuid of the user's device.
         * @property uuid
         * @type string
         * @default null
         * @static
         */
        uuid: device.uuid || null
});


}, '@VERSION@' ,{requires:['yui']});
