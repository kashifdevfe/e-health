# Therapy Voice Setup Guide

## How to Get More Natural Voices for Therapy Sessions

### Option 1: Add More Windows Voices (Free)

#### Windows 11:
1. Open **Settings** → **Time & Language** → **Speech**
2. Under **Manage voices**, click **Add voices**
3. Download additional voices:
   - **Neural voices** (most natural) - Look for voices with "Neural" in the name
   - **Premium voices** - Higher quality voices
   - **Regional voices** - Different accents and styles

#### Windows 10:
1. Open **Settings** → **Time & Language** → **Speech**
2. Click **Add a language** and select English variants
3. Each language variant includes different voices

#### Recommended Voices for Therapy:
- **Microsoft Zira** (Female, warm, natural)
- **Microsoft Aria** (Female, clear)
- **Microsoft Jenny** (Female, friendly)
- **Microsoft Guy** (Male, calm)
- **Any Neural voice** (Most natural sounding)

### Option 2: Use Cloud TTS Services (Premium Quality)

For the most natural therapy voices, consider integrating cloud TTS services:

#### 1. **ElevenLabs** (Recommended for Therapy)
- **Website**: https://elevenlabs.io
- **Features**: 
  - Therapist-specific voices
  - Very natural, empathetic voices
  - Emotional expressiveness
- **Pricing**: Free tier available, paid plans for more usage

#### 2. **Google Cloud Text-to-Speech**
- **Features**:
  - Neural voices (WaveNet)
  - Multiple languages
  - SSML support for fine control
- **Pricing**: Pay per character

#### 3. **Amazon Polly**
- **Features**:
  - Neural TTS
  - Multiple voices
  - SSML support
- **Pricing**: Free tier available

#### 4. **Microsoft Azure Cognitive Services**
- **Features**:
  - Neural voices
  - Custom voice training
  - Multiple languages
- **Pricing**: Pay per character

### Option 3: Browser-Based Solutions

The current implementation uses the Web Speech API which uses your system voices. To get better voices:

1. **Install more system voices** (see Option 1)
2. **Use a different browser** - Different browsers may have access to different voices
3. **Check for neural voices** - The app will automatically detect and prefer neural voices

### Quick Check: See All Available Voices

1. Open the therapy session
2. Look at the **Voice** dropdown menu
3. Voices marked with ⭐ are neural/premium voices (best quality)
4. Try different voices to find the most natural one

### Tips for Best Therapy Voice Experience

1. **Choose Neural Voices**: Look for voices with "Neural" in the name
2. **Avoid Robotic Voices**: Skip voices that sound mechanical
3. **Test Different Voices**: Use the voice selector to try each one
4. **Adjust Settings**: Rate (1.0-1.2) and Pitch (1.0-1.1) can make voices sound more natural
5. **Female Voices**: Often sound warmer and more empathetic for therapy

### Current Voice Settings

- **Rate**: 1.1 (slightly faster for natural flow)
- **Pitch**: 1.05 (slightly higher for natural sound)
- **Volume**: 1.0 (maximum)

### Need Help?

If voices still sound robotic:
1. Check if you have neural voices installed
2. Try the voice selector dropdown
3. Consider upgrading to Windows 11 for better voice options
4. For production use, consider integrating a cloud TTS service

