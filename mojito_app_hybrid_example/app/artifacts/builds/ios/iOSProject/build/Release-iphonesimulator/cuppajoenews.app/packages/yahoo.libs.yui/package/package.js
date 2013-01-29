YUI.add('package', function (Y, NAME) {

/**
 * Provides an abstraction for Y! package.
 * @module package
 */

/**
 * The Package class provides utilities for package management.
 *
 *      YUI().use('package', function(Y) {
 *
 *       });
 *
 *
 * @class Package
 * @static
 */
var Package = Y.namespace('Package');

/**
 * Constants for use with the failure callback argument's `code` field.
 *
 * Available values:
 *
 * @property ERROR
 * @type Object
 * @static
 */
Package.ERROR = {
};

Package._serviceId = 'sPackage';

/**
 * Get the current package service update state.
 *
 * @method getUpdateState
 * @static
 * @param {Function} success The callback to run when the call succeeds.
 *  @param {Object} success.result The argument passed to the success callback.
 *      @param {String} success.result.state One of "State migrating, idle,
 *      local, blocked, started, updating, apply, completed, error, failed".
 *      @param {Array} success.result.blockers Array of string names of the
 *      blockers if state is blocked.
 *      @param {Object} success.result.updating Status of the update in progress
 *      sample: { name: packageName, state: downloading/downloaded, progress:0.5}
 * TODO: IDL has completed wrapper?
 *      @param {Array} success.result.added Array of added package names.
 *      @param {Array} success.result.deleted Array of deleted package names.
 *      @param {Array} success.result.updated Array of updated package names.
 *      @param {Object} success.result.failed Error code, message, and detail.
 *      @param {Array} success.result.error Array of details of the non-fatal
 *      error that occurred.
 * @param {Function} [failure] The callback run when the call fails.
 *  @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 *      @param {String} failure.error.message A message explaining the error.
 *      @param {Object} failure.error.detail Additional error information.
 * @return {String} The invocationId returned from the bridge.
 */
Package.getUpdateState = function(success, failure, options) {
    return Y.Bridge.invokeMethod(Package._serviceId, 'getUpdateState', options, {
        success: success,
        failure: failure
    });
};

/**
 * Block the package updating until all blockers have canceled the block.
 * Use cancelMethod to cancel this call.
 *
 * @method blockUpdates
 * @static
 * @param {Function} [success] The callback to run when the logout succeeds.
 * @param {Function} [failure] The callback run when the call fails.
 *  @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 *      @param {String} failure.error.message A message explaining the error.
 *      @param {Object} failure.error.detail Additional error information.
 * @param {Object} options The options to pass to the host method.
 *   @param {String} options.name A descriptive name of the blocker.
 * @return {String} The invocationId returned from the bridge.
 */
Package.blockUpdates = function(success, failure, options) {
    return Y.Bridge.invokeMethod(Package._serviceId, 'blockUpdates', options, {
        success: success,
        failure: failure
    });
};

/**
 * Blocks the apply of package updates until all apply blockers have canceled.
 * Use cancelMethod to cancel this call.
 *
 * @method applyUpdatesBlocker
 * @static
 * @param {Function} [success] The callback to run when the logout succeeds.
 * @param {Function} [failure] The callback run when the call fails.
 *  @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 *      @param {String} failure.error.message A message explaining the error.
 *      @param {Object} failure.error.detail Additional error information.
 * @param {Object} options The options to pass to the host method.
 *   @param {String} options.name A descriptive name of the blocker.
 * @return {String} The invocationId returned from the bridge.
 */
Package.applyUpdatesBlocker = function(success, failure, options) {
    return Y.Bridge.invokeMethod(Package._serviceId, 'applyUpdatesBlocker', options, {
        success: success,
        failure: failure
    });
};

/**
 * While this is present the callers web-view/iframe is not reloaded when
 * an unsafe update is applied. Use cancelMethod to cancel this call.
 *
 * @method ignoreApplyUpdatesReload
 * @static
 * @param {Function} [success] The callback to run when the logout succeeds.
 * @param {Function} [failure] The callback run when the call fails.
 *  @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 *      @param {String} failure.error.message A message explaining the error.
 *      @param {Object} failure.error.detail Additional error information.
 * @param {Object} options The options to pass to the host method.
 *   @param {String} options.name A descriptive name of the apply ignorer.
 * @return {String} The invocationId returned from the bridge.
 */
Package.ignoreApplyUpdatesReload = function(success, failure, options) {
    return Y.Bridge.invokeMethod(Package._serviceId, 'ignoreApplyUpdatesReload', options, {
        success: success,
        failure: failure
    });
};

/**
 * Subscribe to a new (required) package.
 * @method subscribe
 * @static
 * @param {Function} [success] The callback to run when the logout succeeds.
 * @param {Function} [failure] The callback run when the call fails.
 *  @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 *      @param {String} failure.error.message A message explaining the error.
 *      @param {Object} failure.error.detail Additional error information.
 * @param {Object} options The options to pass to the host method.
 *   @param {String} options.name The name of the package to subscribe to.
 * @return {String} The invocationId returned from the bridge.
 */
Package.subscribe = function(success, failure, options) {
    return Y.Bridge.invokeMethod(Package._serviceId, 'subscribe', options, {
        success: success,
        failure: failure
    });
};

/**
 * Unsubscribe a new required package.
 * @method unsubscribe
 * @static
 * @param {Function} [success] The callback to run when the logout succeeds.
 * @param {Function} [failure] The callback run when the call fails.
 *  @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 *      @param {String} failure.error.message A message explaining the error.
 *      @param {Object} failure.error.detail Additional error information.
 * @param {Object} options The options to pass to the host method.
 *   @param {String} options.name The name of the package to unsubscribe.
 * @return {String} The invocationId returned from the bridge.
 */
Package.unsubscribe = function(success, failure, options) {
    return Y.Bridge.invokeMethod(Package._serviceId, 'unsubscribe', options, {
        success: success,
        failure: failure
    });
};

/**
 * Return an array of the filtered packages. See optional args for filters.
 * @method queryPackages
 * @static
 * @param {Function} success The callback to run when the logout succeeds.
 *  @param {Object} success.result The argument passed to the success callback.
 *      @param {Array} success.result.packages An array of objects of
 *      {name: packageName, type: packageType, subscribed: 0/1, killed: 0/1}
 *      for queried packages.
 * @param {Function} [failure] The callback run when the call fails.
 *  @param {Object} failure.error The argument passed to the failure callback.
 *      @param {Number} failure.error.code The error code.
 *      @param {String} failure.error.message A message explaining the error.
 *      @param {Object} failure.error.detail Additional error information.
 * @param {Object} [options] The options to pass to the host method.
 *   @param {String} [options.name] Restrict results to this package.
 *   named package.
 *   @param {String} [options.type] Restrict results to this package type.
 *   @param {Boolean} [options.subscribed] Restrict results to the subscribed
 *   packages if true.
 *   @param {Boolean} [options.killed] Restrict results to killed (withdrawn)
 *   packages if true.
 * @return {String} The invocationId returned from the bridge.
 */
Package.queryPackages = function(success, failure, options) {
    return Y.Bridge.invokeMethod(Package._serviceId, 'queryPackages', options, {
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
Package.clearWatch = function(invocationId, success, failure) {
    Y.Bridge.cancelMethod(invocationId, success, failure);
};


}, '@VERSION@', {"requires": ["bridge"]});
