#import <Foundation/Foundation.h>
#import "RTHandleProxyMethods.h"	
@protocol RTSCameraTestHandleMethods <RTHandleProxyMethods>
    
/** Cancel the camera which should have been opened via the launch function.
 * Optional Arguments : 
 * @param successBlock Called when the camera was successfully canceled.
 * @param failureBlock Called when there was an error such as the camera was not being used.
*/
- (NSString *)cancelCamera_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** Cancel the photo picker which should have been opened via the launch function.
 * Optional Arguments : 
 * @param successBlock Called when the photo picker was successfully canceled.
 * @param failureBlock Called when there was an error such as the photo picker was not being used.
*/
- (NSString *)cancelPhotoPicker_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

@end

