package com.asawera.chemistry
data class MemberState(val checked:Boolean=false,val pro:Boolean=false,val owner:Boolean=false,val regionEligible:Boolean=false,val online:Boolean=false,val mobileApproved:Boolean=false,val bannerUnit:String="",val interstitialUnit:String="",val ageTreatment:Int=1)
object AdsPolicy { fun eligible(member:MemberState,live:Boolean,test:Boolean):Boolean = member.checked && member.online && member.regionEligible && !member.pro && !member.owner && ((live && member.mobileApproved) || test) }
