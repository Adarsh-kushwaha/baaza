package app.baaza;

import android.os.Bundle;
import android.util.Log;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PlaybackPlugin.class);
        super.onCreate(savedInstanceState);
        keepFramesPlaying();

        // Capacitor sends every off-origin navigation to the system browser, including ones inside
        // the player's frame (a playlist site moving between its own pages); only the app's own
        // page should ever leave the app.
        bridge.setWebViewClient(new BridgeWebViewClient(bridge) {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return request.isForMainFrame() && super.shouldOverrideUrlLoading(view, request);
            }
        });
    }

    /**
     * Players such as YouTube's embed pause when their page turns hidden. keep-playing.js (shared with
     * iOS, copied from native/www) makes every frame, cross-origin ones included, always report visible.
     */
    private void keepFramesPlaying() {
        if (!WebViewFeature.isFeatureSupported(WebViewFeature.DOCUMENT_START_SCRIPT)) return;
        try (InputStream in = getAssets().open("public/keep-playing.js")) {
            ByteArrayOutputStream bytes = new ByteArrayOutputStream();
            byte[] chunk = new byte[4096];
            for (int n; (n = in.read(chunk)) != -1; ) bytes.write(chunk, 0, n);
            String script = bytes.toString(StandardCharsets.UTF_8.name());
            WebViewCompat.addDocumentStartJavaScript(bridge.getWebView(), script, Collections.singleton("*"));
        } catch (IOException e) {
            Log.e("Baaza", "keep-playing.js missing; run `npx cap sync`", e);
        }
    }
}
