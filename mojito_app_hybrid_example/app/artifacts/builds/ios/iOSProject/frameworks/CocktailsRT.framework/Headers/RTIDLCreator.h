//
//  RTIDLCreator.h
//  ychromert
//
//  Created by Srinivas Raovasudeva on 3/13/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

@class RTError;

@interface RTIDLCreator : NSObject

- (NSDictionary *)createIDLWithString:(NSString *)idlString;
- (NSDictionary *)createIDLWithString:(NSString *)idlString error:(RTError **)error;

@end
