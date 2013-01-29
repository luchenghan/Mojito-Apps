#import <Foundation/Foundation.h>
#import "RTHandleProxyMethods.h"	
@protocol RTSDummyHandleMethods <RTHandleProxyMethods>
    
/** Add a + b integers and reply with result.
 * Required Arguments : 
 * @param a 
 * @param b 
 * Optional Arguments : 
 * @param successBlock This function is called on success
 * @param failureBlock This function is called on failure
*/
- (NSString *)add_a:(NSNumber *)a b:(NSNumber *)b successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** Reply with success after a time. This will allow the call to be canceled in order to test call cancelation.
 * Required Arguments : 
 * @param time Time in milliseconds to delay before replying success.
 * @param successBlock This function is called on success (after delay(time) milliseconds).
 * Optional Arguments : 
 * @param failureBlock This function is called on failure
*/
- (NSString *)delay_time:(NSNumber *)time successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

@end

