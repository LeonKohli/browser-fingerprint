---
title: Screen Information
description: Details about your device's display properties and configurations.
icon: mdi:monitor
sections:
  - title: How it Works
    icon: mdi:code-braces
    content: >
      Screen fingerprinting collects information about your device's display characteristics using JavaScript APIs. This includes screen resolution (`screen.width` and `screen.height`), available screen size (`screen.availWidth` and `screen.availHeight`), color depth (`screen.colorDepth`), device pixel ratio (`window.devicePixelRatio`), and screen orientation (`window.screen.orientation`). It may also involve detecting multi-monitor setups. These attributes can vary widely among users, especially with the proliferation of different device types (e.g., smartphones, tablets, high-resolution monitors, multi-monitor setups), and can contribute to creating a unique device fingerprint.

  - title: Privacy Implications
    icon: mdi:shield-alert
    content: >
      Unique or uncommon screen configurations can significantly increase the uniqueness of your device's fingerprint. Users with high-resolution displays, non-standard aspect ratios, custom scaling settings, or multi-monitor setups are more easily distinguished from others. Even when combined with other common attributes, screen properties can enhance the distinctiveness of a fingerprint, aiding in persistent tracking across sessions and websites.

  - title: Protection Strategies
    icon: mdi:shield-check
    items:
      - Use common screen resolutions and default scaling settings to blend in with the majority of users.
      - Avoid maximizing your browser window; instead, use standard window sizes to prevent exposing your actual screen size.
      - Install browser extensions that spoof or block access to screen properties, such as [Chameleon](https://github.com/sereneblue/chameleon) or [CanvasBlocker](https://addons.mozilla.org/en-US/firefox/addon/canvasblocker/).
      - Configure your browser's privacy settings to limit or obfuscate screen-related information.
      - Use virtual machines or sandboxed environments with default display settings to mask your actual screen configuration.

  - title: Additional Resources
    icon: mdi:book-open-page-variant
    resources:
      - label: Screen Interface Documentation
        url: https://developer.mozilla.org/en-US/docs/Web/API/Screen
        icon: mdi:code-tags
      - label: W3C - CSSOM View Module
        url: https://www.w3.org/TR/cssom-view/
        icon: mdi:web
---
