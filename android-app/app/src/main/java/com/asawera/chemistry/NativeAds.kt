package com.asawera.chemistry
import android.app.Activity
import android.os.Bundle
import android.webkit.CookieManager
import androidx.compose.runtime.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.google.android.gms.ads.*
import com.google.ads.mediation.admob.AdMobAdapter
import com.google.android.ump.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

suspend fun fetchMembership():MemberState=withContext(Dispatchers.IO){runCatching{
 val connection=URL(BuildConfig.SITE_URL+"/api/session").openConnection() as HttpURLConnection
 connection.connectTimeout=8000;connection.readTimeout=8000;connection.setRequestProperty("Cache-Control","no-store");CookieManager.getInstance().getCookie(BuildConfig.SITE_URL)?.let{connection.setRequestProperty("Cookie",it)}
 try{
  if(connection.responseCode!=200)return@runCatching MemberState()
  val data=JSONObject(connection.inputStream.bufferedReader().use{it.readText()})
  val membership=data.getJSONObject("membership")
  val config=data.getJSONObject("config")
  val banner=config.optString("mobileBannerId");val interstitial=config.optString("mobileInterstitialId");val prefix=BuildConfig.MOBILE_APP_ID.substringBefore('~')+"/"
  val validUnits=listOf(banner,interstitial).all{it.startsWith(prefix) && Regex("ca-app-pub-\\d{16}/\\d{10}").matches(it)}
  MemberState(checked=true,pro=membership.getBoolean("pro"),owner=membership.getBoolean("owner"),regionEligible=config.optBoolean("adsLocationEligible"),online=true,mobileApproved=config.optBoolean("mobileAdsEnabled",false) && config.optBoolean("mobileAdsApproved",false) && config.optString("mobileAppId")==BuildConfig.MOBILE_APP_ID && validUnits,bannerUnit=banner,interstitialUnit=interstitial,ageTreatment=config.optInt("ageTreatment",1))
 }finally{connection.disconnect()}
}.getOrDefault(MemberState())}
fun restrictedAdRequest():AdRequest=AdRequest.Builder().addNetworkExtrasBundle(AdMobAdapter::class.java,Bundle().apply{putString("npa","1")}).build()
@Composable fun NativeBanner(activity:Activity,member:MemberState,test:Boolean,onAdsReady:(Boolean)->Unit={}){
 val eligible=AdsPolicy.eligible(member,BuildConfig.LIVE_ADS,test && BuildConfig.DEBUG)
 var ready by remember{mutableStateOf(false)};var banner by remember{mutableStateOf<AdView?>(null)};var privacyOptions by remember{mutableStateOf(false)}
 LaunchedEffect(ready,eligible,test){onAdsReady(eligible && ready && !test)}
 LaunchedEffect(eligible){ready=false;if(eligible){
  val initialize={MobileAds.setRequestConfiguration(RequestConfiguration.Builder().setTagForChildDirectedTreatment(if(member.ageTreatment==1)RequestConfiguration.TAG_FOR_CHILD_DIRECTED_TREATMENT_TRUE else RequestConfiguration.TAG_FOR_CHILD_DIRECTED_TREATMENT_FALSE).setTagForUnderAgeOfConsent(RequestConfiguration.TAG_FOR_UNDER_AGE_OF_CONSENT_TRUE).setMaxAdContentRating(RequestConfiguration.MAX_AD_CONTENT_RATING_G).build());MobileAds.initialize(activity){ready=true}}
  if(test && BuildConfig.DEBUG)initialize() else{val information=UserMessagingPlatform.getConsentInformation(activity);information.requestConsentInfoUpdate(activity,ConsentRequestParameters.Builder().setTagForUnderAgeOfConsent(true).build(),{UserMessagingPlatform.loadAndShowConsentFormIfRequired(activity){privacyOptions=information.privacyOptionsRequirementStatus==ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED;if(information.canRequestAds())initialize()}},{ready=false})}
 }}
 if(eligible && ready){Column(Modifier.fillMaxWidth().padding(horizontal=16.dp,vertical=8.dp)){if(test)Text("GOOGLE TEST AD · no revenue",Modifier.padding(bottom=4.dp));val unit=if(test)"ca-app-pub-3940256099942544/9214589741" else member.bannerUnit;key(unit){AndroidView(modifier=Modifier.fillMaxWidth(),factory={context->AdView(context).apply{banner=this;adUnitId=unit;val width=(context.resources.displayMetrics.widthPixels/context.resources.displayMetrics.density).toInt()-32;setAdSize(AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(context,width));loadAd(restrictedAdRequest())}},onReset=null,onRelease={it.destroy();if(banner===it)banner=null})};if(privacyOptions)TextButton(onClick={ready=false;onAdsReady(false);UserMessagingPlatform.showPrivacyOptionsForm(activity){ready=UserMessagingPlatform.getConsentInformation(activity).canRequestAds()}}){Text("Ad privacy choices")}}}
 DisposableEffect(eligible){onDispose{banner?.destroy();banner=null;ready=false}}
}
