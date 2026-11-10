import java.util.Properties
import java.io.FileInputStream

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
        versionCode = 8
        versionName = "1.8.1-beta.6"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    val keystorePropsFile = rootProject.file("keystore.properties").takeIf { it.exists() }
        ?: file("keystore.properties").takeIf { it.exists() }
    val keystoreProperties = Properties().apply {
        keystorePropsFile?.let { load(FileInputStream(it)) }
    }

    signingConfigs {
        create("release") {
            val storeFilePath = keystoreProperties.getProperty("storeFile")
                ?: System.getenv("KEYSTORE_FILE")
            val storePass = keystoreProperties.getProperty("storePassword")
                ?: System.getenv("KEYSTORE_PASSWORD")
            val alias = keystoreProperties.getProperty("keyAlias")
                ?: System.getenv("KEY_ALIAS")
            val keyPass = keystoreProperties.getProperty("keyPassword")
                ?: System.getenv("KEY_PASSWORD")

            if (!storeFilePath.isNullOrEmpty() && file(storeFilePath).exists() &&
                !storePass.isNullOrEmpty() && !alias.isNullOrEmpty() && !keyPass.isNullOrEmpty()) {
                storeFile = file(storeFilePath)
                storePassword = storePass
                keyAlias = alias
                keyPassword = keyPass
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
            if (releaseSigning.storeFile != null && !releaseSigning.storePassword.isNullOrEmpty()) {
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
