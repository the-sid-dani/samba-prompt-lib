# Keyboard Navigation Testing Checklist
## SambaTV Prompt Web App

### Testing Instructions
1. Use only keyboard (no mouse/trackpad)
2. Test with Tab, Shift+Tab, Enter, Space, Arrow keys
3. Verify all interactive elements are reachable
4. Ensure focus indicators are visible

---

## Global Navigation
- [ ] Logo link is focusable
- [ ] All navigation links accessible via Tab
- [ ] Mobile menu trigger accessible (on mobile viewport)
- [ ] User menu dropdown accessible
- [ ] Sign in/out buttons focusable

## Home Page (PromptExplorer)
- [ ] Search input is focusable
- [ ] Category filter buttons accessible via Tab
- [ ] Tab navigation through sort options works
- [ ] All prompt cards are focusable
- [ ] Copy buttons within cards are accessible
- [ ] Can navigate between prompt cards with keyboard

## Submit Page
- [ ] All form fields accessible in logical order
- [ ] Can navigate between form fields with Tab
- [ ] Markdown editor is keyboard accessible
- [ ] Tag input supports keyboard navigation
- [ ] Category selection works with keyboard
- [ ] Submit/Save buttons are focusable
- [ ] Error messages are announced

## Prompt Detail Page
- [ ] Back button is focusable
- [ ] All action buttons accessible (Copy, Fork, etc.)
- [ ] Tab navigation works correctly
- [ ] Can switch between tabs with keyboard
- [ ] Comment textarea is accessible
- [ ] All interactive elements in tabs are reachable

## Profile Page
- [ ] Edit profile button is focusable
- [ ] Tab navigation through content tabs
- [ ] View toggle (grid/list) is keyboard accessible
- [ ] Pagination controls work with keyboard
- [ ] All prompt cards in lists are focusable

## Modal/Dialog Components
- [ ] Focus trapped within modal when open
- [ ] Escape key closes modals
- [ ] First focusable element receives focus on open
- [ ] Focus returns to trigger element on close

## Focus Indicators
- [ ] All interactive elements have visible focus indicators
- [ ] Focus indicators have sufficient contrast
- [ ] Focus order follows logical reading order
- [ ] No focus traps (except modals)

## Screen Reader Compatibility
- [ ] Page landmarks properly defined
- [ ] Headings hierarchy is logical
- [ ] Images have appropriate alt text
- [ ] Form labels properly associated
- [ ] Error messages are announced
- [ ] Dynamic content changes announced

## Common Issues to Check
- [ ] Skip links present and functional
- [ ] No keyboard-only interactions
- [ ] Tooltips accessible via keyboard
- [ ] Dropdown menus navigable
- [ ] Complex widgets (date pickers, etc.) accessible

---

## Testing Results

### Critical Issues Found:
*List any blocking keyboard navigation issues*

### Improvements Needed:
*List enhancements for better keyboard experience*

### WCAG Compliance Notes:
*Document compliance with WCAG 2.1 Level AA criteria* 