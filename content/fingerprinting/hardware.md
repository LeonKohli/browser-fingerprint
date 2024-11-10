---
title: Hardware Information
description: Physical characteristics and capabilities of your device.
icon: mdi:memory
sections:
  - title: How it Works
    icon: mdi:code-braces
    content: >
      Hardware fingerprinting in this implementation collects information about your device's physical capabilities using various browser APIs. This includes the number of CPU cores (via hardwareConcurrency), device memory, maximum touch points, and the availability of various hardware features like battery status, bluetooth, gamepads, and wake lock capabilities.

  - title: Privacy Implications
    icon: mdi:shield-alert
    content: >
      Hardware characteristics provide a stable and reliable way to identify devices, as they rarely change unless you upgrade your hardware. The combination of CPU cores, memory, and hardware feature support creates a distinctive profile that can be used to track your device across different browsers and sessions.

  - title: Protection Strategies
    icon: mdi:shield-check
    items:
      - Use privacy-focused browsers that limit hardware information exposure.
      - Consider using virtual machines with standardized hardware configurations.
      - Be aware that hardware-level fingerprinting is difficult to prevent without impacting functionality.
      - Keep your hardware configurations as common as possible to blend in with other users.
      - Use browser extensions that can spoof or limit hardware information access.

  - title: Additional Resources
    icon: mdi:book-open-page-variant
    resources:
      - label: Navigator.hardwareConcurrency
        url: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/hardwareConcurrency
        icon: mdi:cpu-64-bit
      - label: Device Memory API
        url: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory
        icon: mdi:memory
---
