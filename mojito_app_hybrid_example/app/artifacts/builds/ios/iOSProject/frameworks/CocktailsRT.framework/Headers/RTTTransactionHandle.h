#import <Foundation/Foundation.h>
#import "RTHandleProxyMethods.h"	
@protocol RTTTransactionHandleMethods <RTHandleProxyMethods>
    
/** 
 * Optional Arguments : 
*/
- (NSString *)description;

/** Called when a new transaction handle is being created
 * Required Arguments : 
 * @param connectionId 
 * Optional Arguments : 
 * @param type This argument is required only when attaching to an upgrade transaction - the only value this argument currently supports is 'upgrade'. Specifying any other value will simply be ignored. Additionally, you should only set type=upgrade from inside the database upgrade callback. Setting type=upgrade anywhere outside the database upgrade callback will result in an error.
 * @param successBlock 
 * @param failureBlock This function is called on failure
*/
- (NSString *)createHandle_connectionId:(NSString *)connectionId type:(NSString *)type successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;
- (NSString *)createHandle_connectionId:(NSString *)connectionId successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** Commits the current transaction.
 * Optional Arguments : 
 * @param successBlock This function is called on success
 * @param failureBlock This function is called on failure
*/
- (NSString *)commit_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** Rolls back the current transaction.
 * Optional Arguments : 
 * @param successBlock This function is called on success
 * @param failureBlock This function is called on failure
*/
- (NSString *)rollback_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** Executes a SQL query on the current transaction.
 * Required Arguments : 
 * @param query 
 * Optional Arguments : 
 * @param parameters 
 * @param successBlock This function is called on success
 * @param failureBlock This function is called on failure
*/
- (NSString *)executeQuery_query:(NSString *)query parameters:(NSArray *)parameters successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;
- (NSString *)executeQuery_query:(NSString *)query successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

@end

