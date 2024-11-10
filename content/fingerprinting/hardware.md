---
title: Hardware Information
description: Physical characteristics and capabilities of your device.
icon: mdi:memory
sections:
  - title: How it Works
    icon: mdi:code-braces
    content: >
      Hardware fingerprinting involves collecting data about your device's physical components using web APIs. This includes CPU architecture, number of logical processors (accessible via `navigator.hardwareConcurrency`), approximate device memory (`navigator.deviceMemory`), graphics capabilities (via WebGL), and battery status (via the Battery Status API). By combining this information, trackers can create a unique profile of your hardware setup. Some of these APIs, like the Battery Status API, have been deprecated or restricted in modern browsers due to privacy concerns, but other methods can still reveal hardware details.

  - title: Privacy Implications
    icon: mdi:shield-alert
    content: >
      Hardware characteristics tend to remain consistent over time, making hardware fingerprinting a reliable method for persistent tracking. Since these attributes are less likely to change compared to software configurations, they can uniquely identify devices even when users clear cookies, use private browsing modes, or change their IP address. This persistent identification poses significant privacy risks, as it allows for long-term tracking without the user's consent.

  - title: Protection Strategies
    icon: mdi:shield-check
    items:
      - Use privacy-focused browsers like [Tor Browser](https://www.torproject.org/), which restricts access to hardware identifiers.
      - Configure your browser to limit or spoof hardware-related APIs. Extensions like [CanvasBlocker](https://addons.mozilla.org/en-US/firefox/addon/canvasblocker/) can help.
      - Use virtual machines or browser sandboxing to mask your actual hardware details.
      - Avoid using devices with rare or unique hardware configurations; using common hardware can help you blend in.
      - Regularly update your browser to benefit from the latest privacy protections.

  - title: Additional Resources
    icon: mdi:book-open-page-variant
    resources:
      - label: Understanding Navigator.hardwareConcurrency
        url: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/hardwareConcurrency
        icon: mdi:cpu-64-bit
      - label: Understanding Navigator.deviceMemory
        url: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory
        icon: mdi:memory
      - label: The Leaking Battery - A Privacy Analysis of the HTML5 Battery Status API
        url: https://eprint.iacr.org/2015/616.pdf
        icon: mdi:file-document
      - label: W3C - Battery Status API Specification
        url: https://www.w3.org/TR/battery-status/
        icon: mdi:battery
---
