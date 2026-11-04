package com.asawera.chemistry

import android.app.Activity
import android.webkit.CookieManager
import androidx.compose.runtime.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.android.billingclient.api.*
import kotlinx.coroutines.*
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

data class PlayPlan(val id:String,val title:String,val price:String,val period:String)

class PlayPurchases(private val activity:Activity,private val onActivated:()->Unit):PurchasesUpdatedListener {
    var plans by mutableStateOf<List<PlayPlan>>(emptyList());private set
    var message by mutableStateOf("Checking your account…");private set
    var busy by mutableStateOf(false);private set
    var alreadyPro by mutableStateOf(false);private set
    private var binding=""
    private val scope=CoroutineScope(SupervisorJob()+Dispatchers.Main)
    private var client:BillingClient?=null
    private var ids=listOf<String>()

    private suspend fun api(path:String,input:JSONObject?=null):JSONObject=withContext(Dispatchers.IO){
        val connection=URL(BuildConfig.SITE_URL+"/api/"+path).openConnection() as HttpURLConnection
        connection.connectTimeout=15000;connection.readTimeout=20000
        connection.setRequestProperty("Cache-Control","no-store")
        CookieManager.getInstance().getCookie(BuildConfig.SITE_URL)?.let{connection.setRequestProperty("Cookie",it)}
        try{
            if(input!=null){connection.requestMethod="POST";connection.doOutput=true;connection.setRequestProperty("Origin",BuildConfig.SITE_URL);connection.setRequestProperty("Content-Type","application/json");connection.outputStream.use{it.write(input.toString().toByteArray(Charsets.UTF_8))}}
            val code=connection.responseCode
            val data=JSONObject((if(code in 200..299)connection.inputStream else connection.errorStream).bufferedReader().use{it.readText()})
            if(code !in 200..299)throw IllegalStateException(data.optString("error","Connect again to check your account."))
            data
        }finally{connection.disconnect()}
    }
    fun load(){if(busy)return;busy=true;scope.launch{
        try{
            val config=api("play/config");binding=config.optString("accountId");alreadyPro=config.getJSONObject("membership").getBoolean("pro")
            if(config.optBoolean("owner")){message="Your owner account already has ad-free Pro.";return@launch}
            if(!config.optBoolean("ready")){message="Google Play purchases are not available yet. Your existing Pro access still works.";return@launch}
            val products=config.getJSONArray("productIds");ids=(0 until products.length()).map{products.getString(it)}
            if(!Regex("[a-f0-9]{64}").matches(binding) || ids.isEmpty()){message="Pro purchases are temporarily unavailable.";return@launch}
            client?.endConnection()
            client=BillingClient.newBuilder(activity).setListener(this@PlayPurchases).enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build()).enableAutoServiceReconnection().build()
            client!!.startConnection(object:BillingClientStateListener{
                override fun onBillingServiceDisconnected(){if(scope.isActive)message="Reconnect to Google Play to view Pro options."}
                override fun onBillingSetupFinished(result:BillingResult){if(!scope.isActive)return;if(result.responseCode==BillingClient.BillingResponseCode.OK){queryPlans();restore()}else{message="Google Play billing is unavailable on this device."}}
            })
        }catch(error:Exception){message=if(error is IllegalStateException)error.message ?: "Sign in to your student account first." else "Connect to check Google Play purchases."}
        finally{busy=false}
    }}
    private fun queryParams(products:List<String>)=QueryProductDetailsParams.newBuilder().setProductList(products.map{QueryProductDetailsParams.Product.newBuilder().setProductId(it).setProductType(BillingClient.ProductType.SUBS).build()}).build()
    private fun queryPlans(){client?.queryProductDetailsAsync(queryParams(ids)){result,response->
        if(!scope.isActive)return@queryProductDetailsAsync
        if(result.responseCode!=BillingClient.BillingResponseCode.OK){message="Google Play could not load Pro prices.";return@queryProductDetailsAsync}
        plans=response.productDetailsList.mapNotNull{details->val offer=details.subscriptionOfferDetails?.firstOrNull{it.offerId==null};val phase=offer?.pricingPhases?.pricingPhaseList?.lastOrNull();if(phase==null)null else PlayPlan(details.productId,details.name,phase.formattedPrice,when(phase.billingPeriod){"P1M"->"per month";"P1Y"->"per year";else->phase.billingPeriod})}
        message=if(alreadyPro)"Pro is already active. Manage your subscription in Google Play." else if(plans.isEmpty())"Pro plans are not published in Google Play yet." else "Subscriptions renew automatically. Google Play shows the full terms before payment."
    }}
    fun buy(plan:PlayPlan){
        if(busy || alreadyPro || binding.isBlank())return
        busy=true
        // Fetch fresh ProductDetails instead of caching objects between purchase attempts.
        client?.queryProductDetailsAsync(queryParams(listOf(plan.id))){result,response->
            if(!scope.isActive)return@queryProductDetailsAsync
            busy=false
            val details=response.productDetailsList.firstOrNull{it.productId==plan.id};val offer=details?.subscriptionOfferDetails?.firstOrNull{it.offerId==null}
            if(result.responseCode!=BillingClient.BillingResponseCode.OK || details==null || offer==null){message="This Pro plan is unavailable. Refresh and try again.";return@queryProductDetailsAsync}
            val product=BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(details).setOfferToken(offer.offerToken).build()
            val launched=client!!.launchBillingFlow(activity,BillingFlowParams.newBuilder().setProductDetailsParamsList(listOf(product)).setObfuscatedAccountId(binding).build())
            if(launched.responseCode!=BillingClient.BillingResponseCode.OK)message="Google Play could not open checkout. Try again later."
        }
    }
    fun restore(){client?.queryPurchasesAsync(QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.SUBS).build()){result,purchases->
        if(!scope.isActive)return@queryPurchasesAsync
        if(result.responseCode==BillingClient.BillingResponseCode.OK)purchases.forEach{purchase->if(purchase.accountIdentifiers?.obfuscatedAccountId==binding)verify(purchase)}
        else message="Google Play could not restore purchases."
    }}
    override fun onPurchasesUpdated(result:BillingResult,purchases:MutableList<Purchase>?){
        if(!scope.isActive)return
        when(result.responseCode){BillingClient.BillingResponseCode.OK->purchases?.forEach(::verify);BillingClient.BillingResponseCode.USER_CANCELED->message="Purchase cancelled.";BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED->restore();else->message="Google Play could not complete this purchase."}
    }
    private fun verify(purchase:Purchase){
        if(purchase.purchaseState==Purchase.PurchaseState.PENDING){message="Payment is pending in Google Play. Pro starts after payment is confirmed.";return}
        if(purchase.purchaseState!=Purchase.PurchaseState.PURCHASED)return
        scope.launch{busy=true;try{
            val response=api("play/verify",JSONObject().put("purchaseToken",purchase.purchaseToken))
            message=response.getString("message")
            if(response.optBoolean("active")){alreadyPro=true;onActivated()}
        }catch(error:Exception){message=if(error is IllegalStateException)error.message ?: "Purchase verification is unavailable." else "Connect again to verify your purchase. You can restore it later."}finally{busy=false}}
    }
    fun close(){scope.cancel();client?.endConnection();client=null}
}

@Composable fun PlayProPanel(activity:Activity,onActivated:()->Unit){
    val purchases=remember(activity){PlayPurchases(activity,onActivated)}
    LaunchedEffect(purchases){purchases.load()}
    DisposableEffect(purchases){onDispose{purchases.close()}}
    Column(Modifier.fillMaxWidth().padding(20.dp),verticalArrangement=Arrangement.spacedBy(12.dp)){
        Text("Ad-free Pro",style=MaterialTheme.typography.headlineSmall)
        Text(purchases.message)
        if(purchases.busy)LinearProgressIndicator(Modifier.fillMaxWidth())
        if(!purchases.alreadyPro)purchases.plans.forEach{plan->Card(Modifier.fillMaxWidth()){Column(Modifier.padding(16.dp)){Text(plan.title);Text(plan.price+" "+plan.period);Button(onClick={purchases.buy(plan)},enabled=!purchases.busy){Text("Subscribe with Google Play")}}}}
        Row{TextButton(onClick={purchases.load()},enabled=!purchases.busy){Text("Refresh")};TextButton(onClick={purchases.restore()},enabled=!purchases.busy){Text("Restore purchases")}}
        TextButton(onClick={activity.startActivity(android.content.Intent(android.content.Intent.ACTION_VIEW,android.net.Uri.parse("https://play.google.com/store/account/subscriptions?package="+activity.packageName)))}){Text("Manage or cancel subscriptions")}
    }
}
