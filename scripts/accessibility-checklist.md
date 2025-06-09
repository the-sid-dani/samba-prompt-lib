# Accessibility Testing Checklist

## Screen Reader Testing

### NVDA (Windows)
- [ ] Navigate through main content areas using headings (H key)
- [ ] Test skip links functionality (Tab to first skip link, Enter to activate)
- [ ] Verify all interactive elements are announced properly
- [ ] Check form labels and error messages are read correctly
- [ ] Test table navigation if applicable
- [ ] Verify live regions announce dynamic content changes

### VoiceOver (macOS)
- [ ] Use VO+U to open rotor and navigate by headings
- [ ] Test landmark navigation (VO+U, then select Landmarks)
- [ ] Verify button and link announcements include purpose
- [ ] Check that images have appropriate alt text or are marked decorative
- [ ] Test form controls and their labels
- [ ] Verify modal focus management

### JAWS (Windows)
- [ ] Navigate using heading shortcuts (H, 1-6)
- [ ] Test virtual cursor mode vs forms mode
- [ ] Verify all content is accessible in virtual cursor
- [ ] Check that dynamic content updates are announced
- [ ] Test table reading if applicable

## Keyboard Navigation Testing

### Tab Order
- [ ] Tab through entire page in logical order
- [ ] Verify no keyboard traps (can always tab out)
- [ ] Check that all interactive elements are reachable
- [ ] Ensure tab order matches visual layout
- [ ] Test Shift+Tab for reverse navigation

### Focus Management
- [ ] All focusable elements have visible focus indicators
- [ ] Focus indicators meet 3:1 contrast ratio
- [ ] Modal dialogs trap focus appropriately
- [ ] Focus returns to trigger element when modal closes
- [ ] Skip links are visible when focused

### Keyboard Shortcuts
- [ ] Enter activates buttons and links
- [ ] Space activates buttons
- [ ] Arrow keys work in appropriate contexts (menus, tabs)
- [ ] Escape closes modals and dropdowns
- [ ] Home/End work where appropriate

## Color and Contrast

### Text Contrast
- [ ] Normal text: 4.5:1 contrast ratio minimum
- [ ] Large text (18pt+): 3:1 contrast ratio minimum
- [ ] UI components: 3:1 contrast ratio minimum
- [ ] Focus indicators: 3:1 contrast ratio minimum

### Color Usage
- [ ] Information not conveyed by color alone
- [ ] Error states have text indicators, not just red color
- [ ] Success states have text indicators, not just green color
- [ ] Links distinguishable from regular text without color

## Semantic HTML and ARIA

### Headings
- [ ] Page has exactly one h1
- [ ] Heading hierarchy is logical (no skipped levels)
- [ ] Headings describe content sections accurately
- [ ] Headings are used for structure, not styling

### Landmarks
- [ ] Page has main landmark
- [ ] Navigation areas marked with nav
- [ ] Complementary content in aside
- [ ] Page info in footer with contentinfo role
- [ ] Multiple landmarks of same type have labels

### Forms
- [ ] All form controls have labels
- [ ] Required fields are marked appropriately
- [ ] Error messages are associated with controls
- [ ] Fieldsets group related controls
- [ ] Form submission provides feedback

### Images
- [ ] Informative images have descriptive alt text
- [ ] Decorative images have empty alt="" or aria-hidden="true"
- [ ] Complex images have detailed descriptions
- [ ] Image buttons have descriptive alt text

## Dynamic Content

### Live Regions
- [ ] Status messages use aria-live="polite"
- [ ] Urgent messages use aria-live="assertive"
- [ ] Loading states are announced
- [ ] Error messages are announced immediately

### Interactive Updates
- [ ] Content changes are announced to screen readers
- [ ] Loading states have appropriate announcements
- [ ] Success/error messages are announced
- [ ] Dynamic content doesn't break keyboard navigation

## Mobile Accessibility

### Touch Targets
- [ ] Touch targets are at least 44x44 pixels
- [ ] Adequate spacing between touch targets
- [ ] Touch targets work with assistive touch

### Screen Reader (iOS/Android)
- [ ] VoiceOver/TalkBack can navigate all content
- [ ] Swipe gestures work appropriately
- [ ] Custom gestures are documented if used

## Testing Tools

### Automated Testing
- [ ] axe-core accessibility scanner (0 violations)
- [ ] Lighthouse accessibility audit (score 90+)
- [ ] WAVE browser extension
- [ ] Color contrast analyzer

### Manual Testing
- [ ] Keyboard-only navigation test
- [ ] Screen reader walkthrough
- [ ] High contrast mode testing
- [ ] Zoom to 200% without horizontal scrolling

## Browser Testing

### Desktop Browsers
- [ ] Chrome with screen reader
- [ ] Firefox with screen reader
- [ ] Safari with VoiceOver
- [ ] Edge with screen reader

### Mobile Browsers
- [ ] iOS Safari with VoiceOver
- [ ] Android Chrome with TalkBack

## Documentation

### Accessibility Statement
- [ ] Document known accessibility features
- [ ] List any known limitations
- [ ] Provide contact for accessibility feedback
- [ ] Include testing methodology

### Developer Documentation
- [ ] Document ARIA patterns used
- [ ] Include keyboard interaction patterns
- [ ] Document focus management approach
- [ ] Include testing procedures

## Common Issues to Check

### Critical Issues
- [ ] Images missing alt text
- [ ] Form controls missing labels
- [ ] Insufficient color contrast
- [ ] Keyboard traps
- [ ] Missing focus indicators

### Serious Issues
- [ ] Improper heading structure
- [ ] Missing landmark roles
- [ ] Inaccessible custom components
- [ ] Poor error handling
- [ ] Inadequate focus management

### Moderate Issues
- [ ] Missing skip links
- [ ] Unclear link text
- [ ] Missing live regions
- [ ] Poor touch target sizing
- [ ] Inconsistent navigation

## Success Criteria

### WCAG 2.1 AA Compliance
- [ ] All Level A criteria met
- [ ] All Level AA criteria met
- [ ] Documented exceptions if any

### User Experience
- [ ] Screen reader users can complete all tasks
- [ ] Keyboard users can access all functionality
- [ ] High contrast users can see all content
- [ ] Zoom users can access all content

## Notes

- Test with actual users with disabilities when possible
- Regular testing should be part of development workflow
- Accessibility is an ongoing process, not a one-time check
- Consider accessibility from the design phase forward 