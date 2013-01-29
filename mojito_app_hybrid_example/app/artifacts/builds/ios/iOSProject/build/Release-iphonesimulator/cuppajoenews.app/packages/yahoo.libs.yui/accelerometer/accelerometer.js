YUI.add('accelerometer', function (Y, NAME) {

/**
 * Provides interfaces for retrieving acceleration data and updates.
 * @module accelerometer
 */

/**
 * The Accelerometer class provides interfaces for accessing acceleration data.
 *
 *      YUI().use('accelerometer', function(Y) {
 *
 *          // success callback
 *          function success(acceleration) {
 *              var x         = acceleration.x,
 *                  y         = acceleration.y,
 *                  z         = acceleration.z,
 *                  timestamp = acceleration.timestamp;
 *          }
 *
 *          // failure callback (optional)
 *          function failure(error) {
 *              var code    = error.code,
 *                  message = error.message;
 *          }
 *          // get the current acceleration
 *          Y.Accelerometer.getAcceleration(success, failure);
 *
 *          // watch for acceleration changes
 *          var watchId = Y.Accelerometer.watchAcceleration(success, failure);
 *
 *          // stop watching for acceleration changes
 *          Y.Accelerometer.clearWatch(watchId);
 *
 *      });
 *
 * @class Accelerometer
 * @static
 */
var Accelerometer = Y.namespace('Accelerometer');

/**
 * Constants for use with the failure callback argument's `code` field.
 *
 * Available values:
 *
 *      Y.Accelerometer.ERROR.OK
 *      Y.Accelerometer.ERROR.SERVICE_UNAVAILABLE
 *      Y.Accelerometer.ERROR.FAILED_TO_FETCH_DATA
 *
 * @property ERROR
 * @type Object
 * @static
 */
Accelerometer.ERROR = {
    OK: 0,
    SERVICE_UNAVAILABLE: 1,
    FAILED_TO_FETCH_DATA: 2
};

Accelerometer._serviceId = 'sAccelerometer';

/**
 * Requests acceleration data and passes it to the success callback.
 * If the call fails, error data is passed to the (optional) failure callback.
 *
 * @method getAcceleration
 * @static
 * @param {Function} success The callback to run if the call succeeds.
 *  @param {Object} success.acceleration The argument passed to the success callback.
 *      @param {Number} success.acceleration.x Acceleration on the x-axis.
 *      @param {Number} success.acceleration.y Acceleration on the y-axis.
 *      @param {Number} success.acceleration.z Acceleration on the z-axis.
 * @param {Function} [failure] The callback to run if the call fails.
 *  @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 * See <a href="#property_ERROR">Y.Accelerometer.ERROR</a> for the full list of supported constants.
 *      @param {String} failure.error.message A message explaining the error.
 *      @param {Object} failure.error.details Additional error information.
 * @return {String} The invocationId returned from the bridge.
 */
Accelerometer.getAcceleration = function(success, failure) {
    return Y.Bridge.invokeMethod(Accelerometer._serviceId, 'getAcceleration', null, {
        success: success,
        failure: failure
    });
};

/**
 * Runs the success callback when acceleration changes are detected.
 * If the call fails, error data is passed to the (optional) failure callback.
 *
 * See <a href="#method_getAcceleration">getAcceleration</a> for callback details.
 * @method watchAcceleration
 * @static
 * @param {Function} success The callback to run if the call succeeds.
 * @param {Function} [failure] The callback to run if the call fails.
 * @return {String} The invocationId returned from the bridge.  This can
 * be passed to clearWatch() to stop the watch process.
 */
Accelerometer.watchAcceleration = function(success, failure) {
    return Y.Bridge.invokeMethod(Accelerometer._serviceId, 'watchAcceleration', null, {
        success: success,
        failure: failure
    });
};

/**
 * Removes the watch mapped to the given invocation id (returned from the watch call).
 * @method clearWatch
 * @static
 * @param {String} invocationId The id of the watch to be removed.
 * @param {Function} [success] The callback to run if the watch is successfully cleared.
 * @param {Function} [failure] The callback to run if the watch fails to be cleared.
 *
 */

Accelerometer.clearWatch = function(invocationId, success, failure) {
    Y.Bridge.cancelMethod(invocationId, success, failure);
};


}, '@VERSION@', {"requires": ["bridge"]});
