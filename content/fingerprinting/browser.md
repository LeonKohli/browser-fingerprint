---
title: Browser Information
description: Detailed insights into your web browser and its capabilities.
icon: mdi:web
sections:
  - title: How it Works
    icon: mdi:code-braces
    content: >
      Browser fingerprinting collects various browser-specific attributes using JavaScript APIs. This includes the user agent string (~10 bits of entropy per AmIUnique), browser language settings (~3.9 bits), platform (~2.7 bits), cookie enablement status, Do Not Track preference (being deprecated), vendor information, and pdfViewerEnabled. Private browsing detection uses engine-specific techniques: Safari's IndexedDB Blob storage limitation (high confidence), Chromium's storage quota estimation (medium confidence, threatened by predictable-reported-quota flag), and Firefox where no reliable method exists since Firefox 138+ enabled ServiceWorkers in private mode. Note: navigator.plugins is now frozen/hardcoded in all modern browsers since ~2021 and provides zero distinguishing entropy — all browsers return the same 5 PDF-related plugins.

  - title: Privacy Implications
    icon: mdi:shield-alert
    content: >
      The combination of browser attributes creates a distinctive profile that can be used to identify and track your online activity. Even when using privacy features like VPNs or clearing cookies, these browser characteristics remain consistent and can be used to recognize your device across different websites and sessions.

  - title: Protection Strategies
    icon: mdi:shield-check
    items:
      - Use privacy-focused browsers like [Tor Browser](https://www.torproject.org/) or [Brave](https://brave.com/) that standardize browser fingerprints.
      - Enable privacy and tracking protection features in your browser settings.
      - Consider using browser extensions that modify or spoof browser information.
      - Regularly update your browser to benefit from the latest privacy enhancements.
      - Be cautious about installing browser plugins as they can make your fingerprint more unique.

  - title: Additional Resources
    icon: mdi:book-open-page-variant
    resources:
      - label: Navigator API Documentation
        url: https://developer.mozilla.org/en-US/docs/Web/API/Navigator
        icon: mdi:code-tags
      - label: User Agent Documentation
        url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
        icon: mdi:web
---
