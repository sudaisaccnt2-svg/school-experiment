@file:OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)
package com.asawera.chemistry
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ViewInAr
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

val Gold=Color(0xFFF2C46D)
class MainActivity:ComponentActivity(){override fun onCreate(savedInstanceState:Bundle?){super.onCreate(savedInstanceState);enableEdgeToEdge();val catalog=Catalog(this);setContent{AsaweraApp(catalog)}}}
@Composable fun AsaweraApp(catalog:Catalog){
 val activity=androidx.compose.ui.platform.LocalContext.current as MainActivity
 var lesson by remember{mutableStateOf<Lesson?>(null)};var zone by remember{mutableStateOf<ArZone?>(null)};var account by remember{mutableStateOf(false)};var chooseAr by remember{mutableStateOf(false)};var games by remember{mutableStateOf(false)}
 var membership by remember{mutableStateOf(MemberState())};var refreshKey by remember{mutableIntStateOf(0)};var testAds by remember{mutableStateOf(false)};var issue by remember{mutableStateOf<String?>(null)}
 val connected=rememberConnected()
 val interstitial=remember(activity){NativeInterstitial(activity)};var lessonStartedAt by remember{mutableLongStateOf(0L)}
 SideEffect{interstitial.updateMember(membership.copy(online=membership.online && connected))}
 DisposableEffect(Unit){onDispose{interstitial.dispose()}}
 DisposableEffect(activity){val observer=androidx.lifecycle.LifecycleEventObserver{_,event->if(event==androidx.lifecycle.Lifecycle.Event.ON_RESUME){membership=MemberState();interstitial.updateMember(MemberState());refreshKey++}};activity.lifecycle.addObserver(observer);onDispose{activity.lifecycle.removeObserver(observer)}}
 LaunchedEffect(refreshKey,account,connected){if(!account)membership=if(connected)fetchMembership() else MemberState()}
 val back:()->Unit={when{zone!=null->zone=null;account->{account=false;membership=MemberState();interstitial.updateMember(MemberState());refreshKey++};games->{games=false;issue=null};lesson!=null->{lesson=null;issue=null;chooseAr=false;interstitial.lessonExit(android.os.SystemClock.elapsedRealtime()-lessonStartedAt)};else->Unit}}
 BackHandler(lesson!=null || zone!=null || account || games){back()}
 MaterialTheme(colorScheme=darkColorScheme(primary=Gold,onPrimary=Color(0xFF171A21),background=Color(0xFF0C1019),surface=Color(0xFF141C2A),surfaceVariant=Color(0xFF1B2638))){
  Scaffold(topBar={TopAppBar(title={Column{Text(if(zone!=null)zone!!.name else if(account)"Your account" else if(games)"Practice games" else "ASAWERA",fontWeight=FontWeight.Bold,fontSize=20.sp);if(lesson==null && !account && !games)Text("Chemistry · learn in 3D",fontSize=12.sp,color=Gold)}},navigationIcon={if(lesson!=null || zone!=null || account || games)IconButton(onClick=back){Icon(Icons.AutoMirrored.Filled.ArrowBack,"Back")}},actions={if(!account)IconButton(onClick={account=true;membership=MemberState();interstitial.updateMember(MemberState())}){Icon(Icons.Default.AccountCircle,"Account / Pro")}})},containerColor=MaterialTheme.colorScheme.background){padding->
   Column(Modifier.fillMaxSize().padding(padding)){
    when{
     account->if(connected)AccountPage(onFinished={refreshKey++},modifier=Modifier.weight(1f).fillMaxWidth()) else Card(Modifier.fillMaxWidth().padding(20.dp)){Column(Modifier.padding(20.dp)){Text("You're offline",fontSize=22.sp);Text("Your saved lessons and AR scenes are ready. Connect to manage your account or Pro.",Modifier.padding(top=12.dp));TextButton(onClick=back){Text("Return to lessons")}}}
     zone!=null->ArViewer(zone!!,Modifier.weight(1f).fillMaxWidth())
     games->LessonPlayer(catalog.lessons.first(),catalog,onAr={zone=it},modifier=Modifier.weight(1f).fillMaxWidth(),initialPage="games.html",onError={issue=it})
     lesson!=null->{Row(Modifier.fillMaxWidth().padding(horizontal=14.dp),horizontalArrangement=Arrangement.SpaceBetween){Text(lesson!!.title,Modifier.weight(1f).padding(vertical=10.dp),maxLines=2,fontSize=14.sp);if(lesson!!.zones.isNotEmpty())Box{TextButton(onClick={if(lesson!!.zones.size==1)zone=lesson!!.zones.first() else chooseAr=true}){Icon(Icons.Default.ViewInAr,null);Text(" AR")};DropdownMenu(expanded=chooseAr,onDismissRequest={chooseAr=false}){lesson!!.zones.forEach{scene->DropdownMenuItem(text={Text(scene.name)},onClick={zone=scene;chooseAr=false})}}}};LessonPlayer(lesson!!,catalog,onAr={zone=it},modifier=Modifier.weight(1f).fillMaxWidth(),onError={issue=it},onLessonChanged={lesson=it;chooseAr=false});if(issue!=null)Text("Please reopen this lesson if it cannot load.",Modifier.padding(12.dp),color=MaterialTheme.colorScheme.error,fontSize=12.sp)}
     else->LibraryScreen(catalog,membership,onOpen={lesson=it;issue=null;lessonStartedAt=android.os.SystemClock.elapsedRealtime()},modifier=Modifier.weight(1f),testAds=testAds,onToggleTest={testAds=!testAds},onGames={games=true;issue=null})
    }
    if(lesson==null && zone==null && !account && !games)NativeBanner(activity,membership.copy(online=membership.online && connected),testAds,onAdsReady={interstitial.consentChanged(it)})
   }
  }
 }
}
@Composable fun LibraryScreen(catalog:Catalog,member:MemberState,onOpen:(Lesson)->Unit,modifier:Modifier,testAds:Boolean,onToggleTest:()->Unit,onGames:()->Unit){
 var query by remember{mutableStateOf("")};var chapter by remember{mutableStateOf<String?>(null)}
 val items=catalog.lessons.filter{(chapter==null || it.unit==chapter) && it.title.contains(query,ignoreCase=true)}
 Column(modifier.fillMaxWidth()){
  Card(Modifier.fillMaxWidth().padding(16.dp),colors=CardDefaults.cardColors(containerColor=Color(0xFF1A2638)),shape=RoundedCornerShape(20.dp)){Column(Modifier.padding(20.dp)){Text("Your chemistry lab",fontSize=27.sp,fontWeight=FontWeight.Bold);Text("110 lessons. All saved on this phone.",Modifier.padding(top=8.dp),color=Color(0xFFBAC8DC));Text("OFFLINE READY · 3D + NATIVE AR",Modifier.padding(top=14.dp),color=Gold,fontSize=11.sp,fontWeight=FontWeight.Bold)}}
  OutlinedTextField(value=query,onValueChange={query=it},label={Text("Find a lesson")},leadingIcon={Icon(Icons.Default.Search,null)},singleLine=true,modifier=Modifier.fillMaxWidth().padding(horizontal=16.dp),shape=RoundedCornerShape(14.dp))
  ScrollableTabRow(selectedTabIndex=if(chapter==null)0 else catalog.chapters.indexOfFirst{it.id==chapter}+1,edgePadding=16.dp,containerColor=Color.Transparent){Tab(selected=chapter==null,onClick={chapter=null},text={Text("All lessons")});catalog.chapters.forEach{unit->Tab(selected=chapter==unit.id,onClick={chapter=unit.id},text={Text(unit.title.substringBefore(" ·").replace("Unit ","U"))})}}
  Row(Modifier.fillMaxWidth().padding(horizontal=18.dp,vertical=8.dp),horizontalArrangement=Arrangement.SpaceBetween){Text("${items.size} lessons",fontSize=12.sp,color=Color(0xFFAAB7CC));Text(if(member.owner)"Owner · ad-free Pro" else if(member.pro)"Pro · no ads" else "Saved lessons work without Wi-Fi",fontSize=12.sp,color=Gold)}
  TextButton(onClick=onGames,modifier=Modifier.fillMaxWidth()){Text("Practice games")}
  LazyVerticalGrid(columns=GridCells.Adaptive(165.dp),contentPadding=PaddingValues(16.dp),horizontalArrangement=Arrangement.spacedBy(12.dp),verticalArrangement=Arrangement.spacedBy(12.dp),modifier=Modifier.weight(1f)){items(items,key={it.id}){item->Card(onClick={onOpen(item)},shape=RoundedCornerShape(16.dp),modifier=Modifier.heightIn(min=145.dp)){Column(Modifier.padding(16.dp)){Text(item.id.padStart(2,'0'),color=Gold,fontSize=12.sp,fontWeight=FontWeight.Bold);Text(item.title,Modifier.padding(top=10.dp),fontSize=16.sp,fontWeight=FontWeight.SemiBold);Text(if(item.zones.isEmpty())"Interactive 3D" else "3D lesson + AR",Modifier.padding(top=12.dp),fontSize=11.sp,color=Color(0xFFAAB7CC))}}}}
  if(BuildConfig.DEBUG && !member.pro)TextButton(onClick=onToggleTest,modifier=Modifier.fillMaxWidth()){Text(if(testAds)"Hide Google test ad" else "Preview Google test ad · earns no revenue")}
 }
}
