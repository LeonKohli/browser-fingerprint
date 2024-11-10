---
title: Privacy Tools
description: Enhance your online privacy and reduce your browser fingerprint with these recommended tools and settings.
icon: mdi:shield-lock

warning:
  title: Important Note About Spoofing
  description: We don't recommend using fingerprint spoofers as they can be easily detected, potentially making you more identifiable. The best approach is to block tracking scripts and use privacy-focused tools.

categories:
  - title: Browser Extensions
    tools:
      - name: uBlock Origin
        icon: mdi:shield-check
        description: Efficient blocker for ads, trackers, and other privacy-invasive elements.
        link: https://ublockorigin.com/
        chromeLink: https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm
        firefoxLink: https://addons.mozilla.org/firefox/addon/ublock-origin/
        recommended: true

      - name: Privacy Badger
        icon: mdi:paw
        description: Automatically learns to block invisible trackers based on their behavior.
        link: https://privacybadger.org/
        chromeLink: https://chrome.google.com/webstore/detail/privacy-badger/pkehgijcmpdhfbdbbnkijodmdjhbjlgp
        firefoxLink: https://addons.mozilla.org/firefox/addon/privacy-badger17/
        recommended: true

      - name: Ghostery
        icon: mdi:ghost
        description: Protect your privacy by blocking trackers and visualizing who is watching you.
        link: https://www.ghostery.com/
        chromeLink: https://chrome.google.com/webstore/detail/ghostery/mlomiejdfkolichcflejclcbmpeaniij
        firefoxLink: https://addons.mozilla.org/firefox/addon/ghostery/
        recommended: true

  - title: Privacy-Focused Browsers
    tools:
      - name: Brave Browser
        icon: mdi:shield-crown
        description: Privacy-focused browser with built-in ad and tracker blocking.
        link: https://brave.com/

      - name: Tor Browser
        icon: mdi:web-box
        description: Provides anonymity by routing your traffic through the Tor network.
        link: https://www.torproject.org/

      - name: Mullvad Browser
        icon: mdi:shield-lock
        description: A privacy-focused browser that routes your traffic through the Tor network.
        link: https://mullvad.net/browser/
        recommended: true

  - title: Search engine, browser and operating systems
    tools:
      - name: Tails
        icon: mdi:laptop
        description: The Amnesic Incognito Live System. Leaves no trace on your computer and routes all traffic through Tor.
        link: https://tails.net/
        recommended: true

      - name: Whonix
        icon: mdi:shield-lock
        description: Operating system focused on anonymity, privacy and security. Routes all connections through the Tor network.
        link: https://www.whonix.org/

      - name: DuckDuckGo
        icon: mdi:shield-check
        description: Privacy-focused search engine that doesn't track you.
        link: https://duckduckgo.com/

      - name: Qwant
        icon: mdi:shield-check
        description: Privacy-focused search engine that doesn't track you.
        link: https://www.qwant.com/
        recommended: true

bestPractices:
  title: Privacy Best Practices
  description: Following these practices can significantly improve your online privacy
  columns:
    - items:
        - text: Regularly clear browser cookies and cache
        - text: Use different browsers for different activities
        - text: Keep software and extensions updated
        - text: Use privacy-focused search engines
    - items:
        - text: Enable HTTPS-only mode in your browser
        - text: Use strong, unique passwords
        - text: Enable two-factor authentication
        - text: Avoid logging in to services unnecessarily
--- 