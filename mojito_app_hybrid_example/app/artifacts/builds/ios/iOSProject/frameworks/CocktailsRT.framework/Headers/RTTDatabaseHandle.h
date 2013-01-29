#import <Foundation/Foundation.h>
#import "RTHandleProxyMethods.h"	
@protocol RTTDatabaseHandleMethods <RTHandleProxyMethods>
    
/** 
 * Optional Arguments : 
*/
- (NSString *)description;

/** Called when a new database connection handle is being created
 * Required Arguments : 
 * @param name 
 * @param version 
 * Optional Arguments : 
 * @param displayName 
 * @param location indicate the location of database file. 'SDCard' indicate SD card, otherwise means in flash
 * @param successBlock 
 * @param upgradeBlock Called when the version passed in does not match the version of the database on disk - When a user gets this callback he should create a new tTransaction object with the connectionId returned here and a 'type' argument set to 'upgrade'. The SQLiteService will then bind the internal upgrade transaction to the one the user created. The user can then execute queries against that transaction to upgrade the database. NOTE: It is the user's responsiblity to call commit or rollback to end the transaction once complete. All connections against that database will be suspended till the commit/rollback is invoked on the upgrade transaction.
 * @param failureBlock This function is called on failure
*/
- (NSString *)createHandle_name:(NSString *)name version:(NSNumber *)version displayName:(NSString *)displayName location:(NSString *)location successBlock:(void(^)(NSDictionary *results))successBlock upgradeBlock:(void(^)(NSDictionary *results))upgradeBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;
- (NSString *)createHandle_name:(NSString *)name version:(NSNumber *)version successBlock:(void(^)(NSDictionary *results))successBlock upgradeBlock:(void(^)(NSDictionary *results))upgradeBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

/** Executes a SQL query on the database connection. These queries are autocommitted to the DB and return the full result set (for a SELECT)
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

