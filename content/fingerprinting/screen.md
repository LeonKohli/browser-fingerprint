---
title: Screen Information
description: Details about your device's display properties and configurations.
icon: mdi:monitor
sections:
  - title: How it Works
    icon: mdi:code-braces
    content: >
      Screen fingerprinting in this implementation collects basic display characteristics using JavaScript's Screen API. This includes screen width and height, color depth, device pixel ratio (which indicates display scaling), and screen orientation. These properties are accessed directly through the window.screen object and related browser APIs.

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
