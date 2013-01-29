//
//  AppDelegate.m
//  template
//
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import "AppDelegate.h"

#import "ViewController.h"

#import <CocktailsRT/CocktailsRT.h>
#import <CocktailsRT/RTAccelerometerService.h>
#import <CocktailsRT/RTCameraService.h>
#import <CocktailsRT/RTCompassService.h>
#import <CocktailsRT/RTConnectionMonitorService.h>
#import <CocktailsRT/RTDummyService.h>
#import <CocktailsRT/RTGeoService.h>
#import <CocktailsRT/RTLocationManager.h>
#import <CocktailsRT/RTLoggingService.h>
#import <CocktailsRT/RTNotificationService.h>
#import <CocktailsRT/RTPackageService.h>
#import <CocktailsRT/RTSQLiteService.h>
#import <CocktailsRT/RTTestService.h>
#import <CocktailsRT/RTWebViewContext.h>
#import <CocktailsRT/RTLoggingServiceLogger.h>
#import <CocktailsRT/RTLog.h>
#import <CocktailsRT/RTProxyService.h>

#import <CoreMotion/CoreMotion.h>

// Your custom services
#import "SampleService.h"


// [Srinivas 03/19/2012] HACK: Remove this once we properly expose setSeverity:forComponent in RTAppDelegate
// The proper fix will be part of Daryl's changes for exposing a generic logger object
@interface RTAppDelegate (Expose)
@property (nonatomic, readonly) RTKernel *kernel;
@end

#define USE_SIMPLE_LOGGER 0
#if USE_SIMPLE_LOGGER
#import <CocktailsRT/RTLoggingServiceLogger.h>
@interface SimpleLogger : NSObject<RTLoggingServiceLogger>

- (void)log:(NSString *)component severity:(NSString *)severity timeStamp:(NSDate *)timeStamp message:(NSString *)message;

@end

@implementation SimpleLogger

- (void)log:(NSString *)component severity:(NSString *)severity timeStamp:(NSDate *)timeStamp message:(NSString *)message
{    
    NSLog(@"%@ %@", component, message);
}

@end
#endif


@implementation AppDelegate

@synthesize window = _window;
@synthesize viewController = _viewController;

#pragma mark - Configuration Paths

- (NSString*)applicationPackagePath
{   // Where is the built-in application package for this App?
    NSString* appPath = [[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"packages/yahoo.application.cuppajoenews"];
    return appPath;
}

#pragma mark - Startup

- (RTWebViewContext *)createWebViewContextWithWebView:(RTWebView *)webView
{   // This is called when a web view context is created. This lets you modify the log level on it.
    RTWebViewContext *webViewContext = [super createWebViewContextWithWebView:webView];
#if DEBUG
    // Uncomment to trace messages crossing the bridge.
    //[self.kernel.logger setSeverity:kRTLogSeverityTrace forComponent:webViewContext];
#endif
    return webViewContext;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{   // Setup YChrome App by first calling super.
    [super application:application didFinishLaunchingWithOptions:launchOptions];

    //Create services you want in your app
    CMMotionManager *coreMotionManager = [[CMMotionManager alloc] init];
    RTLocationManager *locationManager = [[RTLocationManager alloc] init];
    RTAccelerometerService *accelService = [[RTAccelerometerService alloc] initWithCoreMotionManager:coreMotionManager];
    RTCameraService *cameraService = [[RTCameraService alloc] initWithViewControllerDelegate:self];
    RTCompassService *compassService = [[RTCompassService alloc] initWithLocationManager:locationManager];
    RTConnectionMonitorService *connectionMonitorService = [[RTConnectionMonitorService alloc]
                                                                initWithURL:[NSURL URLWithString:@"http://www.yahoo.com"]];
    RTDummyService *dummyService = [[RTDummyService alloc] init];
    RTGeoService *geoService = [[RTGeoService alloc] initWithLocationManager:locationManager];
    RTLoggingService *loggingService = [[RTLoggingService alloc] init];
    
    RTNotificationService *notificationService = [[RTNotificationService alloc] init];
    RTPackageService *packageService = [[RTPackageService alloc] init];
    RTSQLiteService *sqliteService = [[RTSQLiteService alloc] init];
	RTProxyService *proxyService = [[RTProxyService alloc] init];
	
    // Add your plugin services.
    SampleService *sampleService = [[SampleService alloc] init];
    
    // The Test services should not be available on Distribution builds.
#ifndef DISTRIBUTION
    RTTestService *testService = [[RTTestService alloc] init];
#endif
    
    // Make sure we created the sample service since its used as a template for programmers.
    if (!sampleService) {
        RTLog(kRTLogSeverityFatal, @"FAILED to create the SampleService. Fix me aborting.");
        exit(1);
    }
    
    // Setup application and kernel log levels before we register.
#if DEBUG
    [self.kernel.logger setSeverity:kRTLogSeverityDebug forComponent:self];
    [self.kernel.logger setSeverity:kRTLogSeverityDebug forComponent:self.kernel];
#else
    [self.kernel.logger setSeverity:kRTLogSeverityWarning forComponent:self];
    [self.kernel.logger setSeverity:kRTLogSeverityWarning forComponent:self.kernel];
#endif
    
    // Register services
    [self registerServices:[NSArray arrayWithObjects:
                            accelService,
                            cameraService,
                            compassService,
                            connectionMonitorService,
                            dummyService,
                            geoService,
                            loggingService,
                            notificationService,
                            packageService,
                            sampleService,
                            sqliteService,
							proxyService,
#ifndef DISTRIBUTION
                            testService,
#endif
                            nil]];
        
    // Setup log levels for the services you registered (they are usually at level kRTLogSeverityError otherwise).
#if DEBUG
    [self.kernel.logger setSeverity:kRTLogSeverityDebug forComponent:accelService];
    [self.kernel.logger setSeverity:kRTLogSeverityDebug forComponent:cameraService];
    [self.kernel.logger setSeverity:kRTLogSeverityDebug forComponent:compassService];
    [self.kernel.logger setSeverity:kRTLogSeverityDebug forComponent:connectionMonitorService];
    [self.kernel.logger setSeverity:kRTLogSeverityDebug forComponent:geoService];
    [self.kernel.logger setSeverity:kRTLogSeverityDebug forComponent:packageService];
    [self.kernel.logger setSeverity:kRTLogSeverityDebug forComponent:proxyService];
#endif
    
    // Setup the UI
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    // Override point for customization after application launch.
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPhone) {
        self.viewController = [[ViewController alloc] initWithNibName:@"ViewController_iPhone" bundle:nil];
    } else {
        self.viewController = [[ViewController alloc] initWithNibName:@"ViewController_iPad" bundle:nil];
    }
    self.window.rootViewController = self.viewController;
    [self.window makeKeyAndVisible];
    
    // Last call this to start first state transition.
    [self applicationPostLaunchStateTransition];
    
    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application
{   // Call super to change states properly for the kernel and services.
    [super applicationWillResignActive:application];
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{   // Call super to change states properly for the kernel and services.
    [super applicationDidEnterBackground:application];
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{   // Call super to change states properly for the kernel and services.
    [super applicationWillEnterForeground:application];
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{   // Call super to change states properly for the kernel and services.
    [super applicationDidBecomeActive:application];
}

- (void)applicationWillTerminate:(UIApplication *)application
{   // Call super to change states properly for the kernel and services.
    [super applicationWillTerminate:application];
}

#pragma mark RTViewControllerDelegate

- (UIViewController *)rootViewController
{   // The top-most view controller for our application.
    return [self.window rootViewController];
}

@end
