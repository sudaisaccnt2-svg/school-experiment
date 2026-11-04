import java.util.Properties

plugins { id("com.android.application"); id("org.jetbrains.kotlin.plugin.compose") }
val signingProperties = Properties().apply {
    val file = rootProject.file("private-signing/signing.properties")
    if (file.exists()) file.inputStream().use { load(it) }
}
android {
    namespace = "com.asawera.chemistry"
    compileSdk = 37
    defaultConfig {
        applicationId = "com.asawera.chemistry"
        minSdk = 26
        targetSdk = 36
        versionCode = 2
        versionName = "1.0.1"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        manifestPlaceholders["admobAppId"] = providers.gradleProperty("admobAppId").getOrElse("ca-app-pub-3940256099942544~3347511713")
        buildConfigField("String", "MOBILE_APP_ID", "\"${manifestPlaceholders["admobAppId"]}\"")
        buildConfigField("String", "SITE_URL", "\"https://asawera-chemistry-51y.pages.dev\"")
        buildConfigField("String", "BANNER_UNIT", "\"${providers.gradleProperty("admobBannerId").getOrElse("ca-app-pub-3940256099942544/9214589741")}\"")
        buildConfigField("String", "INTERSTITIAL_UNIT", "\"${providers.gradleProperty("admobInterstitialId").getOrElse("ca-app-pub-3940256099942544/1033173712")}\"")
        buildConfigField("boolean", "LIVE_ADS", providers.gradleProperty("liveAds").getOrElse("false"))
    }
    buildFeatures { compose = true; buildConfig = true }
    signingConfigs {
        if (signingProperties.isNotEmpty()) create("owner") {
            storeFile = rootProject.file("private-signing/asawera.p12")
            storePassword = signingProperties.getProperty("password")
            keyAlias = "asawera"
            keyPassword = signingProperties.getProperty("password")
        }
    }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
    buildTypes {
        release {
            isMinifyEnabled = true
            ndk { abiFilters += providers.gradleProperty("releaseAbis").getOrElse("arm64-v8a").split(",") }
            if (signingProperties.isNotEmpty()) signingConfig = signingConfigs.getByName("owner")
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
    packaging { resources.excludes += setOf("META-INF/AL2.0", "META-INF/LGPL2.1", "META-INF/LICENSE*", "META-INF/NOTICE*") }
}
kotlin { compilerOptions { jvmTarget = org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17 } }
dependencies {
    implementation(platform("androidx.compose:compose-bom:2026.06.01"))
    implementation("androidx.activity:activity-compose:1.13.0")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.10.0")
    implementation("androidx.webkit:webkit:1.15.0")
    implementation("io.github.sceneview:arsceneview:4.37.0")
    implementation("com.google.android.gms:play-services-ads:25.5.0")
    implementation("com.google.android.ump:user-messaging-platform:4.0.0")
    implementation("com.android.billingclient:billing:9.1.0")
    debugImplementation("androidx.compose.ui:ui-tooling")
    androidTestImplementation("androidx.test.ext:junit:1.3.0")
    androidTestImplementation("androidx.test:runner:1.7.0")
    androidTestImplementation("androidx.test.uiautomator:uiautomator:2.4.0")
    testImplementation("junit:junit:4.13.2")
}
