package com.asawera.chemistry
import org.junit.Assert.*
import org.junit.Test
class AdsPolicyTest {
 private val free=MemberState(checked=true,online=true,regionEligible=true,mobileApproved=true)
 @Test fun ownerAndProNeverRequestAds(){assertFalse(AdsPolicy.eligible(free.copy(owner=true),true,true));assertFalse(AdsPolicy.eligible(free.copy(pro=true),true,true))}
 @Test fun offlineAndFailedMembershipNeverRequestAds(){assertFalse(AdsPolicy.eligible(free.copy(online=false),true,true));assertFalse(AdsPolicy.eligible(free.copy(checked=false),true,true));assertFalse(AdsPolicy.eligible(free.copy(regionEligible=false),true,true))}
 @Test fun paidAdsRequireActualApproval(){assertTrue(AdsPolicy.eligible(free,true,false));assertFalse(AdsPolicy.eligible(free.copy(mobileApproved=false),true,false));assertFalse(AdsPolicy.eligible(free,false,false))}
 @Test fun explicitTestPreviewNeverClaimsProductionReadiness(){assertTrue(AdsPolicy.eligible(free.copy(mobileApproved=false),false,true));assertFalse(AdsPolicy.eligible(MemberState(),false,true))}
}
