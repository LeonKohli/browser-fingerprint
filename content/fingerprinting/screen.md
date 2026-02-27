---
title: Screen Information
description: Details about your device's display properties and configurations.
icon: mdi:monitor
sections:
  - title: How it Works
    icon: mdi:code-braces
    content: >
      Screen fingerprinting collects display characteristics using JavaScript's Screen API (~4.4 bits per AmIUnique). This includes screen width and height (sorted descending for rotation independence — so portrait and landscape return the same values), color depth, device pixel ratio (display scaling), and screen orientation. Window dimensions are intentionally excluded from the fingerprint as they change on every resize and would destabilize the hash.

  - title: Privacy Implications
    icon: mdi:shield-alert
    content: >
      Screen properties can be surprisingly revealing about your device type and setup. Unusual screen resolutions, non-standard pixel ratios, or specific orientations can make your device more identifiable. This information, combined with other fingerprinting data, helps create a more unique profile of your device.

  - title: Protection Strategies
    icon: mdi:shield-check
    items:
      - Use common screen resolutions and standard scaling settings when possible.
      - Consider using browser extensions that can spoof screen properties.
      - Be aware that changing display settings might affect your device's fingerprint.
      - Use privacy-focused browsers that standardize or limit screen information exposure.
      - Consider the impact of multi-monitor setups on your fingerprint uniqueness.

  - title: Additional Resources
    icon: mdi:book-open-page-variant
    resources:
      - label: Screen API Documentation
        url: https://developer.mozilla.org/en-US/docs/Web/API/Screen
        icon: mdi:code-tags
      - label: Window.devicePixelRatio Documentation
        url: https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
        icon: mdi:monitor
---
