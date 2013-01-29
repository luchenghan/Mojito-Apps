YUI.add('camera', function (Y, NAME) {

/**
 * Provides interfaces for retrieving camera data when available.
 * @module camera
 */

/**
 * The Camera class provides access to the camera interface.
 *
 *      YUI().use('camera', function(Y) {
 *
 *           // success callback
 *           function success(payload) {
 *              var data = payload.result;
 *           }
 *
 *           // failure callback (optional)
 *           function failure(error) {
 *               var code    = error.code,
 *                   message = error.message;
 *           }
 *
 *           // some options (optional)
 *           var options = {
 *               quality: 100,
 *               allowEdit: false,
 *               encodingType: Y.Camera.ENCODING.PNG
 *           };
 *
 *           Y.Camera.launch(success, failure, options);
 *
 *      });
 *
 * @class Camera
 * @static
 */
var Camera = Y.namespace('Camera');

/**
 * Constants for use with `encodingType` option.
 *
 * Available values:
 *
 *      Y.Camera.ENCODING.JPEG
 *      Y.Camera.ENCODING.PNG
 *
 * @property ENCODING
 * @type Object
 * @static
 */

Camera.ENCODING = {
    JPEG: 0,
    PNG: 1
};

/**
 * Constants for use with `mediaType` option.
 *
 * Available values:
 *
 *      Y.Camera.MEDIA.PICTURE
 *      Y.Camera.MEDIA.VIDEO
 *      Y.Camera.MEDIA.ALL
 *
 * @property MEDIA
 * @type Object
 * @static
 */

Camera.MEDIA = {
    PICTURE: 0,
    VIDEO: 1,
    ALL: 2
};

/**
 * Constants for use with `sourceType` option.
 *
 * Available values:
 *
 *      Y.Camera.SOURCE.PHOTO_LIBRARY
 *      Y.Camera.SOURCE.CAMERA
 *      Y.Camera.SOURCE.SAVED_PHOTO_ALBUM
 *
 * @property SOURCE
 * @type Object
 * @static
 */

Camera.SOURCE = {
    PHOTO_LIBRARY: 0,
    CAMERA: 1,
    SAVED_PHOTO_ALBUM: 2
};

/**
 * Constants for use with the failure callback argument's `code` field.
 *
 * Available values:
 *
 *      Y.Camera.ERROR.USER_CANCELLED
 *      Y.Camera.ERROR.INVALID_SOURCE
 *      Y.Camera.ERROR.INVALID_DEVICE
 *      Y.Camera.ERROR.INVALID_DESTINATION
 *      Y.Camera.ERROR.INVALID_MEDIA_TYPE
 *      Y.Camera.ERROR.FAILED_TO_SAVE_IMAGE
 *      Y.Camera.ERROR.BUSY
 *      Y.Camera.ERROR.CAMERA_NOT_IN_USE
 *      Y.Camera.ERROR.PHOTO_PICKER_NOT_IN_USE
 *
 * @property ERROR
 * @type Object
 * @static
 */

Camera.ERROR = {
    USER_CANCELLED: 0,
    INVALID_SOURCE: 1,
    INVALID_DEVICE: 2,
    INVALID_DESTINATION: 3,
    INVALID_MEDIA_TYPE: 4,
    FAILED_TO_SAVE_IMAGE: 5,
    BUSY: 6,
    CAMERA_NOT_IN_USE: 7,
    PHOTO_PICKER_NOT_IN_USE: 8
};

Camera._serviceId = 'sCamera';

/**
 * Requests data with the given options (or default values)
 * and passes it to the success callback or to the failure callback
 * if the data is unable to be retrieved.
 *
 * @method launch
 * @static
 * @param {Function} success The callback to run when image data is returned.
 *  @param {Object} success.payload The argument passed to the success callback.
 *      @param {Number} success.payload.result The image data in the specified encodingType.
 * @param {Function} [failure] The callback to run when image data fails to be returned.
 *  @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 * See <a href="#property_ERROR">Y.Camera.ERROR</a> for the full list of supported constants.
 *      @param {String} failure.error.message A message explaining the error.
 *      @param {Object} failure.error.details Additional error information.
 * @param {Object} [options] Configuration options for the returned image.
 *   @param {Number} [options.quality=50] A number representing the quality of the image.
 *   @param {Boolean} [options.allowEdit=false]  Whether or not the returned image should be editable.
 *   @param {Number} [options.targetWidth] The desired width dimension of the
 * returned image.  Defaults to the original size, or scales proportionally with
 * the provided `targetHeight`.
 *   @param {Number} [options.targetHeight] The desired height dimension of the
 * returned image.  Defaults to the original size, or scales proportionally with
 * the provided `targetWidth`.
 *
 *   @param {Number} [options.encodingType=Y.Camera.ENCODING.JPEG] The encoding type of the returned image.
 * See <a href="#property_ENCODING">Y.Camera.ENCODING</a> for the full list of supported constants.
 *
 *   @param {Number} [options.mediaType=Y.Camera.MEDIA.PICTURE] The media type of the returned image.
 * See <a href="#property_MEDIA">Y.Camera.MEDIA</a> for the full list of supported constants.
 *
 *   @param {Number} [options.sourceType=Y.Camera.SOURCE.CAMERA] The source to retrieve the image from.
 * See <a href="#property_SOURCE">Y.Camera.SOURCE</a> for the full list of supported constants.
 *
 * @return {String} The invocationId returned from the bridge.
 */
Camera.launch = function (success, failure, options) {
    return Y.Bridge.invokeMethod(Camera._serviceId, 'launch', options, {
        success: success,
        failure: failure
    });
};


}, '@VERSION@', {"requires": ["bridge"]});
