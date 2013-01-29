//
//  RTURLConnectionHelper.h
//  ychromert
//
//  Created by Daryl Low on 6/19/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//
#import <CocktailsRT/RTURLConnection.h>

@interface RTURLConnectionHelper : RTURLConnection

@property (nonatomic, copy, readonly) void (^success)(RTURLConnection *);
@property (nonatomic, copy, readonly) void (^failure)(RTURLConnection *, NSError *);

@property (nonatomic, assign, readonly) BOOL useCredentialStorage;  // Default is YES
@property (nonatomic, copy, readonly) void (^auth)(RTURLConnection *, NSURLAuthenticationChallenge *);

@property (nonatomic, copy, readonly) NSURLRequest *(^redirect)(RTURLConnection *, NSURLRequest *, NSURLResponse *);
@property (nonatomic, copy, readonly) void (^response)(RTURLConnection *, NSURLResponse *);

@property (nonatomic, copy, readonly) void (^data)(RTURLConnection *, NSData *);

@property (nonatomic, copy, readonly) NSInputStream *(^newBody)(RTURLConnection *, NSURLRequest *);
@property (nonatomic, copy, readonly) void (^bodyPosted)(RTURLConnection *, NSInteger, NSInteger, NSInteger);

@property (nonatomic, copy, readonly) NSCachedURLResponse *(^willCache)(RTURLConnection *, NSCachedURLResponse *); 

@property (nonatomic, retain, readonly) RTObject *object;

@property (nonatomic, retain, readonly) NSURLRequest *request;

@property (nonatomic, assign, readonly) BOOL started;
@property (nonatomic, assign, readonly) BOOL cancelled;

#pragma mark - Helper Registration

//
// Set Connection Listener
//
// Debugging code can listen for created RTURLConnection objects.
//
+ (void)setConnectionListener:(void (^)(RTURLConnectionHelper *))listener;

#pragma mark - Convenience Routines

//
// Simulate HTTP POST Handling
//
- (NSData *)simulatePOSTProcessing;

//
// Simulate HTTP Status
//
// Simulate HTTP response with body. Returns NO if there was a problem during simulation.
//
- (BOOL)simulateHTTPResponse:(NSInteger)status
                     headers:(NSDictionary *)headers
                        body:(NSData *)body;

//
// Simulate Network Error
//
- (BOOL)simulateNetworkError:(NSInteger)code;

@end
