package com.asawera.chemistry

import android.annotation.SuppressLint
import android.net.Uri
import android.webkit.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature
import org.json.JSONObject
import java.io.ByteArrayInputStream
import java.net.URLConnection

const val ASSET_ORIGIN="https://appassets.androidplatform.net"
@SuppressLint("SetJavaScriptEnabled")
@Composable
fun LessonPlayer(lesson:Lesson,catalog:Catalog,onAr:(ArZone)->Unit,modifier:Modifier=Modifier,onError:(String)->Unit={},onLessonChanged:(Lesson)->Unit={},initialPage:String?=null) {
    var webView by remember { mutableStateOf<WebView?>(null) }
    AndroidView(modifier=modifier,factory={ context ->
        WebView(context).apply {
            webView=this
            settings.javaScriptEnabled=true;settings.domStorageEnabled=true;settings.allowFileAccess=false;settings.allowContentAccess=false;settings.mixedContentMode=WebSettings.MIXED_CONTENT_NEVER_ALLOW
            setBackgroundColor(android.graphics.Color.rgb(12,16,25))
            webChromeClient=object:WebChromeClient(){ override fun onConsoleMessage(message:ConsoleMessage):Boolean { if(message.messageLevel()==ConsoleMessage.MessageLevel.ERROR){android.util.Log.e("AsaweraPlayer",message.message()+" @ "+message.sourceId());onError(message.message())};return true } }
            webViewClient=object:WebViewClient(){
                override fun onPageStarted(view:WebView,url:String,favicon:android.graphics.Bitmap?){val uri=Uri.parse(url);if(uri.host=="appassets.androidplatform.net"){val id=uri.getQueryParameter("film") ?: if(uri.path?.startsWith("/lesson/")==true)uri.getQueryParameter("id") else null;catalog.lessons.find{it.id==id}?.let(onLessonChanged)}}
                override fun shouldInterceptRequest(view:WebView,request:WebResourceRequest):WebResourceResponse? {
                    if(request.url.scheme!="https" || request.url.host!="appassets.androidplatform.net")return denied()
                    val path=request.url.path?.trimStart('/') ?: return denied()
                    if(path.split('/').any { it==".." })return denied()
                    return runCatching {
                        val actual=when { path.isEmpty()->"index.html";path=="lesson"->"lesson/index.html";!path.substringAfterLast('/').contains('.') && path!="lesson/"->"$path.html";path.endsWith('/')->path+"index.html";else->path }
                        val mime=when { actual.endsWith(".js")->"application/javascript";actual.endsWith(".json")->"application/json";actual.endsWith(".glb")->"model/gltf-binary";actual.endsWith(".wasm")->"application/wasm";else->URLConnection.guessContentTypeFromName(actual) ?: "application/octet-stream" }
                        WebResourceResponse(mime,"UTF-8",200,"OK",mapOf("Access-Control-Allow-Origin" to ASSET_ORIGIN,"Cache-Control" to "no-store"),context.assets.open("site/$actual"))
                    }.getOrElse { denied() }
                }
                override fun shouldOverrideUrlLoading(view:WebView,request:WebResourceRequest)=request.url.host!="appassets.androidplatform.net"
            }
            if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER))WebViewCompat.addWebMessageListener(this,"AsaweraNative",setOf(ASSET_ORIGIN)){ _,message,origin,mainFrame,_ ->
                if(mainFrame && origin.toString()==ASSET_ORIGIN)runCatching { val data=JSONObject(message.data ?: "{}");if(data.optString("type")=="ar")catalog.arBySource[data.optString("source")]?.let(onAr) }
            }
            loadUrl(if(initialPage==null)"$ASSET_ORIGIN/index.html?film=${Uri.encode(lesson.id)}" else "$ASSET_ORIGIN/$initialPage")
        }
    })
    DisposableEffect(Unit){ onDispose { webView?.apply { stopLoading();loadUrl("about:blank");removeAllViews();destroy() };webView=null } }
}
private fun denied()=WebResourceResponse("text/plain","UTF-8",404,"Not found",mapOf("Cache-Control" to "no-store"),ByteArrayInputStream("Unavailable local asset".toByteArray()))

@OptIn(ExperimentalMaterial3Api::class)
@SuppressLint("SetJavaScriptEnabled")
@Composable
fun AccountPage(onFinished:()->Unit,modifier:Modifier=Modifier) {
    var instance:WebView? by remember { mutableStateOf(null) }
    var proOptions by remember { mutableStateOf(false) }
    val activity=androidx.compose.ui.platform.LocalContext.current as MainActivity
    if(proOptions)ModalBottomSheet(onDismissRequest={proOptions=false}){PlayProPanel(activity,onActivated={instance?.reload();onFinished()})}
    Column(modifier){
    Row(Modifier.fillMaxWidth()){TextButton(onClick={instance?.loadUrl(BuildConfig.SITE_URL+"/account?channel=google-play");onFinished()}){Text("Account / Pro")};TextButton(onClick={instance?.loadUrl(BuildConfig.SITE_URL+"/owner-sign-in");onFinished()}){Text("Owner sign-in")}}
    TextButton(onClick={proOptions=true},modifier=Modifier.fillMaxWidth()){Text("Pro options / Restore purchases")}
    AndroidView(modifier=Modifier.weight(1f).fillMaxWidth(),factory={ context ->WebView(context).apply {
        instance=this;settings.javaScriptEnabled=true;settings.domStorageEnabled=true;settings.allowFileAccess=false;settings.allowContentAccess=false;settings.mixedContentMode=WebSettings.MIXED_CONTENT_NEVER_ALLOW
        CookieManager.getInstance().setAcceptCookie(true);CookieManager.getInstance().setAcceptThirdPartyCookies(this,false)
        webViewClient=object:WebViewClient(){override fun shouldOverrideUrlLoading(view:WebView,request:WebResourceRequest):Boolean {
            val url=request.url
            if(url.scheme!="https" || url.host!="asawera-chemistry-51y.pages.dev"){
                if(url.scheme=="https" && url.host=="play.google.com")activity.startActivity(android.content.Intent(android.content.Intent.ACTION_VIEW,url))
                return true
            }
            if(url.path in listOf("/","/home","/games")){activity.onBackPressedDispatcher.onBackPressed();return true}
            if(url.path=="/account" && url.getQueryParameter("channel")!="google-play"){view.loadUrl(url.buildUpon().appendQueryParameter("channel","google-play").build().toString());return true}
            return url.path !in listOf("/account","/delete-account","/privacy","/owner-sign-in","/control-room")
        }}
        loadUrl(BuildConfig.SITE_URL+"/account?channel=google-play")
    }})
    }
    DisposableEffect(Unit){onDispose { instance?.apply { stopLoading();destroy() };CookieManager.getInstance().flush();onFinished() }}
}
