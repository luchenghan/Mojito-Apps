//
//  RTTestHelper.m
//  ychromert
//
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import "RTTestHelper.h"

@implementation RTTestHelper

+ (void)waitForDispatchGroupToFinish:(dispatch_group_t)d
{
    NSTimeInterval delay_in_seconds = 5.0;
    dispatch_time_t delay = dispatch_time(DISPATCH_TIME_NOW, delay_in_seconds * NSEC_PER_SEC);
    
    
    dispatch_group_wait(d, delay);


    // clean up all refs
    while(dispatch_group_wait(d, DISPATCH_TIME_NOW)) {
         dispatch_group_leave(d);
    }
    
    dispatch_release(d);
}

@end
