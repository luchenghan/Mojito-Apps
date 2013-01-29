//
//  RTFrameworkError.h
//  ychromert
//
//  Created by Anand Subba Rao on 4/24/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import "RTError.h"

extern NSString * const kRTFrameworkErrorDomain;

@interface RTFrameworkError : RTError
typedef enum {
    kRTErrorCodeInvalidArgument = 1,
    kRTErrorCodeDuplicate = 2,
    kRTErrorCodeServiceNotExist = 3,
    kRTErrorCodeEmptyIDLString = 4,
    kRTErrorCodeInvalidIDLString = 5,
    kRTErrorCodeMethodNotExist = 6,
    kRTErrorCodeHandleCreationFailed = 7,
    kRTErrorCodeHandleDestroyed = 8,
    kRTErrorCodeHandleNotExist = 9,
    kRTErrorCodeCancelMethodFailed = 10,
    kRTErrorCodeMethodCanceled = 11
} RTFrameworkErrorCode;

@end
