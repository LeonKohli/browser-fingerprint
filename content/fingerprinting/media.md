---
title: Media Capabilities
description: Analysis of your device's audio and visual processing features.
icon: mdi:harddisk
sections:
  - title: How it Works
    icon: mdi:code-braces
    content: >
      Media fingerprinting in this implementation focuses on two main aspects: Canvas and Audio fingerprinting. Canvas fingerprinting works by drawing specific text, shapes, and colors using the HTML5 Canvas element and converting the result to a data URL. The subtle differences in how devices render these elements create a unique fingerprint. Audio fingerprinting uses the Web Audio API to create and process audio signals through an oscillator and compressor, analyzing the resulting audio data to generate a unique hash based on how your device processes audio.

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
