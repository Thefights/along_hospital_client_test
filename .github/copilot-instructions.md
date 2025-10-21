# Along Hospital Client - AI Assistant Instructions

## Architecture Overview

This is a React 19 + Vite hospital management client application using Material-UI design system. Key architectural decisions:

- **Dual Layout System**: Role-based layouts (`LayoutGuest` for unauthenticated, `LayoutPatient` for authenticated users)
- **Route Segregation**: Separate route components (`RouteGuest.jsx`, `RoutePatient.jsx`) handle different user types with `ProtectedRoute` wrapper
- **Context-First State**: Uses React Context for auth (`AuthProvider`) and confirmations (`ConfirmationProvider`) with Redux for complex state
- **Generic Component Pattern**: Reusable components like `GenericTable`, `GenericFormDialog` handle most CRUD operations

## Development Patterns

### Import Convention
- Use `@/` alias for all internal imports (configured in `vite.config.js`)
- Example: `import useAuth from '@/hooks/useAuth'`

### Component Structure
Follow the established folder hierarchy:
```
components/
├── dialogs/        # Modal components
├── generals/       # Reusable UI components
├── layouts/        # Header, footer, navigation
├── skeletons/      # Loading states
├── tables/         # Table-related components
└── textFields/     # Form input components
```

### Custom Hooks Pattern
Located in `src/hooks/`, these provide core functionality:
- `useAuth()` - Authentication state and methods
- `useFetch(url, params, deps, fetchOnMount)` - API calls with loading/error states
- `useReduxStore({url, selector, setStore})` - Combines Redux with API fetching
- `useAxiosSubmit(url, method, data, params)` - Form submissions
- `useForm(initialValues)` - Form state management with validation

### Generic Components Usage

#### GenericTable
```jsx
const fields = [
  { key: 'id', title: 'ID', width: 10, sortable: true, fixedColumn: true },
  { key: 'name', title: 'Name', width: 30, sortable: true },
  { key: 'actions', title: 'Actions', render: (_, row) => <ActionButtons id={row.id} /> }
]

<GenericTable
  data={data}
  fields={fields}
  sort={sort}
  setSort={setSort}
  rowKey="id"
  loading={loading}
  stickyHeader={true}
/>
```

#### GenericFormDialog
```jsx
const fields = [
  { key: 'name', title: 'Name', validate: [maxLen(255)] },
  { key: 'email', title: 'Email', type: 'email' },
  { key: 'role', title: 'Role', type: 'select', options: ['User', 'Admin'] }
]

<GenericFormDialog
  open={dialogOpen}
  onClose={() => setDialogOpen(false)}
  fields={fields}
  submitUrl="/api/users"
  method="POST"
  onSuccess={(res) => handleSuccess(res)}
/>
```

### Theme System
- Uses custom hospital theme (`hospitalLightTheme`, `hospitalDarkTheme`) in `themeConfig.js`
- Extended Material-UI palette with `softBg`, `softBorder`, and `gradients` properties
- Lexend font family for modern medical aesthetic

### API Integration
- Centralized axios configuration in `configs/axiosConfig.js`
- Environment variables accessed via `getEnv()` utility from `utils/commons.js`
- Image URLs constructed with `getImageFromCloud()` helper

### State Management
- Redux Toolkit for complex state (user data, global settings)
- React Context for auth state and confirmations
- Local component state for UI interactions
- `useReduxStore` hook combines Redux with API fetching patterns

### Translation System
- `useTranslation()` hook provides `t()` function
- Locale files in `src/locales/` (en.json, vi.json)
- Translation keys follow dot notation: `t('header.home')`

#### Usage Rules (Important)
- Always call `t()` with a key only, without params. Example: `t('header.home')`.
- For now, when adding new translation keys, add them to `src/locales/en.json` only. Vietnamese updates can be done later.
- Prefer grouping keys under meaningful namespaces (e.g., `meeting_room.*`, `appointment.*`, `header.*`).
- Do not inline literal UI strings in components; use translation keys instead.

## Development Commands

```bash
npm run dev     # Start development server
npm run build   # Production build
npm run lint    # ESLint check
npm run preview # Preview production build
```

## Key Files to Understand

- `src/App.jsx` - Provider setup and main routing
- `src/configs/themeConfig.js` - Material-UI theme customization
- `src/components/tables/GenericTable.jsx` - Complex table implementation
- `src/components/dialogs/GenericFormDialog.jsx` - Form dialog patterns
- `src/hooks/useReduxStore.js` - Redux + API integration pattern
- `src/routes/RouteGuest.jsx` & `src/routes/RoutePatient.jsx` - Route organization