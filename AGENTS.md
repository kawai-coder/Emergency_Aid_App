# Campus First Aid Interactive Learning Platform

## Project Overview

This is a **Next.js-based interactive learning platform** designed for teaching first aid to students across three educational stages: primary school, middle school, and high school. The application follows a "shared stage-aware architecture" where a single app shell adapts content, tone, and complexity based on the learner's stage.

The platform was built as a competition demo to demonstrate:
- A unified learning platform serving multiple age groups
- Stage-specific learning loops (lesson → quiz → scenario → feedback)
- Teacher dashboard with cross-stage analytics
- Optional Supabase integration with in-memory fallback for offline demos

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15.3.0** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript 5.8.3** | Type-safe development |
| **Tailwind CSS 3.4.17** | Utility-first styling |
| **XState 5.18.2** | State machine for branching scenarios |
| **Supabase** | Optional backend (falls back to in-memory store) |
| **ECharts** | Data visualization for teacher dashboard |

## Project Structure

```
Emergency_Aid_App/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout with AppShell
│   ├── globals.css               # Global styles + Tailwind
│   ├── api/                      # API routes
│   │   ├── lesson-complete/route.ts
│   │   ├── quiz-attempt/route.ts
│   │   └── scenario-attempt/route.ts
│   ├── stage/[stage]/page.tsx    # Stage overview pages
│   ├── lesson/[lessonSlug]/page.tsx
│   ├── quiz/[quizSlug]/page.tsx
│   ├── scenario/[scenarioSlug]/page.tsx
│   ├── results/[stage]/page.tsx
│   └── teacher/page.tsx          # Teacher dashboard
├── components/                   # React components
│   ├── AppShell.tsx              # Layout shell with navigation
│   ├── StageCard.tsx             # Stage selection card
│   ├── SectionCard.tsx           # Reusable card container
│   ├── LessonView.tsx            # Lesson content display
│   ├── QuizView.tsx              # Interactive quiz
│   ├── ScenarioView.tsx          # Branching scenario
│   ├── ResultsView.tsx           # Results feedback
│   └── TeacherDashboardClient.tsx
├── lib/                          # Application logic
│   ├── types/content.ts          # TypeScript definitions
│   ├── content/
│   │   ├── stages.ts             # Stage content registry
│   │   └── stage-data/           # Stage-specific content
│   │       ├── primary.ts
│   │       ├── middle.ts
│   │       └── high.ts
│   ├── state/
│   │   └── scenarioMachine.ts    # XState machine for scenarios
│   ├── utils/
│   │   ├── analytics.ts          # Teacher dashboard metrics
│   │   ├── storage.ts            # In-memory attempt store
│   │   └── classNames.ts         # CSS class utilities
│   └── supabase.ts               # Supabase client setup
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind theme customization
├── postcss.config.js             # PostCSS configuration
└── .eslintrc.json                # ESLint rules
```

## Build and Run Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Type check without emitting
npm run typecheck
```

## Content Model

The platform is built around **stages**, each containing a complete learning loop:

### StageKey
- `primary` - Primary school (friendly, visual, reassuring tone)
- `middle` - Middle school
- `high` - High school

### Content Types
Each stage provides:

1. **Lesson** - Educational content with sections, objectives, and takeaways
2. **Quiz** - Multiple-choice questions with explanations and competency tags
3. **Scenario** - Branching narrative with XState-driven state machine
4. **Results** - Feedback copy with awareness bands

### Data Location
All content is statically defined in:
- `lib/types/content.ts` - Type definitions
- `lib/content/stage-data/*.ts` - Stage-specific content (primary, middle, high)

## Routing

| Route | Purpose |
|-------|---------|
| `/` | Homepage with stage selection |
| `/stage/[stage]` | Stage overview (primary/middle/high) |
| `/lesson/[lessonSlug]` | Lesson content page |
| `/quiz/[quizSlug]` | Interactive quiz page |
| `/scenario/[scenarioSlug]` | Branching scenario simulation |
| `/results/[stage]` | Learning results and feedback |
| `/teacher` | Teacher dashboard with analytics |

## State Management

### Scenario State Machine (XState)
The branching scenarios use XState for state management:

```typescript
// lib/state/scenarioMachine.ts
- States: 'active'
- Events: 'CHOOSE' (select a choice), 'RESET' (restart)
- Context: currentNodeId, path history, readinessScore
```

### Data Persistence

The app supports two modes:

1. **Demo Mode (default)** - In-memory Map storage with seeded data
2. **Supabase Mode** - Connect to real Supabase backend

To enable Supabase, set environment variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

Storage utilities are in `lib/utils/storage.ts`.

## Code Style Guidelines

### TypeScript
- Strict mode enabled (`"strict": true`)
- Path alias `@/*` maps to project root
- Types defined in `lib/types/content.ts`

### Component Patterns
- Functional components with explicit props interfaces
- Use `SectionCard` as base container for content sections
- Tailwind for styling with custom color theme:
  - `ink` (#0f172a) - Primary dark
  - `sky` (#0ea5e9) - Primary accent
  - `mint` (#34d399) - Success states
  - `sand` (#f8fafc) - Light backgrounds
  - `glow` (#fef3c7) - Highlights

### CSS
- Tailwind utility classes preferred
- Custom styles in `globals.css` for:
  - Body gradient background
  - Selection highlighting
  - Smooth transitions on links

### API Routes
- Return JSON responses with appropriate status codes
- Validate stage keys using `isStageKey()`
- Use `storage.ts` utilities for data persistence

## Testing Strategy

Currently, this project does not include automated tests. Testing is manual:

1. Run `npm run dev` and verify all routes
2. Check each stage flow: lesson → quiz → scenario → results
3. Verify teacher dashboard displays analytics
4. Test with and without Supabase credentials

## Security Considerations

- Environment variables for Supabase credentials use `NEXT_PUBLIC_` prefix (client-side accessible)
- No authentication system implemented (demo/competition context)
- Data is stored in-memory by default (lost on server restart)
- API routes validate stage keys before processing

## Deployment

This is a standard Next.js application that can be deployed to:
- Vercel (recommended)
- Any Node.js hosting platform
- Static export (if API routes are not needed)

No special build steps required beyond standard Next.js build process.

## Adding New Stages

To add a new educational stage:

1. Update `StageKey` type in `lib/types/content.ts`
2. Create content file in `lib/content/stage-data/[stage].ts`
3. Add to `stageContentMap` in `lib/content/stages.ts`
4. Update type guards if needed

## Key Files for Developers

| File | Purpose |
|------|---------|
| `lib/types/content.ts` | All TypeScript interfaces |
| `lib/content/stages.ts` | Stage content registry |
| `lib/content/stage-data/*.ts` | Stage-specific content |
| `lib/state/scenarioMachine.ts` | XState scenario logic |
| `lib/utils/storage.ts` | Data persistence layer |
| `components/AppShell.tsx` | Common layout wrapper |
