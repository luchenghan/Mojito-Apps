//
//  RTDispatchHelper.h
//  ychromert
//
//  Created by Anand Subba Rao on 4/11/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

@class RTObject;
@class OCMockObject;

/* This class models the functionality of RTObject syncBlock and asyncBlock functions. This is slightly different than pure GCD is that
 a syncBlock can be executed out-of-order. For example, if there are 3 async blocks on the queue
 [Async1 , Async2 , Async3]
 and Async2 is a block that schedules a Sync block , then the order of invocation would be
 Async1
 Async2 (part before Sync)
 Sync
 Async2 (part after Sync)
 Async3
 
 pure GCD would dead-lock
 This is intentional and same as in RTObject
 */

@interface RTDispatchHelper : NSObject
/* The number of blocks there were scheduled to run asynchronously. Note that synchronous blocks are not counted for now */
@property (nonatomic, readonly) NSInteger blockCount;

/* The current simulated time */
@property (nonatomic, readonly) uint64_t now;

/* Convenience method to create a dispatch helper if your test is not using a partial mock */
+ (id)dispatchHelperWithObject:(RTObject *)object;

/* Convenience method to create a dispatch helper if your test needs a partial mock 
 Note : Use this if your test already has a partial mock. 2 partial mocks on the same object do not work. The first one created
 wins */
+ (id)dispatchHelperWithPartialMockOfObject:(OCMockObject *)partialMockOfObject;

+ (BOOL)startMultiple:(NSArray *)helpers;
+ (BOOL)startMultiple:(NSArray *)helpers after:(uint64_t)time;
+ (BOOL)startMultiple:(NSArray *)helpers withBlock:(void (^)())block;
+ (BOOL)startMultiple:(NSArray *)helpers withBlock:(void (^)())block after:(uint64_t)time;

/* This method invokes the startBlock and then invokes all the blocks generated as a result. Note that the block themselves
 can schedule more blocks. The function will return only where there are no more blocks left. Use this method to start if you expect
 blocks to run synchronously 
 
 Returns YES if any blocks were invoked and all of them are done
 */
- (BOOL)startWithBlock:(void(^)())startBlock;

/* This method increments simulated time and invokes all the blocks that would have been scheduled. Note that the block themselves
 can schedule more blocks. The function will return only where there are no more blocks left. This can be used only when all blocks
 are scheduled to be run asynchronously 
 
  Returns YES if any blocks were invoked and all of them are done
 */
- (BOOL)startAfter:(uint64_t)time;

/* This method invokes all the blocks that have been scheduled so far. Note that the block themselves
 can schedule more blocks. The function will return only where there are no more blocks left. This can be used only when all blocks
 are scheduled to be run asynchronously 
 
 Returns YES if any blocks were invoked and all of them are done
 */
- (BOOL)start;
@end
