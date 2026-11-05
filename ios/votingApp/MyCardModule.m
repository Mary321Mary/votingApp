#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MyCardModule, NSObject)

RCT_EXTERN_METHOD(
  getMyCard:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
)

@end