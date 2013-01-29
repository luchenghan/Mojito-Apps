//
//  OCMockRecorder+PrimitiveValues.h
//  ychromert
//
//  Created by Daryl Low on 4/12/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//
#import <OCMock/OCMock.h>

@interface OCMockRecorder (PrimitiveValues)

//
// Provide Special Constraints
//
// OCMock doesn't allow special constraints against primitive types such as int, double, etc.... For example if you want
// to mock the following method:
//   - (void)foo:(double)bar;
//
// OCMock lets you do this:
//   [[fooObj expect] foo:2.0];
//
// OCMock doesn't let you do any of these:
//   [[fooObj expect] foo:OCMOCK_ANY];
//   [[fooObj expect] foo:[OCMArg checkWithBlock:^BOOL(id val) { return YES; }]];
//
// The reason is that the foo: parameter is of type double (8 bytes), while OCMOCK_ANY is a pointer (4 bytes). There is
// no safe way to force a 32-bit pointer into a a 64-bit parameter slot.
//
// This category converts all parameter types into type id, allowing you to pass special objects like OCMOCK_ANY:
//   [[fooObj expect] mockSelector:@selector(foo:), OCMOCK_ANY];
//
// As a side-effect, all parameters must be of type id, so you cannot do this:
//   [[fooObj expect] mockSelector:@selector(foo:), 2.0];
//
// Instead, you must do this:
//   double tmp = 2.0;
//   [[fooObj expect] mockSelector:@selector(foo:), OCMOCK_VALUE(tmp)];
//
- (void)mockSelector:(SEL)sel, ...;

@end
