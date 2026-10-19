# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React landing page template built with Vite, designed for GitHub Pages deployment. The project uses a component-based architecture with data-driven content management through JSON files.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint checks
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build and deploy to GitHub Pages
- `npm test` - Run tests (uses react-scripts)

## Architecture

### Data-Driven Content System
The project works like a small CMS: each landing page is a folder `src/data/projectN/` with the same JSON structure:
- `content-de.json` - German content
- `content-en.json` - English content

The page is selected with the query parameter `?project=N` (default and fallback: `project0`). `Context.jsx` discovers project folders via `import.meta.glob`, so adding a folder needs no code change. The language mode follows the files in the folder: only `content-de.json` → DE, only `content-en.json` → EN, both → BI (bilingual; only then the language switch is shown in the header).

Content is loaded in `Context.jsx` and passed down as props to components. This allows for easy content updates without touching component code.

### Component Structure
All components are functional React components in `src/components/`:
- `Header.jsx` - Navigation and logo
- `Hero.jsx` - Main hero section
- `Credentials.jsx` - Company logos/trust indicators
- `Features.jsx` - Product features showcase
- `Users.jsx` - Target audience sections
- `FAQ.jsx` - Frequently asked questions
- `CTASection.jsx` - Call-to-action section
- `Footer.jsx` - Site footer

Components receive data via props from the main content JSON, following the pattern:
```jsx
<ComponentName data={contentData.sectionName} />
```

### Styling
- CSS modules approach with `App.css` and `index.css`
- Component-specific styling follows BEM-like naming conventions
- Responsive design patterns implemented

### Deployment Configuration
- Configured for GitHub Pages deployment with base path `/react-landing-page-template/`
- Assets referenced with the base path prefix in JSON content
- `gh-pages` package handles automated deployment

## Key Patterns

### Conditional Rendering
Components can be conditionally shown using state:
```jsx
const [showFAQ, setShowFAQ] = useState(true);
{showFAQ && <FAQ data={contentData.faq} />}
```

### Asset Path Management
All asset URLs in content JSON files include the GitHub Pages base path for proper deployment.

### Internationalization Ready
The data structure supports multiple languages through separate JSON files, though switching logic is not implemented in the current version.