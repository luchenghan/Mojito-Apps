#import <Foundation/Foundation.h>
#import "RTHandleProxyMethods.h"	
@protocol RTSTestHandleMethods <RTHandleProxyMethods>
    
/** Enable tests for given args (for this context). Use cancelMethod to disable these services again.
 * Required Arguments : 
 * @param services An array of services (string IDs) to enable the test APIs for in this context.
 * Optional Arguments : 
 * @param successBlock Called when enableTest completes and all services to be enabled are present.
 * @param failureBlock Called if enableTest fails (non-string service ID) or no servies were enabled.
*/
- (NSString *)enableTest_services:(NSArray *)services successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** Return the services that have their test API enabled (for this context).
 * Optional Arguments : 
 * @param successBlock Called when enabledServices completes and returns service IDs of all enabled services.
 * @param failureBlock Called if enabledServices failed.
*/
- (NSString *)enabledServices_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

@end

