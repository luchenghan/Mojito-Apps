//
//  RTSQLiteService.h
//  ychromert
//
//  Created by Srinivas Raovasudeva on 5/31/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import "RTService.h"
#import <sqlite3.h>

@class RTSQLError;
@class RTQueryResult;
@class RTResultSet;

typedef enum {
    kRTOpenConnectionSuccess = 0,
    kRTOpenConnectionUpgrade,
    kRTOpenConnectionFailure
}RTOpenConnectionResult;

extern NSString *const kRTSQliteServiceDatabaseNameKey;
extern NSString *const kRTSQliteServiceDatabaseVersionKey;
extern NSString *const kRTSQliteServiceDatabaseDisplayNameKey;

extern NSString *const kRTSQliteServiceDatabaseConnectionId;
extern NSString *const kRTSQliteServiceDatabaseTransactionId;

@interface RTSQLiteService : RTService


- (void)openConnection:(NSString *)dbConnectionId connectionInfo:(NSDictionary *)dbInfo supportsUpgrade:(BOOL)supportsUpgrade callback:(void(^)(RTOpenConnectionResult, NSString * /* connection id */, RTSQLError *))callback;
- (void)closeConnection:(NSString *)dbConnectionId callback:(void(^)(BOOL, RTSQLError *))callback;

- (void)beginTransaction:(NSString *)transactionId forConnection:(NSString *)dbConnectionId  callback:(void(^)(BOOL, NSString * /* transaction id */, RTSQLError *))callback;
- (void)commitTransaction:(NSString *)transactionId forConnection:(NSString *)dbConnectionId callback:(void(^)(BOOL, RTSQLError *))callback;
- (void)rollbackTransaction:(NSString *)transactionId forConnection:(NSString *)dbConnectionId callback:(void(^)(BOOL, RTSQLError *))callback;
- (void)attachUpgradeTransaction:(NSString *)transactionId forConnection:(NSString *)dbConnectionId callback:(void(^)(BOOL, NSString * /* transaction id */, RTSQLError *))callback;

- (void)executeQuery:(NSString *)queryId queryString:(NSString *)queryString withParameters:(NSArray *)parameters forConnection:(NSString *)dbConnectionId forTransaction:(NSString *)transactionId callback:(void(^)(BOOL, RTQueryResult *, RTSQLError *))callback ;

- (void)executeSteppedQuery:(NSString *)queryId queryString:(NSString *)queryString withParameters:(NSArray *)parameters forConnection:(NSString *)dbConnectionId forTransaction:(NSString *)transactionId callback:(void(^)(BOOL success, NSString *resultSetId, RTSQLError *error))callback;

- (void)listDatabasesWithCallback:(void(^)(NSArray *, RTSQLError*))callback;
- (void)deleteDatabases:(NSArray *)names callback:(void(^)(BOOL, RTSQLError*))callback;

- (void)validateSteppedQueryID:(NSString *) queryId forConnection:(NSString *) connectionId forTransaction:(NSString *) transactionId callback:(void(^)(BOOL)) callback;

- (void)columnCountForResultSet:(NSString *)resultSetId forConnection:(NSString *) connectionId forTransaction:(NSString *) transactionId callback:(void(^)(NSNumber *, RTSQLError *)) callback;

- (void)columnTypeForColumnAtIndex:(NSNumber *) index forResultSet:(NSString *) resultSetId forConnection:(NSString *) connectionId forTransaction:(NSString *) transactionId callback:(void(^)(NSNumber * /* SQLITE_TYPE */, RTSQLError *)) callback;

- (void)columnAsDoubleForColumnAtIndex:(NSNumber *) index forResultSet:(NSString *) resultSetId forConnection:(NSString *) connectionId forTransaction:(NSString *) transactionId callback:(void(^)(NSNumber * /* double */, RTSQLError *)) callback;

- (void)columnAsIntegerForColumnAtIndex:(NSNumber *) index forResultSet:(NSString *) resultSetId forConnection:(NSString *) connectionId forTransaction:(NSString *) transactionId callback:(void(^)(NSNumber * /* integer */, RTSQLError *)) callback;

- (void)columnAsTextForColumnAtIndex:(NSNumber *) index forResultSet:(NSString *) resultSetId forConnection:(NSString *) connectionId forTransaction:(NSString *) transactionId callback:(void(^)(NSString * /* string */, RTSQLError *)) callback;

- (void)columnAsBase64ForColumnAtIndex:(NSNumber *) index forResultSet:(NSString *) resultSetId forConnection:(NSString *) connectionId forTransaction:(NSString *) transactionId callback:(void(^)(NSString * /* base4 encoded string */, RTSQLError *)) callback;

- (void)finalizePreparedStatementForConnection:(NSString *) connectionId forTransaction:(NSString *) transactionId forQuery:(NSString *) steppedQueryId callback:(void(^)(RTSQLError *))callback;

- (void)stepByRows:(NSUInteger)numberOfRows forResultSet:(NSString *)resultSetId forConnection:(NSString *)connectionId forTransaction:(NSString *)transactionId callback:(void(^)(BOOL, RTQueryResult*, RTSQLError *))callback;

- (void)skipByRows:(NSUInteger)numberOfRows forResultSet:(NSString *)resultSetId forConnection:(NSString *)connectionId forTransaction:(NSString *)transactionId callback:(void(^)(BOOL, RTQueryResult*, RTSQLError *))callback;

@end
