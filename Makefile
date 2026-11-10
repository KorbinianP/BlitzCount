.PHONY: help debug release bundle aab install install-rel run serve clean check-env

SHELL := /bin/bash
ROOT_DIR := $(shell pwd)
GRADLEW := $(ROOT_DIR)/android/gradlew

# Auto-detect ANDROID_HOME if not set
export ANDROID_HOME ?= $(shell if [ -d "$$HOME/Android/Sdk" ]; then echo "$$HOME/Android/Sdk"; elif [ -d "$$HOME/Library/Android/sdk" ]; then echo "$$HOME/Library/Android/sdk"; elif [ -d "/usr/lib/android-sdk" ]; then echo "/usr/lib/android-sdk"; fi)
export ANDROID_SDK_ROOT ?= $(ANDROID_HOME)

# Keystore defaults for local release signing if blitzcount-release.keystore exists
ifneq ("$(wildcard $(ROOT_DIR)/blitzcount-release.keystore)","")
  export KEYSTORE_FILE ?= $(ROOT_DIR)/blitzcount-release.keystore
endif

help:
	@echo "=========================================================="
	@echo "               ⚡ BlitzCount Build System ⚡               "
	@echo "=========================================================="
	@echo "Commands:"
	@echo "  make debug         Build local Debug APK (no signing needed)"
	@echo "  make release       Build signed Release APK (uses keystore if configured)"
	@echo "  make bundle        Build Play Store Bundle (AAB)"
	@echo "  make install       Build & install Debug APK on connected device (adb)"
	@echo "  make install-rel   Build & install Release APK on connected device (adb)"
	@echo "  make run           Launch BlitzCount on connected device"
	@echo "  make serve         Start local development web server (port 8080)"
	@echo "  make clean         Clean build artifacts and Gradle caches"
	@echo "  make check-env     Check local Java, Android SDK, and adb setup"
	@echo "=========================================================="

check-env:
	@echo "Checking local build environment..."
	@which java >/dev/null 2>&1 && echo "  [OK] Java: $$(java -version 2>&1 | head -n 1)" || echo "  [MISSING] Java (JDK 17 or 21 required)"
	@if [ -n "$$ANDROID_HOME" ] && [ -d "$$ANDROID_HOME" ]; then echo "  [OK] Android SDK: $$ANDROID_HOME"; else echo "  [MISSING] Android SDK (set ANDROID_HOME or install Android Studio)"; fi
	@which adb >/dev/null 2>&1 && echo "  [OK] adb: $$(adb version 2>/dev/null | head -n 1)" || echo "  [OPTIONAL] adb not found in PATH"

debug: check-env
	@echo "==> Building Debug APK..."
	@chmod +x $(GRADLEW)
	@cd android && ./gradlew assembleDebug
	@mkdir -p dist
	@cp android/app/build/outputs/apk/debug/app-debug.apk dist/BlitzCount-debug.apk
	@echo "==> SUCCESS: Built Debug APK:"
	@ls -lh dist/BlitzCount-debug.apk

release: check-env
	@echo "==> Building Release APK..."
	@chmod +x $(GRADLEW)
	@cd android && ./gradlew assembleRelease
	@mkdir -p dist
	@if [ -f android/app/build/outputs/apk/release/app-release.apk ]; then \
		cp android/app/build/outputs/apk/release/app-release.apk dist/BlitzCount-release.apk; \
		echo "==> SUCCESS: Built Release APK:"; \
		ls -lh dist/BlitzCount-release.apk; \
	elif [ -f android/app/build/outputs/apk/release/app-release-unsigned.apk ]; then \
		cp android/app/build/outputs/apk/release/app-release-unsigned.apk dist/BlitzCount-release-unsigned.apk; \
		echo "==> SUCCESS: Built Unsigned Release APK:"; \
		ls -lh dist/BlitzCount-release-unsigned.apk; \
	fi

bundle: aab
aab: check-env
	@echo "==> Building Android App Bundle (AAB)..."
	@chmod +x $(GRADLEW)
	@cd android && ./gradlew bundleRelease
	@mkdir -p dist
	@cp android/app/build/outputs/bundle/release/app-release.aab dist/BlitzCount.aab
	@echo "==> SUCCESS: Built App Bundle:"
	@ls -lh dist/BlitzCount.aab

install: debug
	@echo "==> Installing Debug APK on connected device via adb..."
	adb install -r dist/BlitzCount-debug.apk

install-rel: release
	@echo "==> Installing Release APK on connected device via adb..."
	adb install -r dist/BlitzCount-release.apk

run:
	@echo "==> Launching BlitzCount on connected device..."
	adb shell am start -n dev.kpdroid.blitzcount/.MainActivity

serve:
	@echo "==> Starting BlitzCount Web Server at http://localhost:8080..."
	python3 server.py 8080

clean:
	@echo "==> Cleaning build outputs..."
	@chmod +x $(GRADLEW)
	@cd android && ./gradlew clean
	@rm -rf dist/
	@echo "==> Clean complete."
