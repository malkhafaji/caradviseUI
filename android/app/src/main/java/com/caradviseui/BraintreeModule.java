package com.caradviseui;

import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.util.Map;
import java.util.HashMap;
import android.app.Activity;
import javax.annotation.Nullable;

import com.braintreepayments.api.BraintreeFragment;
import com.braintreepayments.api.Card;
import com.braintreepayments.api.models.CardBuilder;
import com.braintreepayments.api.exceptions.InvalidArgumentException;
import com.braintreepayments.api.interfaces.PaymentMethodNonceCreatedListener;
import com.braintreepayments.api.models.PaymentMethodNonce;

public class BraintreeModule extends ReactContextBaseJavaModule {

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";
  private BraintreeFragment mBraintreeFragment;
  private Callback mSuccessCallback;
  private Callback mErrorCallback;

  public BraintreeModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "BraintreeAndroid";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
    constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
    return constants;
  }

  @ReactMethod
  public void show(String message, int duration) {
    Toast.makeText(getReactApplicationContext(), message, duration).show();
  }

  @ReactMethod
  public void setup(String clientToken) {
    try {
      mBraintreeFragment = BraintreeFragment.newInstance(getCurrentActivity(), clientToken);
      mBraintreeFragment.addListener(new HandleNonce());
    } catch (InvalidArgumentException e) {
      // There was an issue with your authorization string.
    }

  }

  @ReactMethod
  public void getCardNonce(String cardNumber, String expMonth, String expYear, String cvv, Callback scallback, Callback ecallback) {
      mSuccessCallback = scallback;
      mErrorCallback = ecallback;
      try{
      CardBuilder cardBuilder = new CardBuilder()
        .cardNumber(cardNumber)
        .expirationDate(expMonth + "/" + expYear);

        Card.tokenize(mBraintreeFragment, cardBuilder);
      }
      catch(Exception e)
      {
        mErrorCallback.invoke(e.getMessage());
      }

  }

  private class HandleNonce implements PaymentMethodNonceCreatedListener{
    public void onPaymentMethodNonceCreated(PaymentMethodNonce paymentMethodNonce) {
      String nonce = paymentMethodNonce.getNonce();
      mSuccessCallback.invoke(nonce);
    }
  }

}
