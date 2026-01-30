// serviceWorker.js
// Backend-aligned version (no API caching, production-only)

const isProduction = process.env.NODE_ENV === "production";

/**
 * Register Service Worker
 * Enabled ONLY in production
 */
export function register() {
  if (!isProduction) {
    console.log("Service Worker disabled in development");
    return;
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log("Service Worker registered successfully");

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;

            if (!installingWorker) return;

            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  console.log(
                    "New content available. Refresh after closing all tabs."
                  );
                } else {
                  console.log("Content cached for offline use.");
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });
  }
}

/**
 * Unregister Service Worker
 * Used for development & debugging
 */
export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log("Service Worker unregistered");
      })
      .catch((error) => {
        console.error("Service Worker unregister failed:", error);
      });
  }
}
