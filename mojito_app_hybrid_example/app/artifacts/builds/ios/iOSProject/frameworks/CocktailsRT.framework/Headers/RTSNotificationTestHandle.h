#import <Foundation/Foundation.h>
#import "RTHandleProxyMethods.h"	
@protocol RTSNotificationTestHandleMethods <RTHandleProxyMethods>
    
/** Return an array of all of the stacked alerts and confirms, the last is the top of the stack.
 * @param successBlock Called to reply with info (array of id, title, message, buttonLabels)
 * Optional Arguments : 
 * @param failureBlock Called when there was an error processing the request. An empty stack will return success with an empty array.
*/
- (NSString *)stackInfo_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** Dismiss an alert or confirm by ID or the top-most one.
 * Optional Arguments : 
 * @param id The ID of the alert to dismiss retrieved by the stackInfo call. If missing the top-most alert or confirm is dismissed.
 * @param successBlock Returns info of the dismissed alert (array of id, title, message, buttonLabels)
 * @param failureBlock Called when there was an error processing the request such as no such ID or empty alert stack.
*/
- (NSString *)dismiss_id:(NSNumber *)id successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;
- (NSString *)dismiss_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

@end

