# jQuery Smart Wizard v6

<p align="center">
  <a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=28&pause=1000&color=0DA4D3&center=true&vCenter=true&width=550&lines=The+awesome+step+wizard+plugin+for+jQuery" alt="Typing SVG" /></a>
</p>

<p align="center">
  <a href="https://techlaboratory.net/jquery-smartwizard#demo">
    <img src="https://img.shields.io/badge/Live_Demo-28A745?style=for-the-badge&logo=rocket&logoColor=white" alt="Live Demo"/>
  </a>
  <a href="https://techlaboratory.net/jquery-smartwizard#documentation">
    <img src="https://img.shields.io/badge/Read_Docs-007BFF?style=for-the-badge&logo=book&logoColor=white" alt="Documentation"/>
  </a>
</p>

<p align="center">
    <img src="https://img.shields.io/travis/com/techlab/jquery-smartwizard?style=for-the-badge" alt="Build Status">
    <img src="https://img.shields.io/github/license/techlab/jquery-smartwizard?style=for-the-badge" alt="License">
    <img src="https://img.shields.io/npm/v/smartwizard?style=for-the-badge&color=blue" alt="NPM Version">
    <img src="https://img.shields.io/npm/dm/smartwizard?style=for-the-badge&color=blue" alt="NPM Downloads">
</p>

---

### ✨ Core Features

* 🚀 *Dead Simple Setup*: Get started with minimal HTML.
* 📱 *Fully Responsive*: Adapts seamlessly to any device.
* 🎨 *Beautiful Themes*: Multiple stunning themes included out-of-the-box.
* 💧 *Easy Customization*: Tweak colors and styles with CSS variables.
* 🎬 *Smooth Animations*: Built-in effects and full support for CSS libraries like Animate.css.
* ✅ *Step Validation*: Ensure data is correct before proceeding.
* 🌐 *AJAX Support*: Load step content on-the-fly.
* ⌨ *Accessible*: Keyboard navigation, ARIA support, and RTL compatibility.

---

### 🛠 Tech Stack
<p align="left">
  <img src="https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white" alt="jQuery"/>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
</p>

---

### 🌟 Visual Showcase

| Validation & Animation | Themes & Styles |
| :---: | :---: |
| ![Smart Wizard Validation GIF](https://techlaboratory.net/assets/media/jquery-smart-wizard/v6/gif/sw-6-validation.gif) | ![Smart Wizard Themes](https://techlaboratory.net/assets/media/jquery-smart-wizard/v6/sw-6-arrows-dark.png) |

---

### 📦 Installation & Usage

Getting started is a breeze. Choose your preferred method.

<details>
<summary><strong>Quick Start with NPM &amp; Webpack/ES6</strong></summary>

*1. Install via NPM:*
```bash
npm install smartwizard

<div id="smartwizard">
    <ul class="nav">
        <li><a class="nav-link" href="#step-1">Step 1</a></li>
        <li><a class="nav-link" href="#step-2">Step 2</a></li>
    </ul>
    <div class="tab-content">
        <div id="step-1" class="tab-pane" role="tabpanel">Step 1 content</div>
        <div id="step-2" class="tab-pane" role="tabpanel">Step 2 content</div>
    </div>
</div>
import $ from "jquery";
import "smartwizard/dist/css/smart_wizard_all.css";
import smartWizard from 'smartwizard';

$('#smartwizard').smartWizard({
    // Options go here
});
</details>

<details>
<summary><strong>Classic Setup with CDN</strong></summary>

HTML

<link href="[https://cdn.jsdelivr.net/npm/smartwizard@6/dist/css/smart_wizard_all.min.css](https://cdn.jsdelivr.net/npm/smartwizard@6/dist/css/smart_wizard_all.min.css)" rel="stylesheet" type="text/css" />

<div id="smartwizard"> ... </div>

<script src="[https://code.jquery.com/jquery-3.6.0.min.js](https://code.jquery.com/jquery-3.6.0.min.js)"></script>
<script src="[https://cdn.jsdelivr.net/npm/smartwizard@6/dist/js/jquery.smartWizard.min.js](https://cdn.jsdelivr.net/npm/smartwizard@6/dist/js/jquery.smartWizard.min.js)" type="text/javascript"></script>

<script type="text/javascript">
  $(function() {
      $('#smartwizard').smartWizard();
  });
</script>
</details>

🔧 Customization & API
Smart Wizard is fully customizable. For a deep dive into all options, events, and public methods, please check out the complete Official Documentation.

<details>
<summary><strong>Example: Changing Theme and Toolbar</strong></summary>

JavaScript

$('#smartwizard').smartWizard({
  selected: 0,
  theme: 'arrows', // A different theme
  toolbar: {
    position: 'bottom', // Show toolbar at the bottom
    extraHtml: <button class="btn btn-success" type="button">Finish</button>
  }
});
</details>

⭐ Star History
See how the project has grown over time!

<a href="https://www.google.com/search?q=https://star-history.com/%23techlab/jquery-smartwizard%26Date">
<img src="https://www.google.com/search?q=https://api.star-history.com/svg%3Frepos%3Dtechlab/jquery-smartwizard%26type%3DDate" alt="Star History Chart">
</a>

💖 Support & Contributions
If you find this plugin useful, please consider showing your support!

⭐ Star the repository on GitHub.

❤ Sponsor the developer on GitHub Sponsors.

💸 Donate via PayPal.

👥 Our Awesome Contributors
A big thank you to everyone who has contributed to this project!

<a href="https://github.com/techlab/jquery-smartwizard/graphs/contributors">
<img src="https://www.google.com/search?q=https://contrib.rocks/image%3Frepo%3Dtechlab/jquery-smartwizard" />
</a>

<hr>
<p align="center">
Happy Coding!
</p>
