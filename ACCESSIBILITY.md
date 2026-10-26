# Accessibility

At jQuery Smart Wizard, we believe that web applications and multi-step forms should be usable by everyone, including people who navigate with a keyboard, use screen readers or screen magnifiers, rely on voice control, or have cognitive, visual, motor, or temporary limitations.

As a multi-step wizard plugin used across form flows, checkout processes, and onboarding flows, providing an inclusive and accessible user experience is a core goal. This document outlines our accessibility commitments, priorities, contributor guidelines, and how to report any accessibility barriers you encounter.

## Priorities

Our goal is to ensure that every step of a wizard can be perceived, navigated, and completed by all users. While we work toward aligning with the [Web Content Accessibility Guidelines (WCAG) 2.1 Level AA](https://www.w3.org/WAI/WCAG21/quickref/) as an aspirational target, we focus on concrete, practical outcomes:

- **Keyboard Navigation:** Users can navigate forward, backward, and between allowed steps using only the keyboard (such as configurable Arrow keys or Tab key navigation). Interactive elements maintain visible focus indicators and never trap keyboard focus.
- **Form Interactivity:** Keyboard navigation automatically respects form fields (`<input>`, `<textarea>`, `<select>`), ensuring that typing inside form controls never accidentally triggers step transitions.
- **Assistive Technology:** Structural roles (such as toolbar roles) and semantic elements (`<nav>`, `<ul>`, `<li>`, `<a>`, `<button>`) help assistive technologies identify step navigation and current status.
- **Visual Accessibility & Theming:** Themes are designed with clear contrast ratios and offer automatic light/dark mode support (`displayMode: 'auto'`) honoring the user's system preference (`prefers-color-scheme`).
- **Motion & Animations:** Transition animations (slide, fade) are configurable, allowing developers to simplify or disable transitions for users sensitive to motion.
- **Touch & Mobile:** Touch and swipe gestures are supported with configurable thresholds for mobile and tablet users without interfering with default page scrolling.

## Contributor expectations

We welcome community contributions and ask all contributors to help uphold our accessibility standards:

- **Preserve Keyboard Operability:** Any new interaction or modification must be fully operable via keyboard. Do not remove or suppress visible `:focus` or `:focus-visible` styles without providing an accessible alternative.
- **Avoid Focus Traps:** Ensure focus moves logically through steps and controls without getting stuck.
- **Maintain Semantic Markup:** Use appropriate HTML elements (`<button>`, `<a>`, `<nav>`) and valid ARIA attributes where semantic HTML alone is insufficient.
- **Color Contrast:** Ensure text and UI components in new themes or style changes meet WCAG 2.1 AA minimum contrast ratios (at least 4.5:1 for normal text, 3:1 for large text and interactive components).
- **Testing Requirements:** When submitting user-facing changes:
  - Test keyboard navigation manually (Tab, Shift+Tab, Arrow keys).
  - Verify that automated tests continue to pass (`npm test`, Jest unit tests, and Playwright E2E tests).
  - Note in your pull request any accessibility testing conducted (e.g., screen readers tested like NVDA or VoiceOver, or automated audit tools like axe / Lighthouse).

## Reporting accessibility issues

If you encounter an accessibility barrier or have difficulty using jQuery Smart Wizard, please report it to us. We treat accessibility barriers with high priority.

You can report issues through:
- **GitHub Issues:** Open an issue on our [GitHub Issues Tracker](https://github.com/techlab/jquery-smartwizard/issues) with `[Accessibility]` in the title.

To help us diagnose and fix the issue, please include as much of the following information as you can:
- **Task description:** What were you trying to accomplish (e.g., advance to Step 3, read step status)?
- **Observed behavior:** What happened instead (e.g., screen reader announced incorrect state, focus disappeared)?
- **Environment:** Browser (e.g., Chrome, Firefox, Safari), operating system, and version of jQuery Smart Wizard.
- **Assistive technology:** Name and version of any assistive technology used (e.g., NVDA, VoiceOver, JAWS, keyboard-only), if applicable.
- **Reproduction:** A minimal code example or configuration snippet, or a link to a CodePen / JSFiddle.

*Note: Screenshots or recordings are welcome if helpful, but never required. You do not need to disclose personal medical or disability information.*

### Severity

When evaluating accessibility issues, we categorize them as follows:

- **Critical (Blocker):** The barrier completely prevents a user from completing a task or navigating the wizard, with no feasible workaround (e.g., keyboard focus trap, next step unreachable via keyboard or screen reader).
- **Major:** The barrier makes completing a task significantly difficult or confusing, but an alternative workaround exists (e.g., missing step state announcement, missing focus ring on navigation buttons).
- **Minor / Usability:** The barrier creates minor inconvenience or friction, but the user can still understand and complete the task (e.g., suboptimal contrast in a secondary theme, minor layout inconsistency at high zoom levels).

### How we respond

- **Acknowledgment:** We aim to acknowledge new accessibility reports within **48–72 hours**.
- **Triage & Evaluation:** We will review the report, verify the barrier against supported environments, and assign a priority level.
- **Updates & Fixes:** We will provide updates on the issue thread and develop a fix in the `dev` branch. Reporters are invited to test and verify the fix in progress.
- **Release:** Resolved accessibility fixes will be included in the next patch or minor release.

## Ownership and maintenance

- **Maintainer:** Dipu Rajendran ([TechLaboratory](https://github.com/techlab)) is responsible for reviewing and maintaining accessibility across jQuery Smart Wizard.
- **Review Cadence:** Accessibility is evaluated during pull request reviews, feature enhancements, and before major releases.

## Supported environments

jQuery Smart Wizard is designed and tested for compatibility with:

- **Browsers:** Modern evergreen browsers (Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge).
- **Input Methods:** Standard keyboards, mouse/pointer devices, and touch screens.
- **Assistive Technologies:** Screen readers (including NVDA, VoiceOver, and JAWS), screen magnification software, and browser zoom up to 200%.
- **Dependencies:** jQuery >= 1.11.1 (jQuery 3.x recommended).

## Known limitations

- **Custom Step Content:** jQuery Smart Wizard acts as a container for step content. Developers implementing forms inside wizard steps must ensure their own input fields have appropriate `<label>` elements, accessible error messages, and logical tab orders.
- **Dynamic Content Loading:** When using the `contentLoader` option to load step content dynamically via AJAX, ensure that screen reader users are alerted to content updates or that focus is managed appropriately.
- **Custom Themes:** If creating custom themes or overriding CSS variables, verify that custom color combinations meet minimum contrast requirements.

## Feedback and improvements

We continuously seek to improve the accessibility of jQuery Smart Wizard. If you have suggestions for improving this accessibility policy or our components, please open an issue on [GitHub Issues](https://github.com/techlab/jquery-smartwizard/issues).