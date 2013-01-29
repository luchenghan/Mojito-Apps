#import <Foundation/Foundation.h>
#import "RTHandleProxyMethods.h"	
@protocol RTTCounterHandleMethods <RTHandleProxyMethods>
    
/** 
 * Required Arguments : 
 * @param a 
 * @param successBlock This function is called on success
 * @param failureBlock This function is called on failure
 * Optional Arguments : 
*/
- (NSString *)increment_a:(NSNumber *)a successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

@end

