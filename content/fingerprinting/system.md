---
title: System Information
description: Details about your operating system and environmental settings.
icon: mdi:cpu-64-bit
sections:
  - title: How it Works
    icon: mdi:code-braces
    content: >
      System fingerprinting in this implementation collects information about your system's environment using JavaScript APIs. This includes your timezone settings (obtained via Intl.DateTimeFormat), timezone offset, and a comprehensive list of installed system fonts. The font detection is performed by measuring text rendering differences across various font families using the Canvas API.

  - title: Privacy Implications
    icon: mdi:shield-alert
    content: >
      System information can reveal significant details about your device setup. Your timezone can indicate your geographical location, while installed fonts can reveal information about your work (design software, specialized applications) or language preferences. The combination of these attributes contributes to creating a unique identifier for your device.

  - title: Protection Strategies
    icon: mdi:shield-check
    items:
      - Use common system fonts and avoid installing unnecessary custom fonts.
      - Consider using a VPN to mask your actual timezone information.
      - Use privacy-focused browsers that limit or standardize system information exposure.
      - Consider using font fingerprinting protection extensions.
      - Be mindful that system customization can make your device more identifiable.

  - title: Additional Resources
    icon: mdi:book-open-page-variant
    resources:
      - label: Intl.DateTimeFormat Documentation
        url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
        icon: mdi:clock
      - label: Font Fingerprinting Explained
        url: https://browserleaks.com/fonts
        icon: mdi:format-font
---
