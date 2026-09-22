/*
 * Injected by the native shells into every frame, cross-origin ones included, before any page script
 * runs (iOS: WKUserScript at document start; Android: WebViewCompat.addDocumentStartJavaScript).
 *
 * Players such as YouTube's embed pause themselves when the page reports it is hidden, which is what
 * happens when the phone locks or the app goes to the background. Pages here always report visible,
 * and the change event never reaches them, so the music keeps going.
 */
(function () {
  var visible = { get: function () { return "visible"; }, configurable: true };
  var shown = { get: function () { return false; }, configurable: true };
  Object.defineProperty(Document.prototype, "visibilityState", visible);
  Object.defineProperty(Document.prototype, "webkitVisibilityState", visible);
  Object.defineProperty(Document.prototype, "hidden", shown);
  Object.defineProperty(Document.prototype, "webkitHidden", shown);

  // Registered before any page script, so this capture listener on window runs first.
  var swallow = function (event) { event.stopImmediatePropagation(); };
  window.addEventListener("visibilitychange", swallow, true);
  window.addEventListener("webkitvisibilitychange", swallow, true);
})();
