# Website QA checklist

## Source-level checks
- [x] Arabic/English language switching with persistent preference.
- [x] RTL/LTR document direction changes with selected language.
- [x] Visible language switch, search overlay, and full-screen mobile navigation.
- [x] Keyboard skip link and focus-visible styles.
- [x] Respect `prefers-reduced-motion`.
- [x] Lazy load below-the-fold images; hero image uses high fetch priority.
- [x] Cloudinary logo error fallback to local image.
- [x] External contextual images distinguished from SUDI project evidence.
- [x] No unverified metrics or fabricated project outcomes.

## Browser verification required
- [ ] Check Cloudinary logo variants on desktop and mobile.
- [ ] Check remote contextual images load and keep source links working.
- [ ] Test RTL menu, search keyboard behaviour, and language persistence.
- [ ] Test WhatsApp contact form and inspect prefilled message.
- [ ] Run Lighthouse and a WCAG 2.2 AA contrast audit.
- [ ] Validate all page/image references, structured data and sitemap.
- [ ] Review legal wording before formal adoption.
