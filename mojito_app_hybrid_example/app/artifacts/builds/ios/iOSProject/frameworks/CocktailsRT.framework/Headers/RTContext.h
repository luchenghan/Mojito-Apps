//
//  RTContext.h
//  RThrome2
//
//  Created by Daryl Low on 12/19/11.
//  Copyright (c) 2011 Yahoo Inc. All rights reserved.
//
#import "RTObject.h"
#import "RTKernel.h"
//
// RThrome Execution Context
//
// Execution contexts are sandboxed environments where application code can run. Contexts must use a form of RPC to
// communicate with each other. Subclasses can represent different types of contexts (eg. Native App, Android Activity,
// Web View, iFrame, etc...). They are organized into a strict tree hierarchy with a single parent and multiple
// children. Together, they form a map of all contexts in the system and can be used for security checks and routing
// messages between contexts.
//
// Each context provides methods for standard RPC primitives such as invokeMethod() and subscribeEvent(). When
// applicable subclasses also implement the bridging mechanisms for exchanging RPC messages with their implementation.
// The base class acts as a placeholder for a context running inside a different environement, it's default behavior is
// to pass the request up to its parent.
//
@interface RTContext : RTObject
#pragma mark - RTObject

//
// Unique ID
//
// The unique ID is a cryptographically strong identifier unique for all contexts in the application.
//
//@property (nonatomic, copy, readonly) NSString *ID;

// Domain of this context.
@property (nonatomic, strong, readonly) NSString *domain;

#pragma mark - Context Navigation

//
// Parent Context
//
// The root context will have a nil parent.
//
@property (nonatomic, assign, readonly) RTContext *parent;

//
// Child Contexts
//
@property (nonatomic, retain, readonly) NSDictionary *children;

//
// Lookup Context ID
//
- (RTContext *)lookupContextID:(NSString *)cid;

#pragma mark - Message Passing Primitives

//
// Send Message
//
// Deliver message from one context to another.
//
- (void)sendMessage:(NSDictionary *)message fromContext:(NSString *)fromContextID  toContext:(NSString *)toContextID;

//
// Route the message to the destination context "d".
//
- (void)routeMessage:(NSDictionary *)message;

//
// Bridge the message; subclass responsibility.
//
- (void)bridgeMessage:(NSDictionary *)message;


#pragma mark - Context Operations

//
// Reload contexts (webviews and iframes) due to changes that affect them.
// This call assumes that I have already been handled by my parent context.
//
- (void)reloadAllWebContextsExcept:(NSSet *)exceptContextIDs domain:(NSString*)domain;

//
// Reload items with javascript like web-views and iframes.
//
- (void)reload;

@end
