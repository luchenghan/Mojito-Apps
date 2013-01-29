#import <Foundation/Foundation.h>
#import "RTHandleProxyMethods.h"	
@protocol RTTComponentHandleMethods <RTHandleProxyMethods>
    
/** Use this function to log against your custom component.
 * Required Arguments : 
 * @param severity 
 * @param message 
 * Optional Arguments : 
*/
- (NSString *)log_severity:(NSNumber *)severity message:(NSString *)message ;

@end

