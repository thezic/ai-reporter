# AI Service Reporter

AI Service Reporter is a web application that uses AI to parse messages from publishers and generates a table with the results. This table can then be exported to CSV or Excel files.

## Features

- **AI-Powered Message Parsing**: Parse multiple publisher messages using OpenAI integration
- **Publisher Management**: Manage publisher data with editable table interface
- **Data Export**: Export reports to CSV or Excel formats
- **Persistent Storage**: Publishers and reports stored in IndexedDB, settings in LocalStorage
- **Edit Mode**: Toggle between view and edit modes for managing publisher data
- **Mobile-Friendly**: Responsive design with mobile card view and floating action buttons

## Technology Stack

- **Frontend**: SvelteKit 5 with TypeScript
- **Styling**: Tailwind CSS v4
- **AI Integration**: OpenAI API (GPT-4o)
- **Data Export**: XLSX library for Excel export
- **Storage**: IndexedDB for data persistence, LocalStorage for settings
- **Testing**: Vitest with Playwright for browser testing
- **Code Quality**: ESLint, Prettier, TypeScript

## Architecture

The application follows the Flux pattern with Svelte 5's reactive state management:

- **State Management**: `src/lib/state/` - AppState, PublisherState, ReportState, SettingsState
- **Services**: `src/lib/services/` - AIService, ExportService, Storage services
- **Components**: `src/lib/components/` - Reusable Svelte components
- **Types**: `src/lib/types/` - TypeScript interfaces

### Data Structure

- **Publishers**: Stored in IndexedDB with name, active status, hours, studies, and comments
- **Reports**: Linked to publishers, containing parsed data from AI processing
- **Settings**: Stored in LocalStorage, including AI service API key

## Getting Started

### Prerequisites

- Node.js (latest LTS version)
- pnpm package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```sh
   pnpm install
   ```

3. Set up your OpenAI API key in the Settings page when running the application

### Development

Start the development server:

```sh
pnpm dev

# or open in browser automatically
pnpm dev -- --open
```

### Available Commands

**Development:**
- `pnpm dev` - Start development server
- `pnpm dev -- --open` - Start dev server and open in browser

**Code Quality:**
- `pnpm lint` - Run Prettier check and ESLint
- `pnpm format` - Format code with Prettier
- `pnpm check` - Run Svelte type checking
- `pnpm check:watch` - Run type checking in watch mode

**Testing:**
- `pnpm test` - Run all tests once
- `pnpm test:unit` - Run tests in watch mode

**Build:**
- `pnpm build` - Create production build
- `pnpm preview` - Preview production build

## Usage

### Main Interface

1. **Message Input**: Paste multiple messages from publishers in the text area
2. **Parse Messages**: Click the parse button to process messages with AI
3. **View Results**: Review parsed data in the table view
4. **Edit Mode**: Toggle edit mode to add/delete publishers or modify data
5. **Export**: Export data to CSV or Excel format
6. **Clear Reports**: Clear report data while preserving publisher names

### Table Columns

- **Name**: Publisher name
- **Active**: Yes/No status (empty if no report given)
- **Hours**: Service hours (optional)
- **Studies**: Number of Bible studies (optional)
- **Comment**: Additional comments or activities

### Settings

Access the Settings page to configure:
- OpenAI API key for AI service integration

## AI Integration

The application uses a sophisticated prompt system defined in `reports.prompt.yml` to:
- Match messages to existing publishers using fuzzy matching
- Handle family reporting patterns
- Extract structured data (hours, studies, comments)
- Identify new publishers
- Provide reasoning for matching decisions

## File Structure

```
src/
├── routes/                 # SvelteKit routes and pages
│   ├── +page.svelte       # Main interface
│   └── settings/          # Settings page
├── lib/
│   ├── components/        # Reusable Svelte components
│   ├── services/          # Business logic services
│   ├── state/            # Reactive state management
│   └── types/            # TypeScript definitions
└── app.html              # HTML template
```

## Development Notes

- Uses Svelte 5 with the latest features
- Follows props-down, events-up component pattern
- Business logic is kept in state classes, not components
- All imports use `$lib` alias instead of relative paths
- Unit tests are co-located with components/classes
