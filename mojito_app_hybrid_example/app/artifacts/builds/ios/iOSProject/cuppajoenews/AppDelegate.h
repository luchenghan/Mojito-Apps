//
//  AppDelegate.h
//  template
//
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import <CocktailsRT/RTAppDelegate.h>
#import <CocktailsRT/RTViewControllerDelegate.h>

@class ViewController;

@interface AppDelegate : RTAppDelegate <UIApplicationDelegate, RTViewControllerDelegate>

@property (strong, nonatomic) UIWindow *window;

@property (strong, nonatomic) ViewController *viewController;

@end
