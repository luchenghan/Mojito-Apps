#import <Foundation/Foundation.h>
#import "RTHandleProxyMethods.h"	
@protocol RTSSQLiteHandleMethods <RTHandleProxyMethods>
    
/** 
 * Optional Arguments : 
*/
- (NSString *)description;

/** List all databases in the current domain
 * Optional Arguments : 
 * @param successBlock This function is called with a list of all databases for the specified domain
 * @param failureBlock This function is called on failure
*/
- (NSString *)listDatabases_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** Delete the specified databases in the current domain
 * Required Arguments : 
 * @param databases 
 * Optional Arguments : 
 * @param locations 
 * @param successBlock This function is called on success
 * @param failureBlock This function is called on failure
*/
- (NSString *)deleteDatabases_databases:(NSArray *)databases locations:(NSArray *)locations successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;
- (NSString *)deleteDatabases_databases:(NSArray *)databases successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

@end

