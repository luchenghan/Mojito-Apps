#import <Foundation/Foundation.h>
#import "RTHandleProxyMethods.h"	
@protocol RTSCameraHandleMethods <RTHandleProxyMethods>
    
/** Launch the camera / photopicker on device in order to get a picture.
 * Optional Arguments : 
 * @param quality Quality of the saved image. Default 50.
 * @param sourceType 
 * @param cameraType Camera type to choose: 0 = rear facing (default), 1 = front facing
 * @param destinationType What you get returned as the data for the picture: 0 = base64 string (unsupported), 1 = URL to temp-file (default)
 * @param allowEdit Whether to allow simple editing of the photo (like cropping / scaling). Defaults to false.
 * @param encodingType Choose the encoding type of the image: 0 = JPEG, 1 = PNG. Default is image base type or JPEG for camera sourceType or unsupported image types.
 * @param targetWidth Desired width in pixels of the resulting image. Default is image or camera size. Aspect ratio is maintained.
 * @param targetHeight Desired height in pixels of the resulting image. Default is image or camera size. Aspect ratio is maintained.
 * @param mediaType Type of media to select picture from: 0 = picture only, 1 = video only, 2 = all. Valid only with sourceType = 0 (photo library), or 2 (saved photo album)
 * @param pointToRect The rectangle expressed as (left, top, width, height) {x:, y:, w:, h:} enclosing the UI element that is causing the camera / photo picker to show up. This will be used to position the picker. This will ignored on devices where the picker occupies the full screen
 * @param successBlock Called when a picture was successfully obtained OR was cancelled by the user.
 * @param failureBlock Called when a picture was not obtained.
*/
- (NSString *)launch_quality:(NSNumber *)quality sourceType:(NSNumber *)sourceType cameraType:(NSNumber *)cameraType destinationType:(NSNumber *)destinationType allowEdit:(NSNumber *)allowEdit encodingType:(NSNumber *)encodingType targetWidth:(NSNumber *)targetWidth targetHeight:(NSNumber *)targetHeight mediaType:(NSNumber *)mediaType pointToRect:(NSDictionary *)pointToRect successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;
- (NSString *)launch_successBlock:(void(^)(NSDictionary *results))successBlock failureBlock:(void(^)(NSDictionary *results))failureBlock ;

@end

