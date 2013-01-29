//
//  RTKeyValueStoreProvider.h
//  ychromert
//
//  Created by Anand Subba Rao on 3/21/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import "RTObject.h"

@class RTKeyValueStore;

@interface RTKeyValueStoreProvider : RTObject

// DON'T use this unless you are the kernel.
- (RTKeyValueStore *)storeForNamespace:(NSString *)nameSpace;

// THE MAIN INTERFACE TO MAKE A KEY-VALUE STORE:
// Use this to create your key-value store like "ychromert_package_config".
- (void)storeForNamespace:(NSString *)nameSpace completion:(void (^)(RTKeyValueStore*))storeCompletion;

// defaultsPackagePath - path to directory (usually the application package) where the defaults dir will store the
//                       values for namespaces. Can be a readonly area
// customValuesPath - path to directory that can store values other than default. Has to be writable
- (id)initWithDefaultsPackagePath:(NSString *)defaultsPackagePath customValuesPath:(NSString *)customValuesPath;

// The defaults package path where the key-value stores should be read from has changed.
- (void)updateDefaultsPackagePath:(NSString *)defaultsPackagePath;

//clear all custom values
- (void)reset;

@end
