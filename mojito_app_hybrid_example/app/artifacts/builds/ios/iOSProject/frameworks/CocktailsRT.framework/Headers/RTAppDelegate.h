//
//  RTAppDelegate.h
//  ychromert
//
//  Created by Anand Biligiri on 2/16/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "RTLog.h"

@class RTLogManager;
@class RTKeyValueStoreProvider;
@class RTWebViewContext;
@class RTWebView;

@interface RTAppDelegate : UIResponder <UIApplicationDelegate, RTLogComponent>

@property (nonatomic, strong, readonly) id <RTLog> logger;
@property (nonatomic, strong, readonly) RTLogManager *logManager;
@property (nonatomic, strong, readonly) RTKeyValueStoreProvider *keyValueStoreProvider;

// Path to the built-in application package.
@property (nonatomic, strong, readonly) NSString *applicationPackagePath;

// A writable directory that will be used for key-value store that have values other than default.
@property (nonatomic, strong, readonly) NSString *customKeyValueStorePath;

#pragma mark - Web View Context
- (RTWebViewContext *)createWebViewContextWithWebView:(RTWebView *)webView;
- (void)destroyWebViewContext:(RTWebViewContext *)context;

#pragma mark - Lifecycle

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
// You should override this method and be sure to FIRST call super THEN register your services.
// At the end of your method call [self applicationPostLaunchStateTransition];

// Call this at the end of application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions in your subclass.
- (void)applicationPostLaunchStateTransition;

#pragma mark - Service registration
- (BOOL)registerServices:(NSArray *)services;

#pragma mark - Native to Service Calling

//
// Get Service's Main Handle
//
- (id)mainHandleForService:(NSString *)serviceID;

//
// Instantiate New Service Sub-Interface Handle
//
- (id)createHandleForService:(NSString *)serviceID
                   interface:(NSString *)interface
                        args:(NSDictionary *)arguments
                   callbacks:(NSDictionary *)callbacks;

#pragma mark - Service Availability

//
// Get available services
//
- (void)checkAvailableServices:(NSArray *)filterBy 
                      callback:(void(^)(NSDictionary *))callback;

@end
