//
//  RTHandleCreator.h
//  ychromert
//
//  Created by Anand Subba Rao on 3/9/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

@class RTHandle;
@class RTServiceInterface;

@interface RTHandleCreator : NSObject
- (RTHandle *)createWithID:(NSString *)ID serviceInterface:(RTServiceInterface *)serviceInterface contextID:(NSString *)contextID;
@end
