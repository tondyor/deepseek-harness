# AI Coding Rules & Tech Stack Guidance

## Tech Stack
- **TypeScript**: Core language across the repository, enforced with strict type checking.
- **React**: Web application UI framework (used in `apps/web` with React Router for routing).
- **Tailwind CSS**: Utility-first styling for all visual styling and component layout.
- **shadcn/ui & Radix UI**: Prebuilt accessible UI component primitives and design system elements.
- **Lucide React**: Icon library (`lucide-react`) for UI icons and symbols.
- **Vite & tsdown**: Modern build tooling—Vite for web development and packaging, `tsdown` for library/host builds.
- **pnpm Workspaces**: Monorepo package management with multi-package architecture under `packages/` and `apps/`.
- **Vitest & Oxlint**: Test runner for unit, integration, and E2E testing, paired with Oxlint for fast linting.

## Library & Tooling Usage Rules

### 1. UI Components & Styling
- **shadcn/ui & Radix UI**: Use shadcn/ui components (`src/components/ui/`) and Radix UI primitives for all interactive elements (dialogs, menus, tabs, inputs, dropdowns). Do not rewrite native accessible controls from scratch when a primitive exists.
- **Tailwind CSS**: Apply Tailwind CSS utility classes directly for spacing, responsive layouts, colors, and typography. Avoid custom CSS files unless defining global CSS variables.

### 2. Icons
- **Lucide React**: Use `lucide-react` icons for all UI iconography. Keep icon sizes consistent using standard Tailwind sizing classes (e.g. `w-4 h-4`, `w-5 h-5`).

### 3. Routing & Page Structure
- **React Router**: Define and maintain application routes in `src/App.tsx`. Place individual page components inside `src/pages/` and shared UI components inside `src/components/`.

### 4. Build, Scripts & Execution
- **Vite**: Primary build tool and development server for web applications (`apps/web`).
- **tsdown & tsx**: Use `tsdown` for transpiling monorepo libraries and `tsx` for running TypeScript scripts without a separate build step.

### 5. Testing & Verification
- **Vitest**: Use Vitest (`vitest run`) for unit, snapshot, and integration testing. Keep test files alongside code using `.spec.ts` or `.test.tsx` naming conventions.
- **TypeScript & Oxlint**: Always run type checks and linting before completing code changes to ensure code quality and prevent runtime exceptions.
