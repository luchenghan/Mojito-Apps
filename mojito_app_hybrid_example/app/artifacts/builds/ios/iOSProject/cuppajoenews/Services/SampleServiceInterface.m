//
//  SampleServiceInterface.m
//  template
//
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import "SampleServiceInterface.h"
#import <CocktailsRT/RTCall.h>


@implementation SampleServiceInterface

// Echo back this string.
- (void)echo:(NSDictionary *)args call:(RTCall *)call
{   // The IDL should ensure that we have item send which is required.
    NSString* sentItem = [args objectForKey:@"send"];
    
    // If this were a complex call it would talk to the service at this point.
    // This simple one can just echo back.
    [call invokeCallback:kRTCallSuccessCallbackKey
                    args:[NSDictionary dictionaryWithObject:sentItem forKey:@"reply"] error:nil];
}

@end
