/**
 * Helper to handle external links on mobile devices and hybrid environments (like Android WebViews/PWAs).
 * Prevents external links from loading inside the app's WebView (which traps the user)
 * and instead forces them to open in the native system browser or corresponding native app.
 */
export const openExternalLink = (e: React.MouseEvent<HTMLAnchorElement> | null, url: string) => {
    if (e) {
        e.preventDefault();
    }

    const userAgent = navigator.userAgent || '';
    const isAndroid = /Android/i.test(userAgent);

    if (isAndroid) {
        // 1. Google Play Store Links
        if (url.includes('play.google.com/store/apps/details')) {
            try {
                const urlObj = new URL(url);
                const appId = urlObj.searchParams.get('id') || 'com.dev12three.qrantop';
                window.location.href = `market://details?id=${appId}`;
                return;
            } catch (err) {
                window.location.href = `market://details?id=com.dev12three.qrantop`;
                return;
            }
        }

        // 2. Telegram Links
        if (url.includes('t.me/')) {
            const parts = url.split('t.me/');
            const username = parts[1]?.split('?')[0];
            if (username) {
                // Use intent to force opening the Telegram app or system browser
                window.location.href = `intent://t.me/${username}#Intent;scheme=https;end`;
                return;
            }
        }

        // 3. General HTTP/HTTPS links
        if (url.startsWith('http://') || url.startsWith('https://')) {
            const urlWithoutProtocol = url.replace(/^https?:\/\//, '');
            const scheme = url.startsWith('https://') ? 'https' : 'http';
            // Android intent:// scheme instructs the OS to open the default web browser (e.g., Chrome)
            window.location.href = `intent://${urlWithoutProtocol}#Intent;scheme=${scheme};end`;
            return;
        }
    }

    // Default fallback: Desktop, iOS, or standard mobile browsers with proper security attributes
    window.open(url, '_blank', 'noopener,noreferrer');
};
