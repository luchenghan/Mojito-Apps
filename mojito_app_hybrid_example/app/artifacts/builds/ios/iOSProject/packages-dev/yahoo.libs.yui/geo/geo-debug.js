YUI.add('geo', function (Y, NAME) {

/**
 * Provides interfaces for retrieving Geolocation data when available.
 * @module geo
 */

/**
 * The Geo class provides access to geolocation data.
 *
 *      YUI().use('geo', function(Y) {
 *
 *          // success callback
 *          function success(location) {
 *              var timestamp        = location.timestamp,
 *                  coords           = location.coords,
 *                  latitude         = coords.latitude,
 *                  longitude        = coords.longitude,
 *                  accuracy         = coords.accuracy,
 *                  altitude         = coords.altitude,
 *                  heading          = coords.heading,
 *                  speed            = coords.speed,
 *                  altitudeAccuracy = coords.altitudeAccuracy;
 *          }
 *
 *          // failure callback (optional)
 *          function failure(error) {
 *              var code    = error.code,
 *                  message = error.message;
 *          }
 *
 *          // some configuration options (optional)
 *          var options = {
 *                  timeout: 5000, // 5 seconds
 *                  enableHighAccuracy: true
 *          };
 *
 *          // get the current location
 *          Y.Geo.getLocation(success, failure, options);
 *
 *          // watch for location changes
 *          var watchId = Y.Geo.watchLocation(success, failure, options);
 *
 *          // stop watching for location changes
 *          Y.Geo.clearWatch(watchId);
 *
 *       });
 *
 *
 * @class Geo
 * @static
 */
var Geo = Y.namespace('Geo'),

    // TODO: Remove post 0.9, when CRT will be in sync with W3C.
    _patchCRTArgs = function(successCb) {

        return function(arg) {

            if (arg && !arg.coords) {

                arg.coords = {
                    latitude : arg.latitude,
                    longitude : arg.longitude,
                    accuracy : arg.accuracy,
                    altitude : arg.altitude,
                    heading : arg.heading,
                    speed : arg.speed,
                    altitudeAccuracy : arg.altitudeAccuracy
                };

                delete arg.latitude;
                delete arg.longitude;
                delete arg.accuracy;
                delete arg.altitude;
                delete arg.heading;
                delete arg.speed;
                delete arg.altitudeAccuracy;
            }

            return successCb(arg);
        };
    };

/**
 * Constants for use with the failure callback argument's `code` field.
 *
 * Available values:
 *
 *      Y.Geo.ERROR.EXTERNAL
 *      Y.Geo.ERROR.LOCATION_UNKNOWN
 *
 * @property ERROR
 * @type Object
 * @static
 */
Geo.ERROR = {
    EXTERNAL: -1,
    LOCATION_UNKNOWN: 1
};

Geo.INFINITY = 1e+100;

Geo._serviceId = 'sGeo';

/**
 * Requests data with the given options (or default values)
 * and passes it to the success callback or to the failure callback
 * if the data is unable to be retrieved.
 *
 * @method getLocation
 * @static
 * @param {Function} success The callback to run when the call succeeds.
 *  @param {Object} success.location The argument passed to the success callback.
 *      @param {Number} success.location.timestamp The millisecond time
 * the data was aquired.
 *      @param {Object} success.location.coords The object containing coordinate data.
 *          @param {Number} success.location.coords.latitude The latitude in degrees.
 *          @param {Number} success.location.coords.longitude The longitude in degrees.
 *          @param {Number} success.location.coords.altitude The altitude in meters above the ellipsoid.
 *          @param {Number} success.location.coords.accuracy The accuracy level of the
 * latitude and longitude coordinates in meters.
 *          @param {Number} success.location.coords.altitudeAccuracy The accuracy level of the
 * altitude value in meters.
 *          @param {Number} success.location.coords.heading The heading in degrees
 * clockwise from true north.
 *          @param {Number} success.location.coords.speed The magnitude of the
 * horizontal component of the current velocity in meters per second.
 * @param {Function} [failure] The callback run when the call fails.
 *  @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 * See <a href="#property_ERROR">Y.Geo.ERROR</a> for the full list of supported constants.
 *      @param {String} failure.error.message A message explaining the error.
 *      @param {Object} failure.error.details Additional error information.
 * @param {Object} [options] The options to pass to the host method.
 *   @param {Boolean} [options.enableHighAccuracy=false] Whether or not to try for a high resolution value.
 *   @param {Number} [options.maximumAge=0] The amount of time allowed to use a cached value.
 *   @param {Number} [options.timeout=Y.Geo.INFINITY] The amount of time allowed to pass when retrieving a value.
 *
 * @return {String} The invocationId returned from the bridge.
 */
Geo.getLocation = function(success, failure, options) {
    return Y.Bridge.invokeMethod(Geo._serviceId, 'getLocation', options, {
        success: _patchCRTArgs(success),
        failure: failure
    });
};

/**
 * Runs the success callback when location changes are detected.
 * If the call fails, error data is passed to the (optional) failure callback.
 *
 * See <a href="#method_getLocation">getLocation</a> for signature details.
 *
 * @method watchLocation
 * @static
 * @param {Function} success The callback to run if the call succeeds.
 * @param {Function} [failure] The callback to run if the call fails.
 * @param {Object} [options] The options to pass to the host method.
 * @return {String} The invocationId returned from the bridge.
 */
Geo.watchLocation = function(success, failure, options) {
    return Y.Bridge.invokeMethod(Geo._serviceId, 'watchLocation', options, {
        success: _patchCRTArgs(success),
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
//Geo.clearWatch = Y.Handle.clearWatch;
Geo.clearWatch = function(invocationId, success, failure) {
    Y.Bridge.cancelMethod(invocationId, success, failure);
};

}, '@VERSION@', {"requires": ["bridge"]});
