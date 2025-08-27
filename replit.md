# Overview

This is a full-stack character sheet application built for tabletop role-playing games. The application allows users to create, edit, and manage detailed character profiles with extensive attributes including basic information, health/mana pools, skills, and various character statistics. It features a React frontend with a modern UI built using shadcn/ui components and an Express.js backend with PostgreSQL database support.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: React Hook Form for form state, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Type Safety**: Full TypeScript implementation with strict configuration

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful API with proper HTTP status codes and error handling
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Data Validation**: Zod schemas for runtime type validation
- **Storage Layer**: Abstracted storage interface with in-memory implementation (prepared for PostgreSQL migration)

## Database Design
- **Schema Definition**: Comprehensive character model with 50+ attributes covering:
  - Basic character info (name, age, race, class, level)
  - Resource pools (health, mana, macula, energy with current/max values)
  - Skills system with base values and bonuses
  - Combat and social attributes
  - Death saves and resurrection tracking
- **Type Generation**: Drizzle-zod integration for automatic TypeScript types from schema
- **Migration Ready**: Configured for PostgreSQL with migration support

## Development Environment
- **Hot Reload**: Vite dev server with HMR for frontend, tsx for backend hot reload
- **Code Quality**: ESLint and TypeScript strict mode
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Replit Integration**: Cartographer plugin and runtime error overlay for Replit environment

## Key Architectural Decisions

### Monorepo Structure
- **Problem**: Managing shared types between frontend and backend
- **Solution**: Shared schema directory with common TypeScript types and Zod schemas
- **Benefits**: Single source of truth for data models, compile-time type safety across stack

### Form Management Strategy
- **Problem**: Complex character sheet with many interdependent fields
- **Solution**: React Hook Form with Zod resolver for validation
- **Benefits**: Performant form handling, automatic validation, type-safe form data

### Database Abstraction
- **Problem**: Need flexibility for different storage backends
- **Solution**: Storage interface with pluggable implementations
- **Current**: In-memory storage for development
- **Future**: PostgreSQL implementation ready to swap in

### Component Architecture
- **Problem**: Consistent UI across complex forms
- **Solution**: shadcn/ui component system with Radix UI primitives
- **Benefits**: Accessible components, consistent design system, customizable themes

# External Dependencies

## Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form state management and validation
- **@hookform/resolvers**: Zod integration for form validation
- **wouter**: Lightweight routing library

## Database and Validation
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-zod**: Schema to Zod type generation
- **@neondatabase/serverless**: Neon PostgreSQL driver
- **zod**: Runtime type validation and schema definition

## UI and Styling
- **@radix-ui/react-***: Unstyled, accessible UI primitives (20+ components)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility
- **lucide-react**: Icon library

## Development Tools
- **vite**: Frontend build tool and dev server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation
- **embla-carousel-react**: Carousel component functionality