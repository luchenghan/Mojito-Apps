YUI.add('notification', function (Y, NAME) {

/**
 * The notification module provides alert and confirm dialogs.
 * @module notification
*/

/**
 * The Notification class provides alert and confirm dialogs for user interaction.
 *
 *      YUI().use('notification', function(Y) {
 *
 *          function alertCallback() {
 *              Y.log('alert dismissed');
 *          }
 *
 *          Y.alert('hello world', alertCallback, 'Hello', 'OK');
 *
 *          function confirmCallback(index) {
 *              Y.log('confirm dismissed with button index: ' + index);
 *          }
 *
 *          Y.confirm('how are you?', confirmCallback, 'Confirm Mood', ['Great!, Argh!']);
 *
 *      });
 *
 * @class Notification
 * @static
 */

var Notification = Y.namespace('Notification');

// @private
// TODO: move to intl
Notification._LABELS = {
    OK: 'OK',
    CANCEL: 'Cancel'
};

Notification._serviceId = 'sNotification';

/**
 * Defers to device specific notification interface.
 * @method Y.alert
 * @param {String} message The message to display with the alert.
 * @param {Function} [dismissCallback] A function to run when the dialog is dismissed.
 * @param {String} [title] The title to display in the alert heading.
 * @param {String} [buttonLabel] The label to display on the alert button.
 * @param {Function} [failure] A function to run if the dialog fails to be displayed.
 */

Notification.alert = function(message, dismissCallback, title, buttonLabel, failure) {
    if (!buttonLabel) {
        buttonLabel = Notification._LABELS.OK;
    }

    return Y.Bridge.invokeMethod(Notification._serviceId, 'alert',
        {
            message: message,
            title: title,
            buttonLabel: buttonLabel
        }, {
            success: dismissCallback,
            failure: failure
        }
    );
};

/**
 * Defers to device specific notification interface.
 * @method Y.confirm
 * @param {String} message The message to display with the dialog.
 * @param {Function} [dismissCallback] A function to run when the dialog is dismissed.
 *  @param {Number} callback.index The callback argument, the zero-based index of
 * the button that was used to dismiss the dialog.
 * @param {String} [title] A title to display in the dialog heading.
 * @param {Array} [buttonLabels] An array of labels to display on the dialog buttons.
 * @param {Function} [failure] A function to run if the dialog fails to be displayed.
 */
Notification.confirm = function(message, dismissCallback, title, buttonLabels, failure) {
    buttonLabels = buttonLabels || [];

    if (!buttonLabels[0]) {
        buttonLabels[0] = Notification._LABELS.OK;
    }

    if (!buttonLabels[1]) {
        buttonLabels[1] = Notification._LABELS.CANCEL;
    }

    return Y.Bridge.invokeMethod(Notification._serviceId, 'confirm',
        {
            message: message,
            title: title,
            buttonLabels: buttonLabels
        }, {
            success: dismissCallback,
            failure: failure
        }
    );
};

Y.alert = Notification.alert;
Y.confirm = Notification.confirm;


}, '@VERSION@', {"requires": ["bridge"]});
