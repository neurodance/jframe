# Jott Renderer Test Cases - Beta Stage

## Test Environment Setup

1. **Start the local server:**
   ```bash
   python -m http.server 8000
   ```

2. **Open test pages in browser:**
   - PoC Validation: http://localhost:8000/jott-poc.html
   - Jott Renderer Demo: http://localhost:8000/jott-demo.html

## Test Case 1: Progressive Layer Advancement
**Purpose:** Verify that Jotts progress through layers correctly based on time and engagement

### Steps:
1. Open http://localhost:8000/jott-demo.html
2. Select "Product Jott" demo (should be default)
3. Observe the layer indicator dots at the top
4. Wait and watch auto-progression:
   - **Glance → Scan** (after 3 seconds)
   - **Scan → Read** (after 10 seconds)

### Expected Results:
✅ Layer indicator shows current layer (highlighted dot)
✅ Content changes visibly between layers
✅ "Current Layer" stat updates in control panel
✅ Event log shows "Layer changed" entries
✅ Time on Jott counter increases continuously

### Manual Test:
- Click layer buttons in control panel (Glance, Scan, Read, Interact)
- Each click should immediately switch layers
- Layer dots should be clickable for navigation

---

## Test Case 2: Device Adaptation
**Purpose:** Verify Jotts adapt content for different devices

### Steps:
1. Open http://localhost:8000/jott-demo.html
2. Load "Product Jott" demo
3. Click "Simulate Mobile" button
4. Observe changes in rendering

### Expected Results:
✅ "Device" stat changes to "mobile"
✅ Card layout becomes more vertical/stacked
✅ Font sizes adjust for mobile viewing
✅ Swipe hints appear (‹ ›) at bottom right
✅ Maximum of 3 action buttons shown (if more exist)

### Desktop vs Mobile Comparison:
- **Desktop:** Side-by-side columns, larger fonts, hover effects
- **Mobile:** Stacked layout, touch-optimized, simplified actions

---

## Test Case 3: Interaction Tracking
**Purpose:** Verify user interactions are captured and analyzed

### Steps:
1. Open http://localhost:8000/jott-demo.html
2. Load "Product Jott" demo
3. Progress to "Scan" layer (wait or click)
4. Click "Add to Cart" button
5. Progress to "Interact" layer
6. Change form inputs (color, quantity, etc.)
7. Click "Proceed to Checkout"

### Expected Results:
✅ "Interactions" counter increases with each action
✅ Event log shows "Action triggered" entries
✅ Auto-progression stops after first interaction
✅ Form inputs respond to changes
✅ Analytics events appear in console (if enabled)

---

## Test Case 4: Multi-Demo Content Types
**Purpose:** Verify different content types render correctly

### Steps:
1. Open http://localhost:8000/jott-demo.html
2. Test each demo type sequentially:

#### A. Product Jott
- **Glance:** Product image, title, price, rating
- **Scan:** Features list, add to cart button
- **Read:** Full specs, detailed description
- **Interact:** Customization options

#### B. Article Jott
- **Glance:** Headline with icon
- **Scan:** Summary bullets
- **Read:** Full article with metrics

#### C. Profile Jott
- **Glance:** Avatar and name
- **Scan:** Stats and role

#### D. Dashboard Jott
- **Glance:** Key metric highlight
- **Scan:** Multiple KPIs

### Expected Results:
✅ Each demo loads without errors
✅ Content is appropriate for each layer
✅ Visual hierarchy is clear
✅ Information density increases with each layer

---

## Test Case 5: Adaptive Cards Integration
**Purpose:** Verify base AC functionality is preserved

### Steps:
1. Open http://localhost:8000/jott-poc.html
2. Click "Run All Tests" button
3. All four test cards should show green checkmarks

### Expected Results:
✅ "Adaptive Cards Library" - AC library loaded and rendering
✅ "Progressive Layers" - Layer switching works
✅ "Interactivity" - Input handling works
✅ "Context Adaptation" - Device/time detection works

### Manual Verification:
- Standard AC elements render (TextBlock, Image, ColumnSet)
- AC actions trigger correctly
- AC styling is preserved
- No console errors

---

## Test Case 6: Performance & Timing
**Purpose:** Verify smooth performance and accurate timing

### Steps:
1. Open http://localhost:8000/jott-demo.html
2. Load any demo
3. Monitor performance during layer transitions
4. Check timing accuracy

### Expected Results:
✅ Layer transitions are smooth (no flicker)
✅ Render time shown in metrics < 100ms
✅ Auto-progression timing is accurate (±500ms)
✅ No memory leaks after multiple re-renders
✅ Event log doesn't cause performance issues

### Performance Checks:
- Open browser DevTools > Performance
- Record while switching layers
- FPS should stay above 30
- No long tasks > 50ms

---

## Test Case 7: Keyboard Navigation
**Purpose:** Verify accessibility through keyboard controls

### Steps:
1. Open http://localhost:8000/jott-demo.html
2. Click anywhere in the Jott container
3. Use keyboard controls:
   - **Right Arrow** → Next layer
   - **Left Arrow** → Previous layer

### Expected Results:
✅ Arrow keys change layers
✅ Focus indicator visible
✅ Tab navigation works through buttons
✅ Enter/Space activate buttons

---

## Test Case 8: Error Handling
**Purpose:** Verify graceful error handling

### Steps:
1. Open http://localhost:8000/jott-demo.html
2. Open browser console
3. Try to break things:
   - Rapidly click layer buttons
   - Switch demos during transitions
   - Toggle options during auto-progress

### Expected Results:
✅ No console errors
✅ No rendering failures
✅ Transitions cancel cleanly
✅ State remains consistent
✅ Error messages are user-friendly (if any)

---

## Success Criteria Summary

### 🟢 Full Success (Ready for commit):
- All test cases pass
- No console errors
- Performance is smooth
- All interactions work as expected

### 🟡 Partial Success (Minor fixes needed):
- Core functionality works
- Minor visual glitches
- Non-critical console warnings
- Some edge cases fail

### 🔴 Failed (Major fixes needed):
- Rendering failures
- JavaScript errors
- Core features don't work
- Performance issues

---

## Quick Validation Checklist

Before committing, verify:

- [ ] PoC page loads without errors
- [ ] Demo page loads without errors
- [ ] All 4 demo types render correctly
- [ ] Layer progression works (auto and manual)
- [ ] Mobile simulation works
- [ ] At least one interaction triggers
- [ ] No console errors in DevTools
- [ ] Event log shows activity
- [ ] Statistics update correctly
- [ ] Keyboard navigation works

---

## Testing Commands

```bash
# Start test server
python -m http.server 8000

# Open test URLs
# PoC: http://localhost:8000/jott-poc.html
# Demo: http://localhost:8000/jott-demo.html

# Check for console errors
# Open DevTools (F12) > Console tab

# Test mobile view
# DevTools > Toggle device toolbar (Ctrl+Shift+M)

# Performance profiling
# DevTools > Performance > Record > Interact > Stop
```

## Bug Reporting Template

If you find issues, document them as:

```markdown
**Issue:** [Brief description]
**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
**Expected:** [What should happen]
**Actual:** [What actually happened]
**Browser:** [Chrome/Firefox/Safari version]
**Console Error:** [Any error messages]
```