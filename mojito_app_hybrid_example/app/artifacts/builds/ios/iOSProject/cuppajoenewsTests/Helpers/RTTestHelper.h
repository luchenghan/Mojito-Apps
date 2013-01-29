//
//  RTTestHelper.h
//  ychromert
//
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface RTTestHelper : NSObject

// use iff you are doing manual dispatch_group_enter and dispatch_group_leave
+ (void)waitForDispatchGroupToFinish:(dispatch_group_t)d;
@end
