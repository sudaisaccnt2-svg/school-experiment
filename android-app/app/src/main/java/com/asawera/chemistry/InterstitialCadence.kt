package com.asawera.chemistry
class InterstitialCadence(startedAt:Long){
 private var lastShown=startedAt
 private var completed=0
 fun lessonExit(durationMs:Long,now:Long):Boolean{
  if(durationMs>=30000)completed++
  return durationMs>=30000 && completed>=2 && now-lastShown>=300000
 }
 fun shown(now:Long){lastShown=now;completed=0}
}
