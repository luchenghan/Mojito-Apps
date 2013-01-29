//
//  RTOperationQueue.h
//  ychromert
//
//  Created by Daryl Low on 5/8/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//
#import <Foundation/Foundation.h>

//
// RTOperationQueue
//
// Several iOS asynchronous APIs take an NSOperationQueue instead of a plain dispatch_queue_t. For these APIs to work
// efficiently, we should use an NSOperationQueue that executes NSOperations against the RTObject's queue.
//
// This NSOperationQueue subclass will execute all NSOperations against the owner RTObject. Consider this a "friend"
// class of RTObject. Do not instantiate this object in your own code!
//
// For performance reasons, this subclass does not fully support all of the NSOperationQueue APIs such as listing /
// counting queued operations, etc....
//
@interface RTOperationQueue : NSOperationQueue

//
// Initialize w/ Owner
//
// Run all operations on the RTObject's dispatch queue.
//
- (id)initWithOwner:(RTObject *)owner;

@end
