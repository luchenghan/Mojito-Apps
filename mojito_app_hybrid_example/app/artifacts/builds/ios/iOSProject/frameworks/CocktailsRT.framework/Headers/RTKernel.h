//
//  RTKernel.h
//  ychromert
//
//  Created by Rongrong Zhong on 2/15/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import "RTObject.h"
#import "RTCall.h"

@class RTService;
@class RTHandle;
@class RTCall;
@class RTError;
@class RTKeyValueStore;
@class RTKeyValueStoreProvider;
@class RTLogManager;

@protocol RTURLProtocolHandler;
@protocol RTURLProtocolRegistrar;

//
// NOTE: Don't change the order!
//
typedef enum {
    kRTStateUnregistered = 0,   // Kernel has no registered services, Service hasn't been registered.
    kRTStateRegistered,         // Kernel has registered services, Service has been registered.
    kRTStateSetup,              // Kernel has some services in the setup state. Service is doing heavy init.
    kRTStateFocused,            // User has full control of the interface.
    kRTStateUnfocused,          // User has lost control of the interface (or has entered unfocused from setup).
    kRTStateSuspended,          // Application will background. Snapshot will be taken so fix up UI and pause/purge uneeded things.
} RTState;

@interface RTKernel : RTObject

// This gives the app_config.json for this application (application snapshot info, service config overrides).
@property (nonatomic, strong) NSDictionary* appConfig;

#pragma mark - Log Manager
@property (nonatomic, readonly, retain) RTLogManager *logManager;

#pragma mark - Services
@property (nonatomic, readonly, retain) NSDictionary *services;

- (id)initWithID:(NSString *)ID
urlProtocolClass:(Class<RTURLProtocolRegistrar>)urlProtocolClass
keyValueProvider:(RTKeyValueStoreProvider *)provider
      logManager:(RTLogManager *)logManager;

#pragma mark - Life Cycle
@property (nonatomic, assign) RTState currentState;
//
// Set Target Kernel State
//
// Set the state we would "like" the kernel to transition to, knowing that it may take some time to catch-up. If we've
// been asked to suspend, we should use -[beginBackgroundTaskWithExpirationHandler:] to make time for services to catch
// up.
//
// Not sure if we can leave the focused state in such an asynchronous manner because there isn't an API to "not take a
// snapshot right now" like -[beginBackgroundTaskWithExpirationHandler:]. If everybody is already in the resmued state,
// we can synchronously transition to the focused state. If everybody is in the focused state, we can synchronously
// transition to the resumed state. Another other state and we will just update targetState and return -- snapshots be
// damned!
//
@property (nonatomic, assign) RTState targetState;

#pragma mark - Version Management

@property (nonatomic, copy, readonly) NSString *currentAppVersion;
@property (nonatomic, copy, readonly) NSString *previousAppVersion;

@property (nonatomic, readonly) BOOL isFirstLaunch;
@property (nonatomic, readonly) BOOL wasUpdated;
@property (nonatomic, readonly) BOOL hadCrashed;

@property (atomic, assign) RTLogSeverity defaultSeverity;

// Wait for the current state to reach waitForState. If currentState is not waitForState the calling thread will be blocked until it is.
//
- (void)waitForCurrentState:(RTState)waitForState;

#pragma mark - Key Value Store

// Makes a key-value store for your use and return it in the completion block. Use a namespace like ychromert_package_config.
- (void)createKeyValueStore:(NSString *)storeNamespace completion:(void (^)(RTKeyValueStore *))storeCompletion;

// Same as the above API but takes a dispatch group. This is useful in the service setup stage
- (void)createKeyValueStore:(NSString *)storeNamespace group:(dispatch_group_t)group completion:(void (^)(RTKeyValueStore *))storeCompletion;
@end

#pragma mark - Service
@interface RTKernel (Service)
//
// Batch Register Services
//
// NOTE: Can only be done once (for now....).
//
- (BOOL)registerServices:(NSArray *)services;
- (void)availableServices:(NSArray *)filterBy callback:(void(^)(NSDictionary *))callback;

@end

// RTKernel (RPC) category implements the methods that handles the RPC calls defined on twiki:
// http://twiki.corp.yahoo.com/view/Cocktails/JSNativeBridgeIPC
@interface RTKernel (RPC)
//
// create and register a service handle
//
- (void)createHandleForService:(NSString *)serviceID 
                     interface:(NSString *)interface
                       context:(NSString *)contextID
                    invocation:(NSString *)invokeID
                  withHandleID:(NSString *)handleID
                          args:(NSDictionary *)arguments
                 callbackNames:(NSSet *)callbackNames
                 callbackBlock:(RTCallCallbackBlock)nativeContextCallbackBlock;

//
// Destroy a service handle
//
- (void) destroyHandleWithID:(NSString *)handleID
               withinContext:(NSString *)contextID
                  invocation:(NSString *)invokeID
               callbackNames:(NSSet *)callbackNames
               callbackBlock:(RTCallCallbackBlock)nativeContextCallbackBlock;

// Invoke this call on the proper service.
- (void)invokeCall:(RTCall *)call;

- (void)cancelMethod:(NSString *)invokeID
           inContext:(NSString *)contextID
       callbackBlock:(void(^)(NSString *, NSDictionary *))nativeContextCallbackBlock;
@end

#pragma mark - Other
@interface RTKernel (RPC_Native)

// Create a handle object for a service interface that can later be used in native service to service calls.
- (id)createHandleForService:(NSString *)serviceID interface:(NSString *)interface args:(NSDictionary *)arguments callbacks:(NSDictionary *)callbacks;

@end

@interface RTKernel (Protocol)
- (void)registerURLProtocolHandler:(id<RTURLProtocolHandler>)urlProtocolHandler
                          forToken:(NSString *)token
                           success:(void (^)())successBlock
                             error:(void (^)(RTError *))errorBlock;

@end
