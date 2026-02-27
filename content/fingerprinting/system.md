---
title: System Information
description: Details about your operating system and environmental settings.
icon: mdi:cpu-64-bit
sections:
  - title: How it Works
    icon: mdi:code-braces
    content: >
      System fingerprinting collects information about your system's environment using JavaScript APIs. This includes timezone settings (~3.4 bits per AmIUnique) obtained via Intl.DateTimeFormat, and a list of installed system fonts detected by measuring text rendering differences across font families using the Canvas API (~8.5 bits per AmIUnique). Font detection uses a varied test string ('mmMwWLliI0O&1') at 48px, checking both width and height metrics against baseline fonts. Note: Firefox limits font enumeration in strict Enhanced Tracking Protection mode, and some browsers are moving toward providing only a standard set of fonts to reduce fingerprint surface.

  - title: Privacy Implications
    icon: mdi:shield-alert
    content: >
      System information can reveal significant details about your device setup. Your timezone settings are determined by your system's date/time configuration, not your IP address or VPN. This means using a VPN alone won't mask your timezone information. Installed fonts can reveal information about your work (design software, specialized applications) or language preferences. The combination of these attributes contributes to creating a unique identifier for your device.

  - title: Protection Strategies
    icon: mdi:shield-check
    items:
      # Timezone-specific strategies
      - "Timezone Protection: Override JavaScript's Date and Intl APIs using extensions like Chameleon or User-Agent Switcher"
      - "System Time: Ensure your system time matches your spoofed timezone to prevent inconsistencies"
      # Font-specific strategies
      - "Font Protection: Use Font Fingerprint Defender or similar extensions to limit font enumeration"
      - "Font Management: Stick to system default fonts and remove unnecessary custom fonts"
      - "Font Installation: Create a separate user profile for design work requiring custom fonts"
      # Specific to our implementation
      - "Implementation Specific: Our tool detects fonts using canvas measurements - consider using Canvas Blocker extensions"

  - title: Additional Resources
    icon: mdi:book-open-page-variant
    resources:
      - label: JavaScript Date.getTimezoneOffset() Documentation
        url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
        icon: mdi:clock
      - label: Intl.DateTimeFormat Documentation
        url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
        icon: mdi:clock
      - label: Font Fingerprinting Technical Details
        url: https://browserleaks.com/fonts
        icon: mdi:format-font
---
