package com.asawera.chemistry

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.google.ar.core.Anchor
import com.google.ar.core.Plane
import com.google.ar.core.TrackingState
import io.github.sceneview.*
import io.github.sceneview.ar.*
import io.github.sceneview.ar.node.AnchorNode
import io.github.sceneview.node.ModelNode

@Composable
fun ArViewer(zone:ArZone,modifier:Modifier=Modifier) {
    var anchor by remember(zone.asset){ mutableStateOf<Anchor?>(null) }
    var issue by remember { mutableStateOf<String?>(null) }
    val engine=rememberEngine();val modelLoader=rememberModelLoader(engine)
    val model=rememberModelInstance(modelLoader,zone.asset)
    Box(modifier){
        ARSceneView(modifier=Modifier.fillMaxSize(),engine=engine,modelLoader=modelLoader,planeRenderer=true,
            onSessionFailed={ issue=it.message ?: "AR could not start on this device." },
            onSessionUpdated={ _,frame ->
                if(anchor==null && model!=null){
                    val plane=frame.getUpdatedTrackables(Plane::class.java).firstOrNull { it.trackingState==TrackingState.TRACKING && it.type==Plane.Type.HORIZONTAL_UPWARD_FACING }
                    if(plane!=null)runCatching { plane.createAnchor(plane.centerPose) }.onSuccess { anchor=it }
                }
            }){
            anchor?.let { placed ->AnchorNode(anchor=placed){ model?.let { ModelNode(modelInstance=it,scaleToUnits=0.7f,isEditable=true) } } }
        }
        Card(Modifier.align(Alignment.TopCenter).padding(16.dp)) { Text(issue ?: if(model==null) "Loading your saved AR scene…" else if(anchor==null) "Move your phone slowly over a table or floor." else "Pinch to resize. Drag to move the model.",Modifier.padding(16.dp)) }
        if(anchor!=null)Button(onClick={anchor?.detach();anchor=null},modifier=Modifier.align(Alignment.BottomCenter).padding(24.dp)){Text("Place again")}
    }
    DisposableEffect(Unit){onDispose { anchor?.detach() }}
}
