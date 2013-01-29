//
//  RTLoggingService.h
//  ychromert
//
//  Created by Srinivas Raovasudeva on 2/17/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//
#import "RTLog.h"
#import "RTService.h"

/**
 This is the main logging service.
 It should be registered with all other services and then it will register itself to the kernel as the log service when its setup.
*/
@interface RTLoggingService : RTService <RTLogDelegate>

/**
  Public initializer 
  @param loggers An array of loggers that implement the RTLogger protocol (passing in nil will initialize the logging service with the default loggers - same as calling init)
  @returns Instance of RTLoggingService
  @see RTLoggingService#DefaultLoggers
 */
- (id)initWithLoggers:(NSArray *)loggers;

@end
