package com.asawera.chemistry
import android.app.Activity
import android.os.SystemClock
import com.google.android.gms.ads.*
import com.google.android.gms.ads.interstitial.*

class NativeInterstitial(private val activity:Activity){
 private var member=MemberState()
 private var consentReady=false
 private var generation=0
 private var loading=false
 private var ad:InterstitialAd?=null
 private var loadedAt=0L
 private val cadence=InterstitialCadence(SystemClock.elapsedRealtime())
 private fun eligible()=consentReady && AdsPolicy.eligible(member,BuildConfig.LIVE_ADS,false)
 fun updateMember(value:MemberState){val changed=member.interstitialUnit!=value.interstitialUnit;member=value;if(!eligible() || changed){generation++;loading=false;ad=null}}
 fun consentChanged(ready:Boolean){consentReady=ready;if(!ready){generation++;loading=false;ad=null}else preload()}
 private fun preload(){
  if(!eligible() || loading || ad!=null)return
  loading=true;val token=generation
  InterstitialAd.load(activity,member.interstitialUnit,restrictedAdRequest(),object:InterstitialAdLoadCallback(){
   override fun onAdLoaded(value:InterstitialAd){if(token!=generation)return;loading=false;if(eligible()){ad=value;loadedAt=SystemClock.elapsedRealtime()}}
   override fun onAdFailedToLoad(error:LoadAdError){if(token==generation){loading=false;ad=null}}
  })
 }
 fun lessonExit(durationMs:Long){
  val now=SystemClock.elapsedRealtime();val offer=cadence.lessonExit(durationMs,now)
  if(!eligible()){ad=null;return}
  if(now-loadedAt>=3600000)ad=null
  val ready=ad
  if(offer && ready!=null){
   ad=null
   ready.fullScreenContentCallback=object:FullScreenContentCallback(){
    override fun onAdShowedFullScreenContent(){cadence.shown(SystemClock.elapsedRealtime())}
    override fun onAdDismissedFullScreenContent(){preload()}
    override fun onAdFailedToShowFullScreenContent(error:AdError){preload()}
   }
   ready.show(activity)
  }
 }
 fun dispose(){generation++;consentReady=false;ad=null;loading=false}
}
