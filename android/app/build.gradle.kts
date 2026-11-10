plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "dev.kpdroid.blitzcount"
    compileSdk = 36

    defaultConfig {
        applicationId = "dev.kpdroid.blitzcount"
        minSdk = 26
        targetSdk = 36
        versionCode = 3
        versionName = "1.8.1-beta.1"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    signingConfigs {
        create("release") {
            val keystoreFile = System.getenv("KEYSTORE_FILE")
            if (!keystoreFile.isNullOrEmpty() && file(keystoreFile).exists()) {
                storeFile = file(keystoreFile)
                storePassword = System.getenv("KEYSTORE_PASSWORD")
                keyAlias = System.getenv("KEY_ALIAS")
                keyPassword = System.getenv("KEY_PASSWORD")
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            val releaseSigning = signingConfigs.getByName("release")
            if (releaseSigning.storeFile != null) {
                signingConfig = releaseSigning
            }
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        buildConfig = false
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.webkit:webkit:1.12.1")
}

// Automatically sync web files from repository root into Android assets before build
val syncWebAssets = tasks.register<Copy>("syncWebAssets") {
    description = "Sync web application assets into Android app assets directory"
    from("${project.rootDir}/..") {
        include("index.html")
        include("manifest.webmanifest")
        include("sw.js")
        include("css/**")
        include("js/**")
        include("assets/**")
    }
    into("${project.projectDir}/src/main/assets")
}

tasks.named("preBuild") {
    dependsOn(syncWebAssets)
}
