YUI.add('device-events', function(Y) {

/**
 * Provides interfaces for listening to device-events when available.
 * @module device-events
 * @main device-events
 */

var doc = Y.config.doc;

Y.DeviceEvents = {
    deviceready: function() {
        Y.fire('jsbridgeready');
    },

    pause: function() {
        Y.fire('background');
    },

    resume: function() {
        Y.fire('foreground');
    }/*,

    lowmemory: function() {
        Y.fire('lowmemory');
    }*/
};

if (doc.addEventListener) {
    Y.each(Y.DeviceEvents, function(fn, type) {
        doc.addEventListener(type, fn, false);
    });
}

/*
Y.Node.DOM_EVENTS.deviceready = true;

Y.Event.define('deviceready', {
    _deviceReady: function() {
        console.log('_deviceready');
    },

    on: function (node, subscriber, ce) {
        console.log('on');
        Y.one('doc').on('deviceready', this._deviceReady, this, doc, subscriber, ce);
    },

    detach: function (node, subscriber, ce) {
    }
});
*/


}, '@VERSION@' ,{requires:['event-custom']});
