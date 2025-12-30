# Animation Assets

This folder contains Lottie animation JSON files for educational content.

## How to Add Animations

1. **Download from LottieFiles:**
   - Visit https://lottiefiles.com
   - Search for: "heart", "medical", "anatomy", "blood flow", "heartbeat"
   - Download JSON files
   - Save them here with descriptive names

2. **Naming Convention:**
   - `heart-pump.json` - Heart pumping animation
   - `blood-flow.json` - Blood flow animation
   - `heart-structure.json` - Heart anatomy/structure
   - `medication-effect.json` - Medication effects visualization
   - `heartbeat.json` - Heartbeat animation

3. **File Format:**
   - Must be valid Lottie JSON format
   - File size should be reasonable (< 500KB recommended)

## Example Sources

- **LottieFiles:** https://lottiefiles.com (free medical animations)
- **Lordicon:** https://lordicon.com (medical icons)
- **After Effects:** Create custom animations and export as JSON

## Usage

Animations are automatically loaded by the `EducationalAnimation` component based on the content title. If a matching animation file is not found, the component will fall back to SVG animations.
