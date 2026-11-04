package com.asawera.chemistry
import org.junit.Assert.*
import org.junit.Test
class InterstitialCadenceTest{
 @Test fun requiresTwoViewedLessonsAndFiveMinutes(){val cadence=InterstitialCadence(0);assertFalse(cadence.lessonExit(5000,300000));assertFalse(cadence.lessonExit(30000,120000));assertFalse(cadence.lessonExit(30000,240000));assertTrue(cadence.lessonExit(30000,360000))}
 @Test fun showingAnAdRestartsBothLimits(){val cadence=InterstitialCadence(0);cadence.lessonExit(120000,180000);assertTrue(cadence.lessonExit(120000,360000));cadence.shown(360000);assertFalse(cadence.lessonExit(120000,660000));assertTrue(cadence.lessonExit(120000,780000))}
}
