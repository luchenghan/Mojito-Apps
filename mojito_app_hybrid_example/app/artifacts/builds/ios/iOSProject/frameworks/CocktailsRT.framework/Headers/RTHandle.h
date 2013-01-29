//
//  RTHandle.h
//  ychromert
//
//  Created by Anand Biligiri on 2/16/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import "RTObject.h"

@class RTServiceInterface;
@class RTCall;
@class RTIDLValidator;
//
// YChrome Object Handle
//
// Represents an active instance of a YChrome object handle. This includes YChrome service singletons. The object handle
// is responsible for tracking ongoing method calls and their callbacks.
//
// Clients can register for broadcast events on each object handle instance.
//
// Object handles can produce other object handles via factory methods.
//
@interface RTHandle : RTObject

#pragma mark - Core Definition

//
// Service Interface
//
// Service interface providing the handle's behavior. Calls to the handle are directed to the interface.
//
@property (nonatomic, assign) RTServiceInterface *interface;

//
// ID of the context this handle belongs to
//
@property (nonatomic, copy, readonly) NSString *contextID;

//
// The concatenated value of contextID and ID
//
@property (nonatomic, copy, readonly) NSString *uniqueID;

#pragma mark - Invoke Calls

//
// Execute this call object.
//
- (void)invokeCall:(RTCall *)call;

#pragma mark - Initialization

//
// Initialize w/ ID, Service Interface and Owner Context
//
- (id)initWithID:(NSString *)identifier interface:(RTServiceInterface *)interface contextID:(NSString *)contextID;

#pragma mark - State Management

- (void)setStateValue:(id)o forStateKey:(NSString *)key;

- (id)stateValueForKey:(NSString *)key;

@end