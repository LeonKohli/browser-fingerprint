---
title: System Information
description: Details about your operating system and environmental settings.
icon: mdi:cpu-64-bit
sections:
  - title: How it Works
    icon: mdi:code-braces
    content: >
      System fingerprinting involves collecting data about your operating system, system language, time zone, installed fonts, and other environmental variables. This can include the list of system fonts (detected through JavaScript font enumeration), which can be highly unique due to custom installations, as well as time zone and locale settings obtained via `Intl.DateTimeFormat` and `navigator.language`. By combining these attributes, trackers can infer your geographical location, regional settings, and other personal information, enhancing the uniqueness of your device fingerprint.

  - title: Privacy Implications
    icon: mdi:shield-alert
    content: >
      System information can reveal sensitive details about you, such as your approximate location (via time zone), language preferences, and cultural or regional settings. Installed fonts can also reflect personal choices or professional tools you use. When combined with other fingerprinting data, system information significantly enhances the ability of trackers to uniquely identify and profile you, posing a substantial privacy risk.

  - title: Protection Strategies
    icon: mdi:shield-check
    items:
      - Configure your system and browser to use common locales and languages to blend in with the majority of users.
      - Limit the number of custom fonts installed on your system and use standard fonts to reduce uniqueness.
      - Use privacy tools like VPNs or Tor to mask your IP address and potentially your time zone.
      - Install browser extensions that spoof system information or block access to certain APIs, such as [Chameleon](https://github.com/sereneblue/chameleon).
      - Use virtual machines or sandboxed environments to isolate your actual system environment from fingerprinting scripts.

  - title: Additional Resources
    icon: mdi:book-open-page-variant
    resources:
      - label: Intl.DateTimeFormat Documentation
        url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
        icon: mdi:clock
      - label: Font Fingerprinting Explained
        url: https://browserleaks.com/fonts
        icon: mdi:format-font
      - label: W3C - Fingerprinting Guidance for Web Specification Authors
        url: https://www.w3.org/TR/fingerprinting-guidance/
        icon: mdi:shield-check
---
