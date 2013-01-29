//
//  RTServiceInterfaceCreator.h
//  ychromert
//
//  Created by Anand Subba Rao on 3/8/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

@class RTIDLValidator;
@class RTService;
@class RTServiceInterface;
@class RTService;
@protocol RTServiceInterfaceCreator <NSObject>
//The withInterfaceDefaultClass: parameter is only a *hint* about the class the caller expects to be created. Subclasses can ignore this and return a different class.
- (RTServiceInterface *)createServiceInterface:(NSString *)interfaceName forService:(RTService *)service withDefaultInterfaceClass:(Class)class;
@end

@interface RTServiceInterfaceCreator : NSObject <RTServiceInterfaceCreator>

@property (nonatomic, retain, readonly) RTIDLValidator *IDLValidator;

- (id)initWithIDLValidator:(RTIDLValidator *)validator;

@end
