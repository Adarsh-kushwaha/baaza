package app.baaza;

import android.Manifest;
import android.content.Intent;
import android.os.Build;
import androidx.core.content.ContextCompat;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

/** Called from lib/background-audio.ts while a player is open: keeps the app alive in the background. */
@CapacitorPlugin(
    name = "Playback",
    permissions = { @Permission(alias = "notifications", strings = { Manifest.permission.POST_NOTIFICATIONS }) }
)
public class PlaybackPlugin extends Plugin {

    @PluginMethod
    public void start(PluginCall call) {
        Intent intent = new Intent(getContext(), PlaybackService.class)
            .putExtra(PlaybackService.EXTRA_TITLE, call.getString("title", "Baaza"))
            .putExtra(PlaybackService.EXTRA_ARTIST, call.getString("artist", ""));
        ContextCompat.startForegroundService(getContext(), intent);

        // The service runs either way; without the permission (Android 13+) its notification is just hidden.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && getPermissionState("notifications") == PermissionState.PROMPT) {
            requestPermissionForAlias("notifications", call, "onNotificationsAnswered");
        } else {
            call.resolve();
        }
    }

    @PermissionCallback
    private void onNotificationsAnswered(PluginCall call) {
        call.resolve();
    }

    @PluginMethod
    public void stop(PluginCall call) {
        getContext().stopService(new Intent(getContext(), PlaybackService.class));
        call.resolve();
    }
}
