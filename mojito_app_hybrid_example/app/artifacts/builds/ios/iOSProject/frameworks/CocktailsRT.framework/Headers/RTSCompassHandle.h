#import <Foundation/Foundation.h>
#import "RTHandleProxyMethods.h"	
@protocol RTSCompassHandleMethods <RTHandleProxyMethods>
    
/** 
 * Optional Arguments : 
 * @param successBlock This function is called on success
 * @param failureBlock This function is called on failiure
*/
- (NSString *)getHeading_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** 
 * Optional Arguments : 
 * @param successBlock This function is called when there's a change in heading data
 * @param failureBlock This function is called when we can't retrieve changed heading information.
*/
- (NSString *)watchHeading_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

@end

