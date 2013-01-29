//
//  RTURLConnectionHelper.m
//  ychromert
//
//  Created by Daryl Low on 6/19/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//
#import <CocktailsRT/RTObject.h>

#import "RTURLConnectionHelper.h"

static void (^RTURLConnectionHelper_AddConnection)(RTURLConnectionHelper *);

@interface RTURLConnectionHelper ()
@property (nonatomic, copy) void (^success)(RTURLConnection *);
@property (nonatomic, copy) void (^failure)(RTURLConnection *, NSError *);

@property (nonatomic, assign) BOOL useCredentialStorage;  // Default is YES
@property (nonatomic, copy) void (^auth)(RTURLConnection *, NSURLAuthenticationChallenge *);

@property (nonatomic, copy) NSURLRequest *(^redirect)(RTURLConnection *, NSURLRequest *, NSURLResponse *);
@property (nonatomic, copy) void (^response)(RTURLConnection *, NSURLResponse *);

@property (nonatomic, copy) void (^data)(RTURLConnection *, NSData *);

@property (nonatomic, copy) NSInputStream *(^newBody)(RTURLConnection *, NSURLRequest *);
@property (nonatomic, copy) void (^bodyPosted)(RTURLConnection *, NSInteger, NSInteger, NSInteger);

@property (nonatomic, copy) NSCachedURLResponse *(^willCache)(RTURLConnection *, NSCachedURLResponse *); 

@property (nonatomic, retain) RTObject *object;

@property (nonatomic, retain) NSURLRequest *request;

@property (nonatomic, assign) BOOL started;
@property (nonatomic, assign) BOOL cancelled;
@end

@implementation RTURLConnectionHelper

@dynamic success;
@dynamic failure;

@dynamic useCredentialStorage;
@dynamic auth;

@dynamic redirect;
@dynamic response;

@dynamic data;

@dynamic newBody;
@dynamic bodyPosted;

@dynamic willCache;

@dynamic object;

@synthesize request = mRequest;

@synthesize started = mStarted;
@synthesize cancelled = mCancelled;

//
// Set Connection Listener
//
// Debugging code can listen for created RTURLConnection objects.
//
+ (void)setConnectionListener:(void (^)(RTURLConnectionHelper *))listener
{
    RTURLConnectionHelper_AddConnection = [listener copy];
}

//
// Add Connection
//
// Inform listeners that 
//
+ (void)addConnections:(RTURLConnectionHelper *)connection
{
    if (RTURLConnectionHelper_AddConnection) {
        RTURLConnectionHelper_AddConnection(connection);
    }
}

#pragma mark - Factory Methods

//
// Optimized One-Shot Connection
//
+ (void)sendAsynchronousRequest:(NSURLRequest *)request
              completionHandler:(void (^)(NSURLResponse*, NSData*, NSError*))handler
{
    __block NSURLResponse *rsp = nil;
    __block NSMutableData *data = nil;
    
    (void)[[[self class] alloc] initWithRequest:request
                                        success:^(RTURLConnection *c) {
                                            if (handler) {
                                                handler(rsp, data, nil);
                                            }
                                        }
                           useCredentialStorage:YES
                                           auth:nil
                                       redirect:nil
                                       response:^(RTURLConnection *c, NSURLResponse *r) {
                                           rsp = r;
                                       }
                                           data:^(RTURLConnection *c, NSData *d) {
                                               if (data == nil) {
                                                   data = [NSMutableData dataWithData:d];
                                               } else {
                                                   [data appendData:d];
                                               }
                                           }
                                        newBody:nil
                                     bodyPosted:nil
                                      willCache:nil
                                        failure:^(RTURLConnection *c, NSError *e) {
                                            if (handler) {
                                                handler(rsp, data, e);
                                            }
                                        }
                               startImmediately:YES];
}

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

     startImmediately:(BOOL)startImmediately
{
    self = [super init];
    if (self) {
        self.request = request;
        
        // Store callbacks before we start
        self.success = success;
        self.failure = failure;
        
        self.useCredentialStorage = useCredentialStorage;
        self.auth = auth;
        
        self.redirect = redirect;
        self.response = response;
        
        self.data = data;
        
        self.newBody = newBody;
        self.bodyPosted = bodyPosted;
        self.willCache = willCache;
        
        // Detect the current RTObject
        RTObject *currentObject = [RTObject currentObject];
        if (currentObject) {
            self.object = currentObject;
        }
        
        if (startImmediately) {
            [self start];
        }
        
        // Add self to the list of connections
        [[self class] addConnections:self];
    }
    
    return self;
}

#pragma mark - NSURLConnection Overrides

//
// Mock Start
//
- (void)start
{
    self.started = YES;
}

//
// Mock Cancel
//
- (void)cancel
{
    self.cancelled = YES;
}

#pragma mark - Convenience Routines

//
// Simulate HTTP POST Handling
//
- (NSData *)simulatePOSTProcessing
{
    // Bail if we haven't started or were cancelled
    if (!self.started || self.cancelled || !self.request.URL) {
        return nil;
    }
    
    // Grab the POST body
    NSData *postBody;
    if (self.request.HTTPBody) {
        postBody = self.request.HTTPBody;
        
    } else if (self.request.HTTPBodyStream) {
        NSMutableData *mutablePostBody = nil;
        
        uint8_t *buf;
        NSUInteger len;
        
        while ([self.request.HTTPBodyStream getBuffer:&buf length:&len]) {
            if (!mutablePostBody) {
                mutablePostBody = [NSMutableData dataWithBytes:buf length:len];
            } else {
                [mutablePostBody appendBytes:buf length:len];
            }
        }
        
        postBody = [mutablePostBody copy];
    }
    
    return postBody;
}

//
// Simulate HTTP Status
//
- (BOOL)simulateHTTPResponse:(NSInteger)status
                     headers:(NSDictionary *)headers
                        body:(NSData *)body
{
    // Bail if we haven't started or were cancelled
    if (!self.started || self.cancelled || !self.request.URL) {
        return NO;
    }
    
    // Simulate empty redirect
    if ([self connection:self willSendRequest:self.request redirectResponse:nil] != self.request) {
        // Not expecting a redirect
        return NO;
    }
    
    // Build an HTTP Response
    NSHTTPURLResponse *response = [[NSHTTPURLResponse alloc] initWithURL:self.request.URL
                                                              statusCode:status
                                                             HTTPVersion:@"1.1"
                                                            headerFields:headers];
    
    // Simulate response
    [self connection:self didReceiveResponse:response];
    
    // Bail if the response causes cancellation
    if (self.cancelled) {
        return YES;
    }
    
    // Simulate body and success
    if (body) {
        [self connection:self didReceiveData:body];
    }
    
    // Bail if the response causes cancellation
    if (self.cancelled) {
        return YES;
    }
    
    [self connectionDidFinishLoading:self];
    self.cancelled = YES;
    return YES;
}

//
// Simulate Network Error
//
- (BOOL)simulateNetworkError:(NSInteger)code
{
    // Bail if we haven't started or were cancelled
    if (!self.started || self.cancelled || !self.request.URL) {
        return NO;
    }
    
    NSError *error = [NSError errorWithDomain:NSURLErrorDomain
                                         code:code
                                     userInfo:nil];
    [self connection:self didFailWithError:error];
    self.cancelled = YES;

    return YES;
}

@end
