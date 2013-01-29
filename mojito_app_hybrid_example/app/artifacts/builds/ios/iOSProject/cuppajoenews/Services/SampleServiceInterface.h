//
//  SampleServiceInterface.h
//  template
//
//  The main interface for the sample service.
//
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import <CocktailsRT/RTServiceInterface.h>


@interface SampleServiceInterface : RTServiceInterface

// Define your IDL's main methods here:

// Echo back this string.
- (void)echo:(NSDictionary *)args call:(RTCall *)call;

@end
