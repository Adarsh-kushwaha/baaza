import AVFoundation
import Capacitor
import WebKit

/// The bridge view controller, plus what keeps music playing with the app backgrounded or the phone locked.
///
/// The music plays in cross-origin frames (usually YouTube embeds) that pause when their page turns
/// hidden. `keep-playing.js` makes every frame always report visible; the `audio` background mode in
/// Info.plist and the `.playback` session keep iOS from suspending the app while it plays.
class BaazaViewController: CAPBridgeViewController {
    override func webViewConfiguration(for instanceConfiguration: InstanceConfiguration) -> WKWebViewConfiguration {
        let configuration = super.webViewConfiguration(for: instanceConfiguration)
        if let url = Bundle.main.url(forResource: "keep-playing", withExtension: "js", subdirectory: "public"),
           let source = try? String(contentsOf: url, encoding: .utf8) {
            configuration.userContentController.addUserScript(
                WKUserScript(source: source, injectionTime: .atDocumentStart, forMainFrameOnly: false)
            )
        }
        return configuration
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        // Plays through the silent switch and keeps playing when locked; unlike `.ambient`, the default.
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
    }
}
