---
title: Media Capabilities
description: Analysis of your device's audio and visual processing features.
icon: mdi:harddisk
sections:
  - title: How it Works
    icon: mdi:code-braces
    content: >
      Media fingerprinting focuses on two main aspects: Canvas and Audio fingerprinting. Canvas fingerprinting renders text with emoji (platform-specific rendering), geometry with multiply blending (GPU-dependent color mixing), and tests evenodd winding rules. A stability check (double-render comparison) detects anti-fingerprinting noise injection. Based on the FingerprintJS v5 approach, canvas provides ~8.28 bits of entropy (AmIUnique, Laperdrix 2016). Audio fingerprinting uses the Web Audio API to process a 10kHz triangle wave through a dynamics compressor, hashing only the steady-state samples (last 500 of 5000) for stability. Research by Chalise et al. (2022) found only 95 distinct audio fingerprint values across 2093 users (~6.5 bits), but it adds ~9.6% uniqueness when combined with canvas. Note: Safari 17+ and Firefox 120+ have introduced anti-fingerprinting noise for canvas; our stability check detects this and marks results as unstable.

  - title: Privacy Implications
    icon: mdi:shield-alert
    content: >
      Canvas and Audio fingerprinting are particularly powerful tracking methods because they capture hardware-level differences in how your device processes media. These techniques work silently in the background and can identify your device even when using private browsing or clearing cookies. The fingerprints generated are highly reliable as they depend on your device's hardware and software configuration, which typically doesn't change frequently.

  - title: Protection Strategies
    icon: mdi:shield-check
    items:
      - Use browsers with built-in Canvas/Audio fingerprinting protection like Tor Browser or Brave.
      - Install extensions like [CanvasBlocker](https://addons.mozilla.org/en-US/firefox/addon/canvasblocker/) to prevent or spoof canvas fingerprinting.
      - Consider using script-blocking extensions like [uBlock Origin](https://github.com/gorhill/uBlock) to control which sites can access Canvas and Audio APIs.
      - Keep your browser updated to benefit from the latest privacy protections.
      - Be aware that blocking these APIs completely may break some website functionality.

  - title: Additional Resources
    icon: mdi:book-open-page-variant
    resources:
      - label: Canvas API Documentation
        url: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
        icon: mdi:code-tags
      - label: Web Audio API Documentation
        url: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
        icon: mdi:volume-high
---
