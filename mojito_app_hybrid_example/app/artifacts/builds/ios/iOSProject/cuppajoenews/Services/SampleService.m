//
//  SampleService.m
//  template
//
//  Add your service instructions continued:
//  5. import the generated <ServiceName>IDL.h, <CocktailsRT/RTIDLCreator.h> and
//     <CocktailsRT/RTService+Subclass.h>files as shown
//  6. Create your <ServiceName>ServiceInterface.h /.m files that will implement your main interface to Javascript.
//  7. Add init / interfaceNameToClassMappings routines as shown and add your ServiceInterface.h/.m files
//     that will deal with your API from your sample.json IDL file.
//  8. In setup:withGroup: do any heavy initialization like creating databases.
//     Use the group if you do any asynchronous setup so you're all done when returning from the setup call.

//  Created by Anne-lise Hassenklover on 5/7/12.
//  Copyright (c) 2012 Yahoo! Inc. All rights reserved.
//

#import "SampleService.h"
#import "SampleIDL.h"
#import "SampleServiceInterface.h"

#import <CocktailsRT/RTIDLCreator.h>
#import <CocktailsRT/RTService+Subclass.h>


@implementation SampleService

- (id)initWithKernel:(RTKernel *)kernel idlCreator:(RTIDLCreator *)idlCreator
serviceInterfaceCreator:(id<RTServiceInterfaceCreator>)serviceInterfaceCreator
       handleCreator:(RTHandleCreator *)handleCreator
{   // Load my IDL.
    NSDictionary *serviceIDL = [idlCreator createIDLWithString:sampleIDLString];
    
    if (idlCreator && !serviceIDL) {
        RTLogComponent(kernel, kRTLogSeverityError, @"FAILED to create Sample Service due to an error in the IDL:\n%@",
                       sampleIDLString);
        return nil; // really really need the IDL.        
    }
    
    // Make me with my ID and IDL (if I have one).
    self = [super initWithID:@"sSample" kernel:kernel idl:serviceIDL serviceInterfaceCreator:serviceInterfaceCreator handleCreator:handleCreator];
    if (self) {   
        // Only init simple things here.
        
        // Setup the log levels for this service.
#if DEBUG
        [self.logger registerComponent:self initialSeverity:kRTLogSeverityDebug];
#else
        [self.logger registerComponent:self initialSeverity:kRTLogSeverityWarning];
#endif
    }
    
    return self;
}

- (NSDictionary *)interfaceNameToClassMappings
{   // Register the main interface.
    return [NSDictionary dictionaryWithObject: [SampleServiceInterface class] forKey:self.ID];
}

- (void)setup:(RTServiceSetupFlags)flags withGroup:(dispatch_group_t)group
{
    [super setup:flags withGroup:group];
    
    // Heavy init goes here.
}


@end
