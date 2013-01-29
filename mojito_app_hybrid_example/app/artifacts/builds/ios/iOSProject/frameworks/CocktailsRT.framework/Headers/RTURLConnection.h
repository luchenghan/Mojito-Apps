//
//  RTURLConnection.h
//  ychromert
//
//  Created by Daryl Low on 5/4/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//
#import <Foundation/Foundation.h>

@class RTObject;

@interface RTURLConnection : NSURLConnection <NSURLConnectionDataDelegate>

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

#pragma mark - Factory Methods

//
// Optimized One-Shot Connection
//
// If you need a simple one-shot connection from an RTObject, call this instead of the fancy stuff below.
//
// NOTE: There is no need to split out the success, response, data, failure handlers because the underlying
//       implementation gives you all the parts at the same time and without a pointer to NSURLConnection.
//
+ (void)sendAsynchronousRequest:(NSURLRequest *)request
              completionHandler:(void (^)(NSURLResponse*, NSData*, NSError*))handler;

//
// Simple Initializer
//
+ (id)connectionWithRequest:(NSURLRequest *)request
                    success:(void (^)(RTURLConnection *))success
                       data:(void (^)(RTURLConnection *, NSData *))data
                    failure:(void (^)(RTURLConnection *, NSError *))failure;

//
// Response Initializer
//
+ (id)connectionWithRequest:(NSURLRequest *)request
                    success:(void (^)(RTURLConnection *))success
                   response:(void (^)(RTURLConnection *, NSURLResponse *))response
                       data:(void (^)(RTURLConnection *, NSData *))data
                    failure:(void (^)(RTURLConnection *, NSError *))failure;

//
// Redirect Initializer
//
+ (id)connectionWithRequest:(NSURLRequest *)request
                    success:(void (^)(RTURLConnection *))success
                   redirect:(NSURLRequest *(^)(RTURLConnection *, NSURLRequest *, NSURLResponse *))redirect
                   response:(void (^)(RTURLConnection *, NSURLResponse *))response
                       data:(void (^)(RTURLConnection *, NSData *))data
                    failure:(void (^)(RTURLConnection *, NSError *))failure;

#pragma mark - Initialization

//
// Full Initializer
//
- (id)initWithRequest:(NSURLRequest *)request
              success:(void (^)(RTURLConnection *))success

 useCredentialStorage:(BOOL)useCredentialStorage
                 auth:(void (^)(RTURLConnection *, NSURLAuthenticationChallenge *))auth

             redirect:(NSURLRequest *(^)(RTURLConnection *, NSURLRequest *, NSURLResponse *))redirect
             response:(void (^)(RTURLConnection *, NSURLResponse *))response

                 data:(void (^)(RTURLConnection *, NSData *))data

              newBody:(NSInputStream *(^)(RTURLConnection *, NSURLRequest *))newBody
           bodyPosted:(void (^)(RTURLConnection *, NSInteger, NSInteger, NSInteger))bodyPosted
            willCache:(NSCachedURLResponse *(^)(RTURLConnection *, NSCachedURLResponse *))willCache

              failure:(void (^)(RTURLConnection *, NSError *))failure

     startImmediately:(BOOL)startImmediately;

@end
