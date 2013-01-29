#import <Foundation/Foundation.h>
#import "RTHandleProxyMethods.h"	
@protocol RTSAccelerometerHandleMethods <RTHandleProxyMethods>
    
/** (static)Use this function to get one time accleration update
 * Optional Arguments : 
 * @param successBlock This function is called on success
 * @param failureBlock This function is called on failure
*/
- (NSString *)getAcceleration_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** The function to watch changes in acceleration
 * Optional Arguments : 
 * @param successBlock The function is called on any change in acceleration
 * @param failureBlock This function is called on failure to report changes in acceleration
*/
- (NSString *)watchAcceleration_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

@end

