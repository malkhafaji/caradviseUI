package com.caradviseui;

import com.facebook.react.ReactActivity;
import io.branch.rnbranch.*;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import android.content.Intent;
import android.os.Bundle;

import java.util.Arrays;
import java.util.List;
import javax.annotation.Nullable;

import com.onesignal.OneSignal;

public class MainActivity extends ReactActivity {

    Bundle b = new Bundle();
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "caradviseui";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNBranchPackage(),
            new CAReactPackage(),
            new CodePush("vBEhXUki5-smzPpDObJHi8EkiOtQ4JbaYvpGb", this, BuildConfig.DEBUG)
        );
    }

    @Override
    protected String getJSBundleFile() {
        return CodePush.getBundleUrl();
    }

    @Override
    public void onStart() {
        super.onStart();

        RNBranchModule.initSession(this.getIntent().getData(), this);

    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      OneSignal.startInit(this).init();

      OneSignal.idsAvailable(new OneSignal.IdsAvailableHandler() {
         @Override
         public void idsAvailable(String userId, String registrationId) {
            b.putString("oneSignalId", userId);
         }
      });
    }

    protected @Nullable Bundle getLaunchOptions() {
      return b;
    }

    @Override
    public void onNewIntent(Intent intent) {
        this.setIntent(intent);
    }
}
