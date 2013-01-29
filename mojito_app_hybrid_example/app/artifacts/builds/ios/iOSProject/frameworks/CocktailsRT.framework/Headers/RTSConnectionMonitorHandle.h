#import <Foundation/Foundation.h>
#import "RTHandleProxyMethods.h"	
@protocol RTSConnectionMonitorHandleMethods <RTHandleProxyMethods>
    
/** 
 * Optional Arguments : 
 * @param successBlock This function is called on success
 * @param failureBlock This function is called on failiure
*/
- (NSString *)getConnection_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** 
 * Optional Arguments : 
 * @param successBlock This function is called on any change in connection
 * @param failureBlock This function is called on failiure to fetch connection change information
*/
- (NSString *)watchConnection_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

@end

