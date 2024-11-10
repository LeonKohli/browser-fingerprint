---
title: Media Capabilities
description: Analysis of your device's audio and visual processing features.
icon: mdi:harddisk
sections:
  - title: How it Works
    icon: mdi:code-braces
    content: >
      Media fingerprinting leverages the subtle differences in how devices process multimedia content to create unique identifiers. Techniques such as Canvas fingerprinting and AudioContext fingerprinting involve rendering graphics or processing audio signals and analyzing the output for variations caused by hardware, software, and driver differences. In Canvas fingerprinting, scripts draw hidden images or text using the HTML5 canvas element and extract the rendering data (hashes of the image data). Variations in anti-aliasing, font rendering, and GPU capabilities lead to unique outputs. Similarly, AudioContext fingerprinting generates and processes audio signals through the Web Audio API and analyzes the resulting audio data, which can differ due to hardware and software audio stack differences.

  - title: Privacy Implications
    icon: mdi:shield-alert
    content: >
      Media fingerprinting is especially concerning because it operates silently in the background, often without any visual indicators or the need for user interaction. Since it relies on inherent properties of how a device processes media, it is difficult to prevent without affecting legitimate functionality. These techniques can uniquely identify your device even when traditional privacy measures, such as clearing cookies, using VPNs, or employing private browsing modes, are in place. This makes media fingerprinting a potent tool for persistent tracking.

  - title: Protection Strategies
    icon: mdi:shield-check
    items:
      - Use privacy-focused browsers like [Tor Browser](https://www.torproject.org/), which includes built-in defenses against canvas and audio fingerprinting.
      - Install browser extensions like [CanvasBlocker](https://addons.mozilla.org/en-US/firefox/addon/canvasblocker/) to prevent or spoof canvas and audio fingerprinting attempts.
      - Use script-blocking extensions like [NoScript](https://noscript.net/) or [uMatrix](https://github.com/gorhill/uMatrix) to prevent fingerprinting scripts from running.
      - Disable or limit access to WebGL and the Canvas API in your browser settings or via extensions, bearing in mind that this may affect website functionality.
      - Regularly update your browser and extensions to benefit from the latest privacy protections.

  - title: Additional Resources
    icon: mdi:book-open-page-variant
    resources:
      - label: Web Audio API Documentation
        url: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
        icon: mdi:volume-high
      - label: Understanding Canvas Fingerprinting
        url: https://browserleaks.com/canvas
        icon: mdi:monitor-screenshot
---
