//
//  RTDispatchHelper.m
//  ychromert
//
//  Created by Anand Subba Rao on 4/11/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//
#import <OCMock/OCMock.h>
#import "OCMockRecorder+PrimitiveValues.h"

#import "RTDispatchHelper.h"
#import <CocktailsRT/RTObject.h>
#import <CocktailsRT/RTTimer.h>

static NSString *kRTObjectLastOwnedObject = @"kRTObjectLastOwnedObject";

typedef enum {
    kRTDispatchBlockSync,
    kRTDispatchBlockAsync,
}RTDispatchBlockType;

typedef enum {
    kRTDispatchStateNone,
    kRTDispatchStateRunning,
}RTDispatchState;

typedef enum {
    kRTDispatchTimerStateInactive = 0,
    kRTDispatchTimerStateActive,
    kRTDispatchTimerStateCancelled
}RTDispatchTimerState;

@interface RTDispatchGroup : NSObject
@property (nonatomic, copy) NSString *name;
@property (nonatomic, assign) int count;
@property (nonatomic, copy) void (^notifyBlock)();  // Called when count == 0

+ (RTDispatchGroup *)groupWithName:(NSString *)name;

- (void)increment;
- (void)decrement;
@end

@interface RTDispatchBlock : NSObject
@property (nonatomic, copy) void(^block)();
@property (nonatomic, assign) RTDispatchBlockType blockType;
@property (nonatomic, strong) RTDispatchGroup *group;

+ (id)asyncDispatchBlockWithBlock:(void(^)())block;
+ (id)asyncDispatchBlockWithBlock:(void(^)())block onGroup:(RTDispatchGroup *)group;
+ (id)syncDispatchBlockWithBlock:(void(^)())block;
@end

@interface RTDispatchTimer : NSObject
@property (nonatomic, copy) void(^block)();
@property (nonatomic, assign) uint64_t timeout;
@property (nonatomic, assign) RTDispatchTimerState state;
@property (nonatomic, assign) id mock;
@end

@interface RTDispatchMockTimer : NSObject
@property (nonatomic, strong) id mock;

+ (RTDispatchMockTimer *)mockTimerWithMock:(id)mock;
@end

@interface RTDispatchHelper()
@property (nonatomic, strong) NSMutableArray *blocks;
@property (nonatomic, assign) RTDispatchState state;
@property (nonatomic, strong) OCMockObject *partialMock;
@property (nonatomic, assign) NSInteger syncBlocksInvoked;

@property (nonatomic, strong) NSMutableDictionary *groups;

@property (nonatomic, assign) uint64_t now;
@property (nonatomic, strong) NSMutableSet *timers;
@property (nonatomic, strong) NSMutableSet *timerMocks;

- (void)handleAsyncBlock:(void(^)())block;
- (void)handleAsyncBlock:(void(^)())block onGroup:(NSString *)group;
- (void)handleSyncBlock:(void(^)())block;
- (void)dispatchBlocks;
- (id)initWithPartialMockOfObject:(OCMockObject *)partialMockOfObject;

- (void)handleNotify:(void (^)())notifyBlock onGroup:(NSString *)group;

- (id)handleTimerBlock:(void (^)())block
           withTimeout:(uint64_t)timeout;
@end

@implementation RTDispatchHelper
@synthesize blocks = mBlocks;
@synthesize partialMock = mPartialMock;
@synthesize state = mState;
@synthesize syncBlocksInvoked = mSyncBlocksInvoked;

@synthesize groups = mGroups;

@synthesize now = mNow;
@synthesize timers = mTimers;
@synthesize timerMocks = mTimerMocks;

@dynamic blockCount;

+ (id)dispatchHelperWithObject:(RTObject *)object
{
    NSParameterAssert(object != nil);
    
    NSString *originalClass = NSStringFromClass([object class]);
    if (![object.componentName isEqualToString:originalClass]) {
        // componentName was something other than the class, don't try to patch it
        originalClass = nil;
    }
    
    id mock = [OCMockObject partialMockForObject:object];
    
    // If the partial mock mangled the component name, patch it back to the pure class name
    if (originalClass) {
        [[[mock stub] andReturn:originalClass] componentName];
    }
    
    return [self dispatchHelperWithPartialMockOfObject:mock];
}

+ (id)dispatchHelperWithPartialMockOfObject:(OCMockObject *)partialMockOfObject
{
    NSParameterAssert(partialMockOfObject != nil);
    return [[self alloc] initWithPartialMockOfObject:partialMockOfObject];
}

- (id)initWithPartialMockOfObject:(OCMockObject *)partialMockOfObject
{
    self = [super init];
    if (self) {
        self.blocks = [NSMutableArray array];
        self.state = kRTDispatchStateNone;
        self.partialMock = partialMockOfObject;
        self.syncBlocksInvoked = 0;
        
        self.timers = [NSMutableSet set];
        self.timerMocks = [NSMutableSet set];
        
        [[[mPartialMock stub] andDo:^(NSInvocation *invocation) {
            void *block = nil;
            [invocation getArgument:&block atIndex:2];
            [self handleAsyncBlock:(__bridge void(^)())block];
        }] asyncBlock:OCMOCK_ANY];
        
        [[[mPartialMock stub] andDo:^(NSInvocation *invocation) {
            void *block = nil;
            [invocation getArgument:&block atIndex:2];
            [self handleAsyncBlock:(__bridge void(^)())block];
        }] asyncBlock:OCMOCK_ANY fast:YES];

        [[[mPartialMock stub] andDo:^(NSInvocation *invocation) {
            void *block = nil;
            [invocation getArgument:&block atIndex:2];
            [self handleAsyncBlock:(__bridge void(^)())block];
        }] asyncBlock:OCMOCK_ANY fast:NO];

        [[[mPartialMock stub] andDo:^(NSInvocation *invocation) {
            void *block = nil;
            void *group = nil;
            [invocation getArgument:&block atIndex:2];
            [invocation getArgument:&group atIndex:3];
            
            [self handleAsyncBlock:(__bridge void(^)())block onGroup:[NSString stringWithFormat:@"%p", group]];
        }] asyncBlock:OCMOCK_ANY onGroup:[OCMArg anyPointer]];
        
        [[[mPartialMock stub] andDo:^(NSInvocation *invocation) {
            void *block = nil;
            [invocation getArgument:&block atIndex:2];
            [self handleSyncBlock:(__bridge void(^)())block];
        }] syncBlock:OCMOCK_ANY];

        [[[mPartialMock stub] andDo:^(NSInvocation *invocation) {
            void *block = nil;
            [invocation getArgument:&block atIndex:2];
            [self handleAsyncBlock:(__bridge void(^)())block];
        }] mainBlock:OCMOCK_ANY];

        [[[mPartialMock stub] andDo:^(NSInvocation *invocation) {
            void *block = nil;
            void *group = nil;
            [invocation getArgument:&block atIndex:2];
            [invocation getArgument:&group atIndex:3];

            [self handleNotify:(__bridge void(^)())block onGroup:[NSString stringWithFormat:@"%p", group]];
        }] groupNotify:OCMOCK_ANY onGroup:[OCMArg anyPointer]];
        
        [[[mPartialMock stub] andDo:^(NSInvocation *invocation) {
            void *block = nil;
            uint64_t timeout;
            [invocation getArgument:&timeout atIndex:2];
            [invocation getArgument:&block   atIndex:3];

            id mock = [self handleTimerBlock:(__bridge void(^)())block
                                 withTimeout:timeout];
            [invocation setReturnValue:&mock];
        }] mockSelector:@selector(newTimerWithTimeout:eventBlock:), OCMOCK_ANY, OCMOCK_ANY];
    }
    
    return self;
}

- (BOOL)startWithBlock:(void(^)())startBlock
{
    self.syncBlocksInvoked = 0;
    self.state = kRTDispatchStateRunning;
    
    /* Invoke the block provided. This may schedule some async blocks or invoke sync blocks inline */
    if (startBlock) {
        startBlock();
    }

    /* Invoke any async blocks schduled */
    return [self start];
}

- (BOOL)startAfter:(uint64_t)time
{
    self.now += time;
    
    NSMutableSet *deadTimers = [NSMutableSet set];
    
    for (RTDispatchTimer *timer in self.timers) {
        if (timer.timeout <= self.now) {
            [self handleAsyncBlock:timer.block];
            [deadTimers addObject:timer];
            
            // Release mock object
            [self.timerMocks removeObject:timer.mock];
        }
    }
    
    /* Clean-up fired timers */
    [self.timers minusSet:deadTimers];
    
    /* Invoke any async blocks schduled */
    return [self start];
}

- (BOOL)start
{
    self.state = kRTDispatchStateRunning;
    BOOL didInvokeBlocks = NO;
    
    while ([self blockCount]) {
        didInvokeBlocks = YES;
        [self dispatchBlocks];
    }
    
    self.state = kRTDispatchStateNone;

    // We need to reset syncBlocksInvoked in case the start method is called repeatedly.
    BOOL hadSync = self.syncBlocksInvoked != 0;
    self.syncBlocksInvoked = 0;
    return (didInvokeBlocks || hadSync);
}

+ (BOOL)startMultiple:(NSArray *)helpers
{
    return [self startMultiple:helpers withBlock:nil after:0];
}

+ (BOOL)startMultiple:(NSArray *)helpers after:(uint64_t)time
{
    return [self startMultiple:helpers withBlock:nil after:time];
}

+ (BOOL)startMultiple:(NSArray *)helpers withBlock:(void (^)())block
{
    return [self startMultiple:helpers withBlock:block after:0];
}

+ (BOOL)startMultiple:(NSArray *)helpers withBlock:(void (^)())block after:(uint64_t)time
{
    // First pass update the state
    for (RTDispatchHelper *helper in helpers) {
        helper.state = kRTDispatchStateRunning;
    }
    
    // Second pass run the block
    if (block) {
        block();
    }
    
    // Third pass update the time
    for (RTDispatchHelper *helper in helpers) {
        helper.now += time;
    }
    
    // Process blocks until nothing left to run
    BOOL didInvokeBlocks;
    BOOL busy;
    do {
        busy = NO;
        for (RTDispatchHelper *helper in helpers) {
            if ([helper blockCount]) {
                busy = YES;
                [helper dispatchBlocks];
            }
            busy |= (helper.syncBlocksInvoked != 0);
            helper.syncBlocksInvoked = 0;
        }
        
        didInvokeBlocks |= busy;
    } while (busy);
    
    // Fifth pass reset state
    for (RTDispatchHelper *helper in helpers) {
        helper.state = kRTDispatchStateNone;
    }

    return didInvokeBlocks;
}

- (void)handleSyncBlock:(void (^)())block
{
    // This check is too agressive especially if you have more than one dispatch helper running.
#if 0
    if (self.state != kRTDispatchStateRunning)
        [NSException raise:@"RTDispatchHelperUnexpectedSyncBlock"
                     format:@"Sync blocks received while not running, Maybe you want to use startWithBlock: instead"];
#endif
    [self dispatchBlocks];
    
    // Special mojo for [RTObject currentObject] support
    NSThread *currentThread = [NSThread currentThread];
    RTObject *lastOwnedObject = [currentThread.threadDictionary objectForKey:kRTObjectLastOwnedObject];
    
    // Just so the pointers are the same, use OCPartialMockObject's "realObject"
    id pMock = self.partialMock;
    [currentThread.threadDictionary setObject:[pMock performSelector:@selector(realObject)] forKey:kRTObjectLastOwnedObject];
    @try {
        block();
    }
    @finally {
        // Pop last owned object
        if (lastOwnedObject) {
            [currentThread.threadDictionary setObject:lastOwnedObject forKey:kRTObjectLastOwnedObject];
        } else {
            [currentThread.threadDictionary removeObjectForKey:kRTObjectLastOwnedObject];
        }
    }

    self.syncBlocksInvoked = self.syncBlocksInvoked + 1;
}

- (void)handleAsyncBlock:(void (^)())block
{
    [self handleAsyncBlock:block onGroup:nil];
}

- (void)handleAsyncBlock:(void (^)())block onGroup:(NSString *)groupName
{
    RTDispatchGroup *group;
    if (groupName) {
        group = [self.groups objectForKey:groupName];
        if (!group) {
            group = [RTDispatchGroup groupWithName:groupName];
            [self.groups setObject:group forKey:groupName];
        }
        
        [group increment];
        
    } else {
        group = nil;
    }

    [self.blocks addObject:[RTDispatchBlock asyncDispatchBlockWithBlock:block onGroup:group]];
}

- (void)dispatchBlocks
{
    NSArray *pendingBlocks = [NSArray arrayWithArray:self.blocks];
    
    /* Remove any pending blocks here. This is required as one of the async blocks can schedule a sync block
     that will again try to clear the blocks by calling dispatchBlocks. We don't want the blocks to be executed twice */
    [self.blocks removeAllObjects];
    
    [pendingBlocks enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
        RTDispatchBlock *block = obj;

        // Special mojo for [RTObject currentObject] support
        NSThread *currentThread = [NSThread currentThread];
        RTObject *lastOwnedObject = [currentThread.threadDictionary objectForKey:@"kRTObjectLastOwnedObject"];

        // Just so the pointers are the same, use OCPartialMockObject's "realObject"
        id pMock = self.partialMock;
        [currentThread.threadDictionary setObject:[pMock performSelector:@selector(realObject)] forKey:kRTObjectLastOwnedObject];
        @try {
            block.block();
        }
        @finally {
            // Deal with group count
            [block.group decrement];
            
            // Pop last owned object
            if (lastOwnedObject) {
                [currentThread.threadDictionary setObject:lastOwnedObject forKey:@"kRTObjectLastOwnedObject"];
            } else {
                [currentThread.threadDictionary removeObjectForKey:@"kRTObjectLastOwnedObject"];
            }
        }

        block.block = nil;
    }];
}

- (NSInteger)blockCount
{
    return [self.blocks count];
}

- (void)handleNotify:(void (^)())notifyBlock onGroup:(NSString *)groupName
{
    NSAssert(groupName, @"group name cannot be NULL");
    
    RTDispatchGroup *group = [self.groups objectForKey:groupName];
    if (!group) {
        group = [RTDispatchGroup groupWithName:groupName];
        [self.groups setObject:group forKey:groupName];
    }
    group.notifyBlock = notifyBlock;
}

- (id)handleTimerBlock:(void (^)())block
             withTimeout:(uint64_t)timeout 
{
    id mock = [OCMockObject mockForClass:[RTTimer class]];
    [self.timerMocks addObject:[RTDispatchMockTimer mockTimerWithMock:mock]];
    
    RTDispatchTimer *timer = [[RTDispatchTimer alloc] init];
    timer.block = block;
    timer.timeout = self.now + timeout;
    timer.mock = mock;
    [self.timers addObject:timer];
    
    [[[mock stub] andDo:^(NSInvocation *invocation) {
        NSAssert(timer.state != kRTDispatchTimerStateCancelled, @"Cannot resume a cancelled timer");
        timer.state = kRTDispatchTimerStateActive;
    }] resumeTimer];
    
    [[[mock stub] andDo:^(NSInvocation *invocation) {
        NSAssert(timer.state != kRTDispatchTimerStateCancelled, @"Cannot suspend a cancelled timer");
        timer.state = kRTDispatchTimerStateInactive;
    }] suspendTimer];
    
    [[[mock stub] andDo:^(NSInvocation *invocation) {
        timer.state = kRTDispatchTimerStateCancelled;
    }] cancelTimer];
    
    [[[mock stub] andDo:^(NSInvocation *invocation) {
        BOOL isCancelled = (timer.state == kRTDispatchTimerStateCancelled);
        [invocation setReturnValue:&isCancelled];
    }] isCancelled];
    
    return mock;
}
@end

@implementation RTDispatchBlock
@synthesize block = mBlock;
@synthesize blockType = mBlockType;
@synthesize group = mGroup;

+ (id)asyncDispatchBlockWithBlock:(void(^)())block
{
    return [self asyncDispatchBlockWithBlock:block onGroup:NULL];
}

+ (id)asyncDispatchBlockWithBlock:(void(^)())block onGroup:(RTDispatchGroup *)group
{
    RTDispatchBlock *b = [[RTDispatchBlock alloc] init];
    b.blockType = kRTDispatchBlockAsync;
    b.block = block;
    b.group = group;
    
    return b;
}

+ (id)syncDispatchBlockWithBlock:(void(^)())block
{
    RTDispatchBlock *b = [[RTDispatchBlock alloc] init];
    b.blockType = kRTDispatchBlockSync;
    b.block = block;
    
    return b;
}
@end

@implementation RTDispatchGroup
@synthesize name = mName;
@synthesize count = mCount;
@synthesize notifyBlock = mNotifyBlock;

+ (RTDispatchGroup *)groupWithName:(NSString *)name
{
    RTDispatchGroup *g = [[RTDispatchGroup alloc] init];
    g.name = name;

    return g;
}

- (void)increment
{
    self.count++;
}

- (void)decrement
{
    NSAssert(self.count > 0, @"Group count about to go negative!");
    self.count--;
    if (self.count == 0) {
        if (self.notifyBlock) {
            self.notifyBlock();
        }
    }
}

- (void)setNotifyBlock:(void (^)())notifyBlock
{
    self->mNotifyBlock = [notifyBlock copy];

    // Immediately fire block if the count is already zero
    if (self.count == 0) {
        if (notifyBlock) {
            notifyBlock();
        }
    }
}
@end

@implementation RTDispatchTimer
@synthesize block = mBlock;
@synthesize timeout = mTimeout;
@synthesize state = mState;
@synthesize mock = mMock;
@end

@implementation RTDispatchMockTimer
@synthesize mock = mMock;

+ (RTDispatchMockTimer *)mockTimerWithMock:(id)mock
{
    RTDispatchMockTimer *t = [[RTDispatchMockTimer alloc] init];
    t.mock = mock;
    return t;
}
@end