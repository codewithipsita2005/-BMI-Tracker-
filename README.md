# ✨ Premium BMI Tracker & Health Dashboard 🏃‍♂️

A visually stunning, modern, and interactive BMI Tracker web application featuring clean glassmorphic components, dual-theme styling (Dark Mode & Light Mode), dynamic SVG gauge, metric conversion, and personalized goal-based health advice.

## 🌟 Key Features

- **Dual-Theme Design**: 
  - **Dark Mode**: Sleek dark-violet/indigo aesthetics with glassmorphic cards and subtle neon glows.
  - **Light Mode**: Vibrant pastel styling, clean card shadows, and a sticky-note widget.
- **Dynamic SVG Gauge**: A custom-designed, gradient-arc progress wheel with an animated pointer that aligns to the user's exact BMI score.
- **Universal Unit Selector**: Handles standard and imperial conversions:
  - Height: `cm`, `m`, `ft`, `in`
  - Weight: `kg`, `lbs`, `st`
- **Tailored Health Advice**: Dynamic feedback message changes depending on the selected health goal (General Health, Weight Loss, Weight Gain, Maintain Weight) and BMI category.
- **Local History Log**: Users can save, review, and delete their calculation records inside a history log stored locally using `localStorage`.
- **Custom Widgets**: 
  - B.Tech CSE Student profile card and reminder.
  - Health tips dashboard (Eat Balanced, Stay Active, Drink Water, Sleep Well).
- **Social Footer**: Connected card links redirecting directly to GitHub, LinkedIn, Twitter/X, and Gmail.

## 📂 Project Structure

```
bmi_tracker/
│
├── index.html     # HTML Structure & SVG Assets
├── style.css      # Custom HSL & Variable Styling (Dark & Light)
├── script.js     # Real-time conversions, BMI calculations & History log
└── server.py      # Automated Python server to run locally
```

## 🚀 How to Run Locally

You can launch the dashboard locally on any port using Python:

1. Open a terminal/command prompt in the `bmi_tracker` directory.
2. Run the server using:
   ```bash
   python server.py
   ```
3. A local server will start and automatically open your default web browser to the application page.

---
*Created by **Ipsita Ghosh*** 💚
