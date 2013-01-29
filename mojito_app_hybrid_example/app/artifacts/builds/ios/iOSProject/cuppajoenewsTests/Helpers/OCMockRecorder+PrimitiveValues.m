//
//  OCMockRecorder+PrimitiveValues.m
//  ychromert
//
//  Created by Daryl Low on 4/12/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//
#import <objc/runtime.h>
#import <SenTestingKit/SenTestingKit.h>

#import "OCMockRecorder+PrimitiveValues.h"

@implementation OCMockRecorder (PrimitiveValues)

- (void)mockSelector:(SEL)sel, ...
{
    //
    // Make sure ARC is *OFF*
    //
    // OCMock doesn't properly retain blocks so ARC will trash them! Add "-fno-objc-arc" to the "Compile Sources" build
    // step in the project.
    //
    {
        id foo = nil;
        [foo retain]; // Stupid XCode might flag this as an error even though the build is successful
    }
    
    // Lookup the selector's signagure
    NSMethodSignature *oldSig = [self methodSignatureForSelector:sel];
    if (!oldSig) {
        NSAssert(oldSig, @"Selector %@ not defined for class %@", NSStringFromSelector(sel), [self class]);
        return;
    }
    
    // Make a new signature string that takes @ in all positions except return, _cmd and self
    NSMutableString *newArgEncodings = [NSMutableString stringWithCapacity:oldSig.numberOfArguments * 2];
    
    // Also build a modifier-free list of types (NULL terminated so gdb will print it correctly)
    char *newArgTypes = alloca(oldSig.numberOfArguments + 1);
    newArgTypes[oldSig.numberOfArguments] = '\0';
    
    // Copy the return value
    [newArgEncodings appendFormat:@"%s", oldSig.methodReturnType];
    
    // Copy self & _cmd
    for (NSUInteger i = 0; i < 2; i++) {
        const char *arg = [oldSig getArgumentTypeAtIndex:i];
        [newArgEncodings appendFormat:@"%s", arg];
        newArgTypes[i] = arg[i];
    }

    // Convert everything that is not an id into one, preserving modifiers
    for (NSUInteger i = 2; i < oldSig.numberOfArguments; i++) {
        // Get the original argument type
        const char *oldArg = [oldSig getArgumentTypeAtIndex:i];
        size_t oldLen = strlen(oldArg);

        // Clone the original argument type
        char *newArg = alloca(oldLen + 1);
        memcpy(newArg, oldArg, oldLen + 1);
        
        // Extract the old type info and change the new type to @
        char oldArgType;
        for (size_t j = 0; j < oldLen; j++) {
            switch (newArg[j]) {
                case 'r': // const
                case 'n': // in
                case 'N': // inout
                case 'o': // out
                case 'O': // bycopy
                case 'R': // byref
                case 'V': // oneway
                    break;
                    
                default:
                    oldArgType = newArg[j];
                    newArg[j] = '@';
                    
                    // Stop the loop
                    j = oldLen;
                    break;
            }
        }
        
        // Only preserve special pointer types, otherwise convert to @
        switch (oldArgType) {
            // Preserve original encoding
            case '@': // id / object
            case '^': // typed C-pointer
            case '*': // C-string (char *)
            case '[': // array
            case '{': // structure
            case '(': // union
                [newArgEncodings appendFormat:@"%s", oldArg];
                newArgTypes[i] = oldArgType;
                break;
                
            // Rewrite to @ encoding
            default:
                [newArgEncodings appendFormat:@"%s", newArg];
                newArgTypes[i] = '@';
                break;
        }
    }
    
    // Build the new stignature object
    NSMethodSignature *newSig = [NSMethodSignature signatureWithObjCTypes:newArgEncodings.UTF8String];
    
    // Build a new NSInvocation based on our new signature
    NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:newSig];
    
    // Keep the selector
    [invocation setSelector:sel];
    
    // Pass variadic parameters to the invocation
    va_list va;
    va_start(va, sel);
    for (NSUInteger i = 2; i < newSig.numberOfArguments; i++) {
        switch (newArgTypes[i]) {
            case '@': { // id / object
                id arg = va_arg(va, id);
                
                //
                // Wrap NSValue and NSString Objects
                //
                // OCMock seems to have a problem matching NSValue and NSString objects. Wrap them in something that
                // fixes the problem.
                //
                // NOTE: Cannot use isKindOfClass because it will be trapped by OCMock!
                //
                Class cls = [arg class];
                while (cls) {
                    if (cls == [NSValue class]) {
                        BOOL (^block)(id) = ^BOOL(id val) {
                            return [val isEqualToValue:arg];
                        };
                        block = [block copy];
                        
                        arg = [OCMArg checkWithBlock:block];
                        break;
                        
                    } else if (cls == [NSString class]) {
                        BOOL (^block)(id) = ^BOOL(id val) {
                            return [val isEqualToString:arg];
                        };
                        block = [block copy];
                        
                        arg = [OCMArg checkWithBlock:block];
                        break;
                    }
                    
                    cls = class_getSuperclass(cls);
                }
                
                [invocation setArgument:&arg atIndex:i];
                break;
            }
                
            // Pass C-pointers verbatim
            case '^':  // typed C-pointer
            case '*':  // C-string (char *)
            default: {
                void *arg = va_arg(va, void *);
                [invocation setArgument:&arg atIndex:i];
                break;
            }
        }
    }
    va_end(va);
    
    // Pass the new NSInvocation to the OCMock recorder
    [self forwardInvocation:invocation];
}

@end
