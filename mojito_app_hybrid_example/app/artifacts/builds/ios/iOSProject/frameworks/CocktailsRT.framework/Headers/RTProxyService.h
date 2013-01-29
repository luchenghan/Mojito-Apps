//
//  RTProxyService.h
//  ychromert
//
//  Created by Srinivas Raovasudeva on 8/20/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import "RTService.h"

@class RTProxyResponse;
@class RTProxyError;

typedef enum {
    kRTRequestStart=0,
    kRTRequestEnd,
    kRTRequestSuccess,
    kRTRequestFailure,
    kRTRequestComplete
}RTSendRequestResultType;

@interface RTProxyService : RTService

- (void)sendRequest:(NSURLRequest *)request arguments:(NSDictionary *)arguments callback:(void(^)(RTSendRequestResultType, RTProxyResponse*, RTProxyError*))callback;

@end
