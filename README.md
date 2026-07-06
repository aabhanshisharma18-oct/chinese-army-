# PLA Command Atlas

A comprehensive Chinese Army / PLA details platform built with Angular 20+, providing theater command analysis, formation indexing, equipment mapping, and strategic force structure data.

## Features

- **Theater Command Analysis**: Detailed profiles of all five PLA theater commands
- **Formation Indexing**: Comprehensive data on group armies, brigades, and specialized units
- **Equipment Mapping**: Equipment inventories and modernization indicators
- **Readiness Assessments**: Operational readiness and deployment tracking
- **Analyst Notes**: Curated analysis from defense experts and research institutions
- **Interactive Overlays**: Detailed formation profiles and source references

## Tech Stack

- **Framework**: Angular 20+ (Standalone Components)
- **Language**: TypeScript
- **Styling**: SCSS with custom military-themed design system
- **State Management**: Angular Signals
- **Routing**: Angular Router
- **HTTP**: Angular HttpClient (ready for API integration)
- **Animations**: Angular Animations

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # Data models (Formation, AnalystNote)
│   │   └── services/        # Data services (FormationService, AnalystNoteService)
│   ├── features/
│   │   ├── home/            # Main page with all sections
│   │   ├── hero/            # Hero section with video background
│   │   ├── doctrine-overview/  # Strategic doctrine section
│   │   ├── operational-sectors/ # Analytical modules section
│   │   ├── formation-specs/ # Formation cards with drawer
│   │   ├── analyst-notes/   # Analyst observations rail
│   │   ├── data-coverage/  # Platform access tiers
│   │   ├── readiness-academy/ # Training & readiness section
│   │   ├── intelligence-query-form/ # Research request form
│   │   ├── faq/             # FAQ accordion
│   │   ├── sources-strip/   # Sources references
│   │   ├── footer/          # Footer with video background
│   │   ├── theater-commands/ # Theater commands overlay
│   │   ├── platform-access/ # Platform access overlay
│   │   └── about/           # About overlay
│   ├── layout/
│   │   ├── header/          # Floating pill navbar
│   │   └── staggered-menu/  # Slide-in menu
│   ├── shared/
│   │   └── components/
│   │       ├── ripple-trail/        # Canvas ripple effect
│   │       ├── formation-overlay/   # Formation details overlay
│   │       ├── unit-detail-drawer/  # Right-side sliding drawer
│   │       ├── cookie-consent/      # Cookie consent banner
│   │       └── sources-overlay/     # Sources references overlay
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── ...
├── assets/
│   ├── data/                # Mock data files
│   │   ├── formations.data.ts
│   │   └── analyst-notes.data.ts
│   └── videos/              # Video assets (9 MP4 files)
│       ├── hero-bg.mp4
│       ├── doctrine-bg.mp4
│       ├── formations-bg.mp4
│       ├── theater-eastern.mp4
│       ├── theater-southern.mp4
│       ├── theater-western.mp4
│       ├── training-bg.mp4
│       ├── command-center.mp4
│       └── closing-bg.mp4
├── main.ts
├── index.html
├── styles.scss
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`

### Build

```bash
ng build
```

Build artifacts will be stored in the `dist/` directory.

## Data Sources

All data is compiled from verified sources including:
- Official PLA publications
- Department of Defense reports
- IISS Military Balance
- SIPRI Database
- RAND Corporation research
- Jane's Defence Weekly
- CSIS Asia Maritime Transparency Initiative

## Design System

The platform uses a military-themed design system with:
- Dark graphite, steel, and muted olive color palette
- Restrained red and cold blue accents
- Glass morphism effects with backdrop blur
- Premium shadows and layered cards
- Cinematic video backgrounds
- Smooth animations and transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for informational and research purposes only. All data is derived from open-source intelligence and official publications.

## Disclaimer

This platform is for informational and research purposes only. All data is derived from open-source intelligence and official publications. Force structures and capabilities are subject to change and should be verified through multiple sources before use in operational planning or policy decisions.

## Project Documentation

For current implementation status and AI/developer continuation notes, read:

- `PROJECT_STATUS.md` — current progress, bugs, and priorities
- `PROJECT_HANDOFF.md` — detailed handoff for future developers or AI tools
- `AI_CONTEXT.md` — instructions for AI coding tools working in this repo
