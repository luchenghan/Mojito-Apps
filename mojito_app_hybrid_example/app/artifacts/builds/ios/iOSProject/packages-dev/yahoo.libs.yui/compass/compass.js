YUI.add('compass', function (Y, NAME) {

/**
 * Provides interfaces for retrieving heading data when available.
 * @module compass
 */

/**
 * The Compass class provides compass heading data.
 *
 *      YUI().use('compass', function(Y) {
 *
 *          // success callback
 *          function success(heading) {
 *              var magneticHeading = heading.magneticHeading,
 *                  trueHeading     = heading.trueHeading,
 *                  headingAccuracy = heading.headingAccuracy,
 *                  timestamp       = heading.timestamp;
 *          }
 *
 *          // failure callback (optional)
 *          function failure(error) {
 *              var code    = error.code,
 *                  message = error.message;
 *          }
 *
 *          // get the current heading
 *          Y.Compass.getHeading(success, failure);
 *
 *          // watch for heading changes
 *          Y.Compass.watchHeading(success, failure);
 *
 *      });
 *
 * @class Compass
 * @static
 */
var Compass = Y.namespace('Compass');

/**
 * Constants for use with the failure callback argument's `code` field.
 *
 * Available values:
 *
 *      Y.Compass.ERROR.OK
 *      Y.Compass.ERROR.SERVICE_UNAVAILABLE
 *      Y.Compass.ERROR.DENIED
 *      Y.Compass.ERROR.HEADING_FAILURE
 *      Y.Compass.ERROR.UNKNOWN
 *
 * @property ERROR
 * @type Object
 * @static
 */
Compass.ERROR = {
    OK: 0,
    SERVICE_UNAVAILABLE: 1,
    DENIED: 2,
    HEADING_FAILURE: 3,
    UNKNOWN: 4

};

Compass._serviceId = 'sCompass';


/**
 * Requests data with the given options (or default values)
 * and passes it to the success callback or to the failure callback
 * if the data is unable to be retrieved.
 *
 * @method getHeading
 * @static
 * @param {Function} success The success callback to pass to the host method.
 *  @param {Object} success.heading The argument passed to the success callback.
 *      @param {Number} success.heading.timestamp The millisecond time
 * the data was aquired.
 *      @param {Number} success.heading.magneticHeading The magnetic heading in degrees.
 *      @param {Number} success.heading.trueHeading The heading in degrees
 * relative to the north pole.
 *      @param {Number} success.heading.headingAccuracy The deviation in degrees.
 * @param {Function} [failure] The callback run when the call fails.
 *  @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 * See <a href="#property_ERROR">Y.Compass.ERROR</a> for the full list of supported constants.
 *      @param {String} failure.error.message A message explaining the error.
 *      @param {Object} failure.error.details Additional error information.
 * @return {String} The invocationId returned from the bridge.
 */
Compass.getHeading = function(success, failure) {
    return Y.Bridge.invokeMethod(Compass._serviceId, 'getHeading', null, {
        success: success,
        failure: failure
    });
};

/**
 * Runs the success callback when heading changes are detected.
 * If the call fails, error data is passed to the (optional) failure callback.
 *
 * See <a href="#method_getHeading">getHeading</a> for callback details.
 *
 * @method watchHeading
 * @static
 * @param {Function} success The callback to run if the call succeeds.
 * @param {Function} [failure] The callback to run if the call fails.
 *
 * @return {String} The invocationId returned from the bridge.
 */
Compass.watchHeading = function(success, failure) {
    return Y.Bridge.invokeMethod(Compass._serviceId, 'watchHeading', null, {
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
Compass.clearWatch = function(invocationId, success, failure) {
    Y.Bridge.cancelMethod(invocationId, success, failure);
};


}, '@VERSION@', {"requires": ["bridge"]});
