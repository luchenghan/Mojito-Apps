//
//  RTKeyValueStore.h
//  ychromert
//
//  Created by Anand Subba Rao on 3/21/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import "RTObject.h"

@interface RTKeyValueStore : RTObject

// Update my defaults path to a new one.
- (void)updateDefaultsPath:(NSString *)defaultsPath;

- (void)setObject:(id)obj forKey:(NSString *)key;
- (id)valueForKey:(NSString *)key;
- (void)removeObjectForKey:(NSString *)key;
- (BOOL)synchronize;
@end
