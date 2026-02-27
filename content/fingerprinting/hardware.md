---
title: Hardware Information
description: Physical characteristics and capabilities of your device.
icon: mdi:memory
sections:
  - title: How it Works
    icon: mdi:code-braces
    content: >
      Hardware fingerprinting collects information about your device's physical capabilities using various browser APIs. This includes CPU cores via hardwareConcurrency (~3 bits), device memory via navigator.deviceMemory which returns RAM in GB (0.25, 0.5, 1, 2, 4, 8 — Chromium-only, ~2 bits), maximum touch points, and hardware feature availability. Note: navigator.deviceMemory is distinct from performance.memory.jsHeapSizeLimit (JS heap limit) — the former reports actual physical RAM, the latter reports the V8 heap limit. Battery data (charging state, level) is collected for display but excluded from the fingerprint hash since battery level changes constantly and would destabilize the fingerprint.

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
