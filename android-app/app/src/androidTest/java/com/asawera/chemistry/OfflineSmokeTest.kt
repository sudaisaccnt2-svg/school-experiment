package com.asawera.chemistry

import android.webkit.WebView
import android.view.View
import android.view.ViewGroup
import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.uiautomator.*
import org.junit.Test
import org.junit.Assert.*
import org.junit.runner.RunWith
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

@RunWith(AndroidJUnit4::class)
class OfflineSmokeTest {
 private val instrumentation=InstrumentationRegistry.getInstrumentation()
 private val device=UiDevice.getInstance(instrumentation)
 @Test fun currentMetalBenchLessonRendersItsBundledAssetsOffline(){
  device.executeShellCommand("svc wifi disable");device.executeShellCommand("svc data disable")
  val context=instrumentation.targetContext;val lesson=Catalog(context).lessons.first{it.id=="806"}
  val intent=context.packageManager.getLaunchIntentForPackage("com.asawera.chemistry")!!;intent.addFlags(android.content.Intent.FLAG_ACTIVITY_CLEAR_TASK);context.startActivity(intent)
  assertTrue(device.wait(Until.hasObject(By.text("Your chemistry lab")),30000))
  device.findObject(By.clazz("android.widget.EditText")).text=lesson.title
  assertTrue(device.wait(Until.hasObject(By.text(lesson.title)),10000))
  device.findObjects(By.text(lesson.title)).last().click()
  val deadline=System.currentTimeMillis()+60000
  while(System.currentTimeMillis()<deadline && js("window._ready===true")!="true")Thread.sleep(500)
  assertEquals("true",js("window._ready===true"))
  assertEquals("806",js("new URLSearchParams(location.search).get('id')"))
  assertFalse(device.hasObject(By.text("Please reopen this lesson if it cannot load.")))
  device.pressBack();assertTrue(device.wait(Until.hasObject(By.text("Your chemistry lab")),10000))
 }
 @Test fun nativeArBridgeOpensAnEmbeddedSceneOffline(){
  device.executeShellCommand("svc wifi disable");device.executeShellCommand("svc data disable")
  device.executeShellCommand("pm grant com.asawera.chemistry android.permission.CAMERA")
  val context=instrumentation.targetContext
  val catalog=Catalog(context);val lesson=catalog.lessons.first();val zone=lesson.zones.first()
  context.assets.open(zone.asset).use{val header=ByteArray(4);assertEquals(4,it.read(header));assertEquals("glTF",String(header))}
  val intent=context.packageManager.getLaunchIntentForPackage("com.asawera.chemistry")!!;intent.addFlags(android.content.Intent.FLAG_ACTIVITY_CLEAR_TASK);context.startActivity(intent)
  assertTrue(device.wait(Until.hasObject(By.text("Your chemistry lab")),30000))
  device.findObject(By.text(lesson.title)).click()
  val deadline=System.currentTimeMillis()+60000
  while(System.currentTimeMillis()<deadline && js("!!window.AsaweraNative")!="true")Thread.sleep(500)
  assertEquals("true",js("!!window.AsaweraNative"))
  val message=org.json.JSONObject().put("type","ar").put("source",zone.source).toString()
  js("window.AsaweraNative.postMessage("+org.json.JSONObject.quote(message)+");true")
  assertTrue("Native AR scene did not open",device.wait(Until.hasObject(By.text(zone.name)),45000))
  Thread.sleep(3500)
  assertFalse("AR must render outside the web player",device.hasObject(By.clazz("android.webkit.WebView")))
  device.pressBack();assertTrue(device.wait(Until.hasObject(By.text(lesson.title)),10000))
 }
 @Test fun bundledLibraryAndFilmWorkWithNetworkingOff(){
  device.executeShellCommand("svc wifi disable");device.executeShellCommand("svc data disable")
  val context=instrumentation.targetContext
  val intent=context.packageManager.getLaunchIntentForPackage("com.asawera.chemistry")!!;intent.addFlags(android.content.Intent.FLAG_ACTIVITY_CLEAR_TASK)
  context.startActivity(intent)
  assertTrue(device.wait(Until.hasObject(By.text("Your chemistry lab")),30000))
  assertTrue(device.hasObject(By.text("110 lessons")))
  device.findObject(By.text("Rutherford's Atomic Model")).click()
  val deadline=System.currentTimeMillis()+90000;var ready=false
  while(System.currentTimeMillis()<deadline){
   if(js("document.querySelector('#loading')?.classList.contains('done')===true")=="true"){ready=true;break}
   Thread.sleep(500)
  }
  assertTrue("Saved 3D film did not finish loading offline: "+js("JSON.stringify({url:location.href,state:document.readyState,loading:document.querySelector('#loading')?.outerHTML,error:document.querySelector('#error')?.textContent})"),ready)
  assertEquals("false",js("!document.querySelector('#error')?.hidden"))
  assertEquals("false",js("!!document.querySelector('#asaweraAdScript')"))
  assertEquals("true",js("!!window.AsaweraNative"))
  js("if(document.querySelector('#playBtn').textContent.includes('▶'))document.querySelector('#playBtn').click();true")
  Thread.sleep(1200)
  assertNotEquals("1",js("document.querySelector('#scrub').value"))
  device.pressBack();assertTrue(device.wait(Until.hasObject(By.text("Your chemistry lab")),10000))
 }
 private fun findWeb(view:View):WebView?{if(view is WebView)return view;if(view is ViewGroup)for(i in 0 until view.childCount)findWeb(view.getChildAt(i))?.let{return it};return null}
 private fun js(code:String):String{
  var result="null";val latch=CountDownLatch(1)
  instrumentation.runOnMainSync{
   val activities=androidx.test.runner.lifecycle.ActivityLifecycleMonitorRegistry.getInstance().getActivitiesInStage(androidx.test.runner.lifecycle.Stage.RESUMED)
   val web=activities.firstOrNull()?.window?.decorView?.let(::findWeb)
   if(web==null)latch.countDown() else web.evaluateJavascript(code){result=it ?: "null";latch.countDown()}
  }
  latch.await(5,TimeUnit.SECONDS);return result.trim('"')
 }
}
