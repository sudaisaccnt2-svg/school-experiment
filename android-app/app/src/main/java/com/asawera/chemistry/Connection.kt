package com.asawera.chemistry
import android.content.Context
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import androidx.compose.runtime.*
import androidx.compose.ui.platform.LocalContext
@Composable fun rememberConnected():Boolean {
 val context=LocalContext.current;val manager=remember{context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager}
 fun validated()=manager.getNetworkCapabilities(manager.activeNetwork)?.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)==true
 var connected by remember{mutableStateOf(validated())}
 DisposableEffect(manager){val callback=object:ConnectivityManager.NetworkCallback(){override fun onCapabilitiesChanged(network:Network,capabilities:NetworkCapabilities){connected=capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)};override fun onLost(network:Network){connected=validated()}}
 manager.registerDefaultNetworkCallback(callback);onDispose{manager.unregisterNetworkCallback(callback)}}
 return connected
}
