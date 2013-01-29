#import <Foundation/Foundation.h>
#import "RTHandleProxyMethods.h"	
@protocol RTSLoggingHandleMethods <RTHandleProxyMethods>
    
/** 
 * Required Arguments : 
 * @param component 
 * @param severity 
 * @param message 
 * Optional Arguments : 
*/
- (NSString *)log_component:(NSString *)component severity:(NSNumber *)severity message:(NSString *)message ;

/** 
 * Required Arguments : 
 * @param component 
 * Optional Arguments : 
 * @param successBlock This function is called on success
 * @param failureBlock This function is called on failiure
*/
- (NSString *)severityForComponent_component:(NSString *)component successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** 
 * Required Arguments : 
 * @param component 
 * @param severity 
 * Optional Arguments : 
 * @param successBlock This function is called on success
 * @param failureBlock This function is called on failiure
*/
- (NSString *)setSeverityForComponent_component:(NSString *)component severity:(NSNumber *)severity successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

@end

