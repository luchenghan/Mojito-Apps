//
//  RTServiceInterface.h
//  ychromert
//
//  Created by Anand Biligiri on 2/16/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import "RTObject.h"
#import "RTKernel.h"

@class RTCall;
@class RTHandle;
@class RTService;
@class RTIDLValidator;

//
// YChrome Service Public Interface
//
// A service's public interfaces are grouped into a RTServiceInterface objects. The interface object is called by a
// RTHandle instace when a method is invoked on the handle. These methods can be used a factories to generate new
// RTHandle objects for other types of objects implemented by the same class.
//
// The RTServiceInterface base class contains housekeeping logic for tracking outstanding RTHandles of the interface
// type as well as common IDL management routines.
//
@interface RTServiceInterface : RTObject
#pragma mark - Properties

//
// Parent Service
//
@property (nonatomic, retain, readonly) RTService *service;

//
// Interface Description
//
@property (nonatomic, copy, readonly) NSDictionary *IDL;

//
// IDL Validator
//
@property (nonatomic, retain, readonly) RTIDLValidator *IDLValidator;
#pragma mark - Initialization

//
// Initialize w/ Interface ID and Service
//
// IDL is populated by querying the parent service.
//
- (id)initWithID:(NSString *)identifier service:(RTService *)service IDLValidator:(RTIDLValidator *)IDLValidator;

#pragma mark - Calls

// Execute this call.
- (void)invokeCall:(RTCall *)call;

#pragma mark - Handles
- (BOOL)registerHandle:(RTHandle *)handle;
- (BOOL)unregisterHandle:(RTHandle *)handle;
- (RTHandle *)getHandleForContextID:(NSString *)contextID handleID:(NSString *)handleID;

@end
