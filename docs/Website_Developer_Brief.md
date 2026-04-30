# Website Developer Brief: www.dowurktoday.org

**Date:** April 30, 2026
**Project:** DowUrk Inc. Main Website Optimization & App Integration
**Prepared by:** DowUrk AI Hub Team

## Executive Summary

This brief outlines critical fixes, UX improvements, and new feature integrations required for the main DowUrk website (www.dowurktoday.org). A recent comprehensive analysis identified several blocking issues that are currently degrading the user experience and potentially harming SEO. Additionally, we have developed new tools within the DowUrk AI Hub (React/FastAPI stack) that need to be seamlessly linked from the main site.

## Part 1: Critical Fixes (Immediate Priority)

These issues are currently live on the site and require immediate attention.

### 1. Persistent Cookie Consent Banner
*   **Issue:** The cookie consent banner at the bottom of the screen never dismisses, even after the user clicks "Accept All" multiple times.
*   **Action Required:** Debug the cookie consent script. Ensure that upon clicking "Accept All," a persistent cookie or local storage flag is set, and the banner is hidden on all subsequent page loads.
*   **Impact:** High. This is a major UX frustration that blocks content on mobile devices.

### 2. Broken Business Directory Page
*   **Issue:** The `/directory` page (linked from the homepage "Explore Businesses" CTA) loads as a completely blank white screen.
*   **Action Required:** Investigate the routing or component rendering error on this page. Restore the directory functionality immediately.
*   **Impact:** Critical. This is a core feature of the platform that is currently inaccessible.

### 3. Broken YouTube Embed on Homepage
*   **Issue:** The embedded YouTube video on the homepage displays a "Sign in to confirm you're not a bot" error instead of the video content.
*   **Action Required:** Update the embed code. Ensure the video is public and the embed parameters do not trigger bot protection. Consider using a standard `<iframe>` embed or a lightweight wrapper like `lite-youtube-embed` for better performance.
*   **Impact:** High. This breaks the visual flow of the homepage and prevents users from viewing key content.

### 4. Overlapping Popups on First Visit
*   **Issue:** New visitors are bombarded with three simultaneous overlays: the broken cookie banner, a "Free Gift Inside" popup, and a "Stay Updated" notification prompt.
*   **Action Required:** Implement a delay or sequencing logic for popups.
    *   Show the cookie banner first (and ensure it dismisses).
    *   Delay the "Free Gift" popup until the user has scrolled at least 50% of the page or spent 30 seconds on the site.
    *   Delay the notification prompt until a subsequent visit or a specific interaction.
*   **Impact:** High. The current experience is overwhelming and obscures the actual website content.

### 5. SEO Domain Mismatch
*   **Issue:** The site is hosted at `www.dowurktoday.org`, but the meta tags (og:url, twitter:url, hreflang), sitemap, and robots.txt all reference `dowurktoday.com`.
*   **Action Required:** Update all canonical URLs, meta tags, and SEO files to consistently use `https://www.dowurktoday.org`.
*   **Impact:** Medium/High. This confuses search engines and dilutes SEO authority.

## Part 2: UX and Performance Improvements (Short-Term)

### 1. Navigation Simplification
*   **Issue:** The main navigation is overcrowded with 15+ top-level items and multiple dropdowns.
*   **Action Required:** Consolidate the navigation into 5-6 clear categories (e.g., About, Programs, Resources, Community, Login/Join). Move secondary links to the footer or sub-pages.

### 2. Performance Optimization (TTFB)
*   **Issue:** The Time to First Byte (TTFB) is over 3 seconds, which is significantly slower than the recommended 0.8s threshold.
*   **Action Required:** Investigate server response times. Implement caching strategies (e.g., CDN, page caching) and optimize database queries if applicable.

### 3. Remove "Made with Emergent" Badge
*   **Issue:** The platform branding badge is visible in the bottom right corner.
*   **Action Required:** Upgrade the hosting plan or adjust settings to remove this third-party branding, ensuring a fully white-labeled experience.

## Part 3: New Feature Integrations (Medium-Term)

We have developed several new features in the React/FastAPI app repository that need to be linked from the main website.

### 1. The AI Hackbook Tools
*   **Integration:** Add a prominent section on the homepage and a link in the main navigation to the new "AI Hackbook" features.
*   **Links to Add:**
    *   `/prompts` (AI Prompt Library)
    *   `/automations` (Automation Hub)
    *   `/workflows` (AI Workflow Pipelines)

### 2. PROOF System LinkedIn Integration
*   **Integration:** Update the existing PROOF Badges page (`/proof`) to highlight the new LinkedIn integration feature.
*   **Link to Add:** Direct users to the new React component (`/proof-badges`) where they can view their earned badges and click "Add to LinkedIn."

### 3. Community Needs Assessment Tool
*   **Integration:** We need to gather data for grant applications (as suggested by Leigha West).
*   **Link to Add:** Add a prominent CTA (e.g., a banner or a button in the Community section) linking to the new assessment tool at `/needs-assessment`.

### 4. Louisiana Business Verification
*   **Integration:** Link to the new LA SOS API integration tool.
*   **Link to Add:** Add a link to `/business-verification` in the Business Tools or Resources section.

## Summary of Action Items for Developer

1.  **Fix the cookie banner** so it dismisses permanently.
2.  **Restore the `/directory` page** immediately.
3.  **Fix the YouTube embed** on the homepage.
4.  **Sequence the popups** to improve the first-visit experience.
5.  **Update all SEO canonical URLs** to `www.dowurktoday.org`.
6.  **Add navigation links** to the new AI Hub features (`/prompts`, `/automations`, `/workflows`, `/proof-badges`, `/needs-assessment`, `/business-verification`).
