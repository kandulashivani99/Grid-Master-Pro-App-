# ⚡ GridMaster Pro v3.0

> **All-in-One Electrical Engineering & Renewable Energy Toolkit**
> Premium Progressive Web App (PWA) ready for the Google Play Store.

🎓 Built for **engineering students, electricians, solar installers, renewable energy consultants & smart-grid researchers**.

---

## 🌟 v3.0 Features

| # | Module | What it does |
|---|---|---|
| 1 | 📊 **Live Smart Grid Dashboard** | Animated real-time voltage, current, frequency, PF, renewable %, load trends |
| 2 | ⚡ **Live Energy Flow** | Animated Solar → Wind → Bus → Battery → Load with moving electrons |
| 3 | ☀️ **Solar System Designer** | Panels, batteries, inverter, cable, cost, ROI, payback |
| 4 | 🌬️ **Wind Power Calculator** | Animated turbine + Power vs Wind-Speed curve |
| 5 | ⚡ **Hybrid System Designer** | Solar + Wind + Battery energy balance with bar chart |
| 6 | 📐 **AR Rooftop Estimator** | **NEW** Camera + AR grid overlay → instant solar estimate |
| 7 | 🧮 **25+ EE Calculators** | Searchable modal system covering everything |
| 8 | 💰 **EB Bill Estimator** | **24 Indian states** + appliance load builder |
| 9 | 🤖 **AI Assistant** | Offline KB + **optional OpenAI / Gemini API** integration |
| 10 | 📄 **PDF Reports** | Project reports + quotations (jsPDF) |
| 11 | 🌐 **4 Languages** | **NEW** English, हिन्दी, తెలుగు, தமிழ் |
| 12 | 📚 **Learn** | 10-chapter notes on Smart Grid, Solar, Wind, MPPT |
| 13 | 🎞️ **Presentation** | 13 slides for project viva |
| 14 | 🎯 **Quiz** | 10 MCQs with instant feedback |
| 15 | 🌙 **Dark Mode** | Neon glassmorphism UI |
| 16 | 📲 **PWA** | Installable, offline-ready |
| 17 | 📄 **Legal Pages** | **NEW** Privacy Policy + Terms (Play Store required) |

---

## 🚀 Run Locally

```bash
cd gridmaster-app
python3 -m http.server 8000
# open http://localhost:8000
```

Or open `index.html` directly.

---

## 📲 Publish to Google Play Store

See **[`store/PLAY_STORE_LISTING.md`](store/PLAY_STORE_LISTING.md)** for the complete copy-paste-ready listing content (app name, descriptions, keywords, permissions, etc.).

### Quick Steps:
1. **Host** on free HTTPS (GitHub Pages / Netlify / Vercel)
2. Go to **[pwabuilder.com](https://www.pwabuilder.com)** → paste URL → **Package For Stores → Android**
3. Pay one-time **$25** for Google Play Console → upload signed `.aab` → submit ✅

All Play Store assets are pre-generated in `/store/`:
- ✅ `feature-graphic.png` (1024×500)
- ✅ 6 phone screenshots (`screenshot-1` to `screenshot-6`)
- ✅ App icons (192, 512, 512-maskable)
- ✅ Privacy Policy (`privacy.html`)
- ✅ Terms of Service (`terms.html`)
- ✅ Listing copy (`store/PLAY_STORE_LISTING.md`)

---

## 🤖 AI Assistant — How it works

### Offline (default)
Built-in knowledge base covering common EE topics. Zero internet, instant answers.

### Online (optional)
Open the app → **AI** tab → **⚙️ AI Settings**:
1. Choose provider: **OpenAI (GPT-4o-mini)** or **Google Gemini (1.5 Flash)**
2. Paste your **own API key** (stored locally, never sent to us)
3. Ask anything — get full LLM-powered answers

> 🔒 **Privacy:** API keys stay on your device. Questions go directly from your browser to OpenAI/Google. We never see them.

### Get API Keys
- OpenAI: https://platform.openai.com/api-keys
- Gemini: https://aistudio.google.com/app/apikey (free tier available!)

---

## 📐 AR Rooftop Estimator — How it works

1. Open **AR Rooftop** module
2. Tap **📸 Open Camera** (grant permission)
3. Point camera at your roof — you'll see a cyan AR grid overlay representing solar panels
4. Enter rooftop dimensions (Length × Width) below
5. Get instant estimate: # of panels, installed kW, daily/annual generation, cost, payback

> 📷 Camera images are processed entirely on-device and never uploaded.

---

## 🌐 i18n — Adding a new language

Edit `i18n.js`:
```js
const I18N = {
  // ... existing
  fr: { welcome: "Bienvenue ⚡", ... }
};
```
Then add a button to the language picker in `index.html`. Translation strings are auto-applied via `data-i18n` attributes.

---

## 🛠️ Tech Stack

- HTML5 + CSS3 (glassmorphism + neon) + Vanilla JS — **zero framework, fast load**
- **jsPDF** for PDF generation (CDN)
- **Canvas API** for charts (load trend, wind curve, hybrid bars, AR overlay)
- **MediaDevices API** for camera (AR feature)
- **Service Worker** for offline support
- **PWA Manifest** with app shortcuts

---

## 📂 File Structure

```
gridmaster-app/
├── index.html              # Main UI (12 views)
├── styles.css              # Neon glassmorphism + dark mode (~25 KB)
├── app.js                  # All logic (~25 KB)
├── i18n.js                 # 4-language translations
├── privacy.html            # Privacy Policy (Play Store required)
├── terms.html              # Terms of Service
├── manifest.webmanifest    # PWA manifest with shortcuts
├── sw.js                   # Offline service worker v3
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── icon-512-maskable.png
├── store/                  # 🎁 Play Store assets ready-to-upload
│   ├── feature-graphic.png         # 1024×500
│   ├── screenshot-1-dashboard.png
│   ├── screenshot-2-solar.png
│   ├── screenshot-3-calculators.png
│   ├── screenshot-4-ai.png
│   ├── screenshot-5-reports.png
│   ├── screenshot-6-hybrid.png
│   └── PLAY_STORE_LISTING.md       # copy-paste listing content
└── README.md
```

---

## 💰 Monetization Roadmap

- **Free**: All calculators + dashboards + AR + bring-your-own AI key
- **Pro (₹99 one-time)**: Unlimited PDF reports, custom branding, removed ads
- **Consultancy Edition**: Brand customization for solar EPC companies

---

## 🔮 Future Ideas (V4)

- [ ] Cloud sync (Firebase) for projects
- [ ] Real IoT MQTT integration for actual smart-grid data
- [ ] Auto-generated PowerPoint export
- [ ] Marathi, Bengali, Gujarati, Kannada language packs
- [ ] AdMob integration for free tier
- [ ] Google Play Billing for Pro upgrade
- [ ] More state-specific compliance (CEA, BEE labels)

---

## 📝 License

Free to use, modify, rebrand and publish on Play Store as your own.

---

**Made with ⚡ for engineers, by engineers.**
