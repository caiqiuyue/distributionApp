package com.distributionapp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import cn.jpush.reactnativejpush.JPushPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {


  // 设置为 true 将不会弹出 toast
    private boolean SHUTDOWN_TOAST = true;
    // 设置为 true 将不会打印 log
    private boolean SHUTDOWN_LOG = false;




  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ImagePickerPackage(),
            new RNFSPackage(),
            new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
            new LinearGradientPackage(),
            new CodePush(
                                  "DQBnEDf7W44ZrPOsqRuwli8RalRf4ksvOXqog",
                                  MainApplication.this,
                                  BuildConfig.DEBUG,
                                  "http://39.105.201.251:3000"
                          )
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
