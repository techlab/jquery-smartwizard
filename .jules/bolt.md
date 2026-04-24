## 2023-10-27 - Throttle resize events with requestAnimationFrame
**Learning:** During window resizes, standard synchronous execution of layout reads and writes (like calling `.css()` and `.outerHeight(true)`) causes severe layout thrashing in jQuery plugins.
**Action:** Use `requestAnimationFrame` instead of `setTimeout` to debounce/throttle these kinds of repaints to align DOM updates with the browser's render cycle, reducing main thread blocking.
