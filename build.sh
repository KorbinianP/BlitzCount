#!/usr/bin/env bash
# BlitzCount Local Build Script
# Usage:
#   ./build.sh          -> Builds local Debug APK (default)
#   ./build.sh debug    -> Builds local Debug APK
#   ./build.sh release  -> Builds local Release APK (uses keystore if configured)
#   ./build.sh bundle   -> Builds Play Store Android App Bundle (.aab)
#   ./build.sh install  -> Builds & installs Debug APK to connected Android device via adb
#   ./build.sh serve    -> Runs local development HTTP server

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ANSI Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}==========================================================${NC}"
echo -e "${CYAN}               ⚡ BlitzCount Local Builder ⚡             ${NC}"
echo -e "${CYAN}==========================================================${NC}"

# Detect Java
if [ -z "$JAVA_HOME" ]; then
    if [ -d "$HOME/jdk-21" ]; then
        export JAVA_HOME="$HOME/jdk-21"
    elif [ -d "/usr/lib/jvm/java-21-openjdk-amd64" ]; then
        export JAVA_HOME="/usr/lib/jvm/java-21-openjdk-amd64"
    fi
fi
if [ -n "$JAVA_HOME" ] && [ -d "$JAVA_HOME/bin" ]; then
    export PATH="$JAVA_HOME/bin:$PATH"
fi

# Detect Android SDK
if [ -z "$ANDROID_HOME" ]; then
    if [ -d "$HOME/Android/Sdk" ]; then
        export ANDROID_HOME="$HOME/Android/Sdk"
    elif [ -d "$HOME/Library/Android/sdk" ]; then
        export ANDROID_HOME="$HOME/Library/Android/sdk"
    elif [ -d "/usr/lib/android-sdk" ]; then
        export ANDROID_HOME="/usr/lib/android-sdk"
    fi
fi
export ANDROID_SDK_ROOT="${ANDROID_HOME}"

check_env() {
    # Validate Java
    if ! command -v java &>/dev/null; then
        echo -e "${RED}[ERROR] 'java' command not found in PATH.${NC}"
        echo -e "Please install JDK 17 or JDK 21 (e.g. OpenJDK 21 or Android Studio JDK):"
        echo -e "  Ubuntu/Debian: sudo apt update && sudo apt install -y openjdk-21-jdk"
        echo -e "  macOS: brew install openjdk@21"
        echo -e "  Arch Linux: sudo pacman -S jdk21-openjdk"
        exit 1
    fi

    JAVA_VERSION_STR=$(java -version 2>&1 | head -n 1)
    echo -e "${GREEN}✓ Java:${NC} $JAVA_VERSION_STR"

    if [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME" ]; then
        echo -e "${GREEN}✓ Android SDK:${NC} $ANDROID_HOME"
    else
        echo -e "${YELLOW}! Android SDK not detected via ANDROID_HOME.${NC}"
        echo -e "  If the Gradle build fails, export ANDROID_HOME=/path/to/android-sdk"
    fi
}

# Ensure Gradle wrapper is executable
chmod +x "$SCRIPT_DIR/android/gradlew" 2>/dev/null || true

# Ensure output directory exists
mkdir -p "$SCRIPT_DIR/dist"

MODE="${1:-debug}"

case "$MODE" in
    debug|apk-debug)
        check_env
        echo -e "\n${CYAN}==> Building Debug APK...${NC}"
        cd "$SCRIPT_DIR/android"
        ./gradlew assembleDebug
        cd "$SCRIPT_DIR"
        
        cp "$SCRIPT_DIR/android/app/build/outputs/apk/debug/app-debug.apk" "$SCRIPT_DIR/dist/BlitzCount-debug.apk"
        echo -e "\n${GREEN}==========================================================${NC}"
        echo -e "${GREEN}✓ BUILD SUCCESSFUL!${NC}"
        echo -e "  Debug APK: ${CYAN}$SCRIPT_DIR/dist/BlitzCount-debug.apk${NC}"
        ls -lh "$SCRIPT_DIR/dist/BlitzCount-debug.apk"
        echo -e "${GREEN}==========================================================${NC}"
        ;;

    release|apk-release)
        check_env
        echo -e "\n${CYAN}==> Building Release APK...${NC}"
        if [ -z "$KEYSTORE_FILE" ] && [ -f "$SCRIPT_DIR/blitzcount-release.keystore" ]; then
            export KEYSTORE_FILE="$SCRIPT_DIR/blitzcount-release.keystore"
            echo -e "${GREEN}✓ Using local keystore:${NC} $KEYSTORE_FILE"
        fi

        cd "$SCRIPT_DIR/android"
        ./gradlew assembleRelease
        cd "$SCRIPT_DIR"

        if [ -f "$SCRIPT_DIR/android/app/build/outputs/apk/release/app-release.apk" ]; then
            cp "$SCRIPT_DIR/android/app/build/outputs/apk/release/app-release.apk" "$SCRIPT_DIR/dist/BlitzCount-release.apk"
            echo -e "\n${GREEN}==========================================================${NC}"
            echo -e "${GREEN}✓ SIGNED RELEASE BUILD SUCCESSFUL!${NC}"
            echo -e "  Release APK: ${CYAN}$SCRIPT_DIR/dist/BlitzCount-release.apk${NC}"
            ls -lh "$SCRIPT_DIR/dist/BlitzCount-release.apk"
            echo -e "${GREEN}==========================================================${NC}"
        elif [ -f "$SCRIPT_DIR/android/app/build/outputs/apk/release/app-release-unsigned.apk" ]; then
            cp "$SCRIPT_DIR/android/app/build/outputs/apk/release/app-release-unsigned.apk" "$SCRIPT_DIR/dist/BlitzCount-release-unsigned.apk"
            echo -e "\n${YELLOW}==========================================================${NC}"
            echo -e "${YELLOW}✓ UNSIGNED RELEASE BUILD SUCCESSFUL!${NC}"
            echo -e "  Unsigned APK: ${CYAN}$SCRIPT_DIR/dist/BlitzCount-release-unsigned.apk${NC}"
            echo -e "  (Provide KEYSTORE_PASSWORD / KEY_PASSWORD env vars to sign automatically)"
            ls -lh "$SCRIPT_DIR/dist/BlitzCount-release-unsigned.apk"
            echo -e "${YELLOW}==========================================================${NC}"
        fi
        ;;

    bundle|aab)
        check_env
        echo -e "\n${CYAN}==> Building Android App Bundle (.aab)...${NC}"
        if [ -z "$KEYSTORE_FILE" ] && [ -f "$SCRIPT_DIR/blitzcount-release.keystore" ]; then
            export KEYSTORE_FILE="$SCRIPT_DIR/blitzcount-release.keystore"
        fi

        cd "$SCRIPT_DIR/android"
        ./gradlew bundleRelease
        cd "$SCRIPT_DIR"

        cp "$SCRIPT_DIR/android/app/build/outputs/bundle/release/app-release.aab" "$SCRIPT_DIR/dist/BlitzCount.aab"
        echo -e "\n${GREEN}==========================================================${NC}"
        echo -e "${GREEN}✓ APP BUNDLE SUCCESSFUL!${NC}"
        echo -e "  AAB: ${CYAN}$SCRIPT_DIR/dist/BlitzCount.aab${NC}"
        ls -lh "$SCRIPT_DIR/dist/BlitzCount.aab"
        echo -e "${GREEN}==========================================================${NC}"
        ;;

    install)
        echo -e "\n${CYAN}==> Building & Installing to connected Android device...${NC}"
        "$0" debug
        if ! command -v adb &>/dev/null; then
            echo -e "${RED}[ERROR] 'adb' command not found in PATH.${NC}"
            exit 1
        fi
        echo -e "${CYAN}==> Running adb install...${NC}"
        adb install -r "$SCRIPT_DIR/dist/BlitzCount-debug.apk"
        echo -e "${GREEN}✓ Installed successfully on device!${NC}"
        echo -e "${CYAN}==> Launching app...${NC}"
        adb shell am start -n dev.kpdroid.blitzcount/.MainActivity || true
        ;;

    clean)
        echo -e "\n${CYAN}==> Cleaning build artifacts...${NC}"
        cd "$SCRIPT_DIR/android"
        ./gradlew clean
        cd "$SCRIPT_DIR"
        rm -rf "$SCRIPT_DIR/dist"
        echo -e "${GREEN}✓ Clean complete!${NC}"
        ;;

    serve)
        echo -e "\n${CYAN}==> Starting local test server at http://localhost:8080...${NC}"
        python3 server.py 8080
        ;;

    help|*)
        echo "Usage: ./build.sh [command]"
        echo ""
        echo "Commands:"
        echo "  debug       Build local Debug APK (default, no keystore needed)"
        echo "  release     Build Release APK (signed if keystore env vars present)"
        echo "  bundle      Build Play Store Android App Bundle (.aab)"
        echo "  install     Build Debug APK and install + launch on connected device"
        echo "  serve       Start local web server (http://localhost:8080)"
        echo "  clean       Clean Gradle build caches and outputs"
        echo "  help        Display this help message"
        ;;
esac
