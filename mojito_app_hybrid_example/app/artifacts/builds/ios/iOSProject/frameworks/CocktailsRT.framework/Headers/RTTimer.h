//
//  RTTimer.h
//  ychromert
//
//  Created by Aishvarya Pedgaonkar on 3/2/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RTObject.h"

@class RTObject;


@interface RTTimer : NSObject

//
// Sets the cancellation handler block
//
@property (nonatomic, copy) void (^cancelBlock)(void);

//
// Sets the event handler block
// We need a non-null block when calling
// dispatch_source_set_event_handler
//
@property (nonatomic, copy) void (^eventBlock)(void);

//
// Sets the registration handler block
//
@property (nonatomic, copy) void (^registrationBlock)(void);

// If you want retained userInfo with your timer.
@property (nonatomic, strong) id userInfo;

@property (nonatomic, readonly) BOOL isCancelled;


//
// Initialize w/ Timeout (milliseconds), Callback and RTObject Owner
//
//
- (id) initTimerWithTimeout:(uint64_t) timeout
                 eventBlock:(void (^)()) eventBlock
                   forOwner:(RTObject *) owner;

- (void) cancelTimer;

// You need to call this when eventBlock is called to stop the timer from repeating if you don't want it to.
- (void) suspendTimer;

// Resume the timer (need to call this after you create it to start it up).
- (void) resumeTimer;

@end
