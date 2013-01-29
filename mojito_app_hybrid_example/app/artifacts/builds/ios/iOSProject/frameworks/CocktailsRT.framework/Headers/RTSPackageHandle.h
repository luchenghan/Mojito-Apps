#import <Foundation/Foundation.h>
#import "RTHandleProxyMethods.h"	
@protocol RTSPackageHandleMethods <RTHandleProxyMethods>
    
/** Get the current package service update state.
 * @param successBlock Called when update state is successfully returned.
 * Optional Arguments : 
 * @param failureBlock Called when the update state could not be retrieved.
*/
- (NSString *)getUpdateState_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** Watch the current package update state. Use cancelMethod to stop this call.
 * @param successBlock Called when the watch changed (or first time) and for any update state change thereafter.
 * Optional Arguments : 
 * @param failureBlock Called if the watch call failed.
*/
- (NSString *)watchUpdateState_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** Block the package updating until all blockers have canceled the block. Use cancelMethod to cancel this call.
 * Required Arguments : 
 * @param name A descriptive name of the blocker.
 * Optional Arguments : 
 * @param successBlock Called when the blocker has registered itself (updates may take a bit of time to block).
 * @param failureBlock Called if blockUpdates failed.
*/
- (NSString *)blockUpdates_name:(NSString *)name successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** Blocks the apply of package updates until all apply blockers have canceled. Use cancelMethod to cancel this call.
 * Required Arguments : 
 * @param name A descriptive name of the blocker.
 * Optional Arguments : 
 * @param successBlock Called when the blocker has registered itself (updates may take a bit of time to block).
 * @param failureBlock Called if applyUpdatesBlocker failed.
*/
- (NSString *)applyUpdatesBlocker_name:(NSString *)name successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** While this is present the callers web-view/iframe is not reloaded when an unsafe update is applied. Use cancelMethod to cancel this call.
 * Required Arguments : 
 * @param name A descriptive name of the apply ignorer.
 * Optional Arguments : 
 * @param successBlock Called when the apply ignorer has registered itself.
 * @param failureBlock Called if ignoreApplyUpdatesReload failed.
*/
- (NSString *)ignoreApplyUpdatesReload_name:(NSString *)name successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** Subscribe to a new (required) package.
 * Required Arguments : 
 * @param name Name of the package to subscribe to.
 * Optional Arguments : 
 * @param successBlock Called when we successfully subscribed to a new package (but it still needs to be downloaded and installed).
 * @param failureBlock Called if the subscribe failed.
*/
- (NSString *)subscribe_name:(NSString *)name successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** Unsubscribe a required package.
 * Required Arguments : 
 * @param name Name of the package to unsubscribe.
 * Optional Arguments : 
 * @param successBlock Called when we successfully unsubscribed the package.
 * @param failureBlock Called if the unsubscribe failed.
*/
- (NSString *)unsubscribe_name:(NSString *)name successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** Return an array of the filtered packages. See optional args for filters.
 * @param successBlock Called when we successfully performed the query.
 * Optional Arguments : 
 * @param name If present then just get information on the named package.
 * @param type If present restricts results to this package type.
 * @param subscribed If present and true only the subscribed packages.
 * @param killed If present and true the packages that have been killed (withdrawn).
 * @param failureBlock Called if we failed the query.
*/
- (NSString *)queryPackages_name:(NSString *)name type:(NSString *)type subscribed:(NSNumber *)subscribed killed:(NSNumber *)killed successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;
- (NSString *)queryPackages_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

@end

