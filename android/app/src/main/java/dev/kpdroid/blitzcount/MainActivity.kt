package dev.kpdroid.blitzcount

import android.annotation.SuppressLint
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.FrameLayout
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var cachedSafeTopDp = 58
    private var cachedSafeBottomDp = 16
    private var cachedSafeLeftDp = 0
    private var cachedSafeRightDp = 0

    private fun applyCssInsets() {
        if (!::webView.isInitialized) return
        webView.evaluateJavascript(
            "document.documentElement.style.setProperty('--safe-top', '${cachedSafeTopDp}px');" +
            "document.documentElement.style.setProperty('--safe-bottom', '${cachedSafeBottomDp}px');" +
            "document.documentElement.style.setProperty('--safe-left', '${cachedSafeLeftDp}px');" +
            "document.documentElement.style.setProperty('--safe-right', '${cachedSafeRightDp}px');",
            null
        )
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Allow drawing around cutouts on API 28+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            window.attributes.layoutInDisplayCutoutMode =
                WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
        }

        // Enable edge-to-edge / sticky immersive mode for kid-friendly full screen
        setupImmersiveMode()

        // Root container: FrameLayout respects view padding, whereas WebView overrides setPadding
        // and does not inset its HTML canvas.
        val container = FrameLayout(this).apply {
            id = View.generateViewId()
            setBackgroundColor(0xFFFFFDF8.toInt()) // Matches BlitzCount --bg-gradient warm tint
        }

        webView = WebView(this).apply {
            id = View.generateViewId()
            setBackgroundColor(0xFFFFFDF8.toInt())
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        }
        container.addView(webView)
        setContentView(container)

        // Edge-to-edge canvas: WebView spans 100% of physical display without letterboxing,
        // while safe insets are delivered dynamically to CSS so game controls sit safely below cutouts.
        val insetsListener = androidx.core.view.OnApplyWindowInsetsListener { _, windowInsets ->
            val cutoutInsets = windowInsets.getInsets(
                WindowInsetsCompat.Type.displayCutout() or WindowInsetsCompat.Type.systemBars()
            )
            val density = resources.displayMetrics.density
            val minTopPx = (58 * density).toInt()
            val extraTopPx = (12 * density).toInt()
            cachedSafeTopDp = (maxOf(cutoutInsets.top + (if (cutoutInsets.top > 0) extraTopPx else 0), minTopPx) / density).toInt()
            cachedSafeBottomDp = (maxOf(cutoutInsets.bottom, (16 * density).toInt()) / density).toInt()
            cachedSafeLeftDp = (cutoutInsets.left / density).toInt()
            cachedSafeRightDp = (cutoutInsets.right / density).toInt()

            applyCssInsets()
            windowInsets
        }
        ViewCompat.setOnApplyWindowInsetsListener(container, insetsListener)
        ViewCompat.setOnApplyWindowInsetsListener(webView, insetsListener)

        // Secure offline asset loader: maps app assets to https://appassets.androidplatform.net/assets/
        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView.webViewClient = object : WebViewClientCompat() {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? {
                return assetLoader.shouldInterceptRequest(request.url)
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                applyCssInsets()
            }
        }

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = false
            allowContentAccess = false
            // Allow Web Audio API chimes to play cleanly without blocking on user gesture
            mediaPlaybackRequiresUserGesture = false
            cacheMode = WebSettings.LOAD_DEFAULT
            useWideViewPort = true
            loadWithOverviewMode = true
        }

        webView.addJavascriptInterface(AndroidBridge(), "AndroidBridge")

        // Handle Android back button: delegates to Web App router (exits game to home, closes modal, confirms app exit)
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                webView.evaluateJavascript("typeof window.handleAndroidBack === 'function' ? window.handleAndroidBack() : false") { result ->
                    val handled = result == "true"
                    if (!handled) {
                        isEnabled = false
                        onBackPressedDispatcher.onBackPressed()
                    }
                }
            }
        })

        // Load the bundled offline web app
        webView.loadUrl("https://appassets.androidplatform.net/assets/index.html")
    }

    inner class AndroidBridge {
        @android.webkit.JavascriptInterface
        fun exitApp() {
            runOnUiThread {
                finish()
            }
        }
    }

    private fun setupImmersiveMode() {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        val insetsController = WindowCompat.getInsetsController(window, window.decorView)
        insetsController.systemBarsBehavior =
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        insetsController.hide(WindowInsetsCompat.Type.systemBars())
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
        setupImmersiveMode()
        applyCssInsets()
    }

    override fun onPause() {
        webView.onPause()
        super.onPause()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
