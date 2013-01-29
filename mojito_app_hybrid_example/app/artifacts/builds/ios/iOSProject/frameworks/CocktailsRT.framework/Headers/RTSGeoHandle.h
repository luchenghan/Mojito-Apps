#import <Foundation/Foundation.h>
#import "RTHandleProxyMethods.h"	
@protocol RTSGeoHandleMethods <RTHandleProxyMethods>
    
/** 
 * Optional Arguments : 
 * @param enableHighAccuracy Whether to get high accuracy location update or not. Default is no.
 * @param maximumAge Location update cannot be older than the specified age expressed in number of millisec. Default is 0
 * @param timeout Maximum time to wait for a location update expressed in number of millisec. Default is infinite
 * @param successBlock This function is called to send one time location notification
 * @param failureBlock This function is called on failure to get location update event
*/
- (NSString *)getLocation_enableHighAccuracy:(NSNumber *)enableHighAccuracy maximumAge:(NSNumber *)maximumAge timeout:(NSNumber *)timeout successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;
- (NSString *)getLocation_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** Use this function to get continuous location change updates.
 * Optional Arguments : 
 * @param enableHighAccuracy Whether to get high accuracy location update or not. Default is no.
 * @param maximumAge Location update cannot be older than the specified age expressed in number of millisec. Default is 0
 * @param timeout Maximum time to wait for a location update expressed in number of millisec. Default is infinite
 * @param successBlock This function is called to send location change notification
 * @param failureBlock This function is called on failure to get location change event
*/
- (NSString *)watchLocation_enableHighAccuracy:(NSNumber *)enableHighAccuracy maximumAge:(NSNumber *)maximumAge timeout:(NSNumber *)timeout successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;
- (NSString *)watchLocation_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

@end

