YUI.add('connectionmonitor', function (Y, NAME) {

/**
 * Provides interfaces for retrieving connectionmonitor data when available.
 * @module connectionmonitor
 */

/**
 * The ConnectionMonitor class provides interfaces for accessing network connection data.
 *
 *      YUI().use('connectionmonitor', function(Y) {
 *
 *          // success callback
 *          function success(connection) {
 *              var type = connection.type;
 *          }
 *
 *          // failure callback (optional)
 *          function failure(error) {
 *              var code    = error.code,
 *                  message = error.message;
 *          }
 *
 *          // get the current connection
 *          Y.ConnectionMonitor.getConnection(success, failure);
 *
 *          // watch for connection changes
 *          Y.ConnectionMonitor.watchConnection(success, failure);
 *
 *      });
 *
 * @class ConnectionMonitor
 * @static
 */
var ConnectionMonitor = Y.namespace('ConnectionMonitor');

/**
 * Constants for use with the failure callback argument's `code` field.
 *
 * Available values:
 *
 *
 * @property ERROR
 * @type Object
 * @static
 */
ConnectionMonitor.ERROR = {

};

/**
 * Constants for use with `type` option.
 *
 * Available values:
 *
 *      Y.ConnectionMonitor.TYPE.UNKNOWN
 *      Y.ConnectionMonitor.TYPE.ETHERNET
 *      Y.ConnectionMonitor.TYPE.WIFI
 *      Y.ConnectionMonitor.TYPE.CELL_2G
 *      Y.ConnectionMonitor.TYPE.CELL_3G
 *      Y.ConnectionMonitor.TYPE.CELL_4G
 *      Y.ConnectionMonitor.TYPE.NONE
 *
 * @property TYPE
 * @type Object
 * @static
 */
ConnectionMonitor.TYPE = {
    UNKNOWN: 0,
    ETHERNET: 1,
    WIFI: 2,
    CELL_2G: 3,
    CELL_3G: 4,
    CELL_4G: 5,
    NONE: 6
};

ConnectionMonitor._serviceId = 'sConnectionMonitor';

/**
 * Requests data with the given options (or default values)
 * and passes it to the success callback or to the failure callback
 * if the data is unable to be retrieved.
 *
 * @method getConnection
 * @static
 * @param {Function} success The callback to run if the call succeeds.
 *  @param {Object} success.connection The argument passed to the success callback.
 *      @param {Number} success.connection.type The type of network connection.
 * See <a href="#property_TYPE">Y.ConnectionMonitor.TYPE</a> for the full list of supported constants.
 * @param {Function} [failure] The callback to run if the call fails.
 *  @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 * See <a href="#property_ERROR">Y.ConnectionMonitor.ERROR</a> for the full list of supported constants.
 *      @param {String} failure.error.message A message explaining the error.
 *      @param {Object} failure.error.details Additional error information.
 * @return {String} The invocationId returned from the bridge.
 */
ConnectionMonitor.getConnection = function(success, failure) {
    return Y.Bridge.invokeMethod(ConnectionMonitor._serviceId, 'getConnection', null, {
        success: success,
        failure: failure
    });
};

/**
 * Runs the success callback when connection changes are detected.
 * If the call fails, error data is passed to the (optional) failure callback.
 *
 * @method watchConnection
 * @static
 * @param {Function} success The success callback to pass to the host method.
 * @param {Function} [failure] The failure callback to pass to the host method.
 *
 * @return {String} The invocationId returned from the bridge.
 */
ConnectionMonitor.watchConnection = function(success, failure) {
    return Y.Bridge.invokeMethod(ConnectionMonitor._serviceId, 'watchConnection', null, {
        success: success,
        failure: failure
    });
};

/**
 * Signals the host to stop sending change notifications.
 * @method clearWatch
 * @static
 * @param {String} invocationId The id of the watch to be removed.
 * @param {Function} [success] The callback to run when the watch is successfully cleared.
 * @param {Function} [failure] The callback to run when the watch fails to be cleared.
 *
 */
ConnectionMonitor.clearWatch = function(invocationId, success, failure) {
    Y.Bridge.cancelMethod(invocationId, success, failure);
};


}, '@VERSION@', {"requires": ["bridge"]});
