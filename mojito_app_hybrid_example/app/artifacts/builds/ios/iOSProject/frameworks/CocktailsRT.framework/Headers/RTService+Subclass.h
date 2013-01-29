//
//  RTService+Subclass.h
//  ychromert
//
//  Created by Rongrong Zhong on 3/14/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import "RTService.h"

@class RTHandleCreator;
@class RTNativeContext;
@class RTServiceInterface;

@protocol RTServiceInterfaceCreator;

@interface RTService (Subclass)
//
// The actual interfaces
// key: interface name
// value: pointer to the interface
//
@property (nonatomic, retain, readwrite) NSDictionary *interfaces;

// Global singletons
+ (RTNativeContext *)sharedNativeContext;
+ (RTKernel *)sharedKernel;
+ (RTIDLCreator *)sharedIDLCreator;
+ (RTIDLValidator *)sharedIDLValidator;

// Override this and call the init method below when you have loaded/created your IDL dictionary.
// Id you don't have an IDL pass nil for it when calling the init below.
-    (id)initWithKernel:(RTKernel *)kernel
             idlCreator:(RTIDLCreator *)idlCreator
serviceInterfaceCreator:(id<RTServiceInterfaceCreator>)serviceInterfaceCreator;

-    (id)initWithKernel:(RTKernel *)kernel
             idlCreator:(RTIDLCreator *)idlCreator
serviceInterfaceCreator:(id<RTServiceInterfaceCreator>)serviceInterfaceCreator
          handleCreator:(RTHandleCreator *)handleCreator;

// Call this method inside the override of the above init.
-        (id)initWithID:(NSString *)identifier
                 kernel:(RTKernel *)kernel
                    idl:(NSDictionary *)idl
serviceInterfaceCreator:(id)serviceInterfaceCreator;

// Call this method inside the override of the above init.
-        (id)initWithID:(NSString *)identifier
                 kernel:(RTKernel *)kernel
                    idl:(NSDictionary *)idl
serviceInterfaceCreator:(id<RTServiceInterfaceCreator>)serviceInterfaceCreator
          handleCreator:(RTHandleCreator *)handleCreator;

- (void)createServiceInterfacesWithMapping:(NSDictionary *)interfaceNameToClassMappings;

// all subclasses should override this to provide an interface name -> class name mapping of all service interfaces supported.
- (NSDictionary *)interfaceNameToClassMappings;

@end
