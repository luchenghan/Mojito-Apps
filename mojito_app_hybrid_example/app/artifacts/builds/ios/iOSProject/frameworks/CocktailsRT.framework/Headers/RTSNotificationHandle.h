#import <Foundation/Foundation.h>
#import "RTHandleProxyMethods.h"	
@protocol RTSNotificationHandleMethods <RTHandleProxyMethods>
    
/** Show an alert with a single button to dismiss it.
 * Required Arguments : 
 * @param message The message to display for the alert.
 * @param buttonLabel The label to use for the button. Must be provided.
 * Optional Arguments : 
 * @param title The title to use for the alert.
 * @param successBlock Called when the alert was successfully displayed and dismissed by the user or closed.
 * @param failureBlock Called when the alert was not successfully displayed.
*/
- (NSString *)alert_message:(NSString *)message buttonLabel:(NSString *)buttonLabel title:(NSString *)title successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;
- (NSString *)alert_message:(NSString *)message buttonLabel:(NSString *)buttonLabel successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** Show a confirmation dialog with choice buttons.
 * Required Arguments : 
 * @param message The message to display for the confirmation dialog.
 * @param buttonLabels An array of the string labels to use for the buttons. Must be provided.
 * Optional Arguments : 
 * @param title The title to use for the confirmation dialog.
 * @param successBlock Called when the confirmation dialog was displayed and a button was selected by the user or alert was closed.
 * @param failureBlock Called when the confirmation dialog was not successfully displayed.
*/
- (NSString *)confirm_message:(NSString *)message buttonLabels:(NSArray *)buttonLabels title:(NSString *)title successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;
- (NSString *)confirm_message:(NSString *)message buttonLabels:(NSArray *)buttonLabels successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

@end

