# Tour Show

A multilingual, tablet-first tour presentation application built for tourism sales teams to quickly search, present, and share tour packages with customers.

## Overview

Tour Show is designed for in-person tour presentation workflows on tablets.  
It helps tourism sales agents find the right tour in seconds, display rich visuals and key tour details, and share public tour pages with customers via link, WhatsApp, or QR code.

The project focuses on a clean user experience, scalable front-end architecture, multilingual support, and production-minded engineering decisions.

## Core Features

- Tablet-first interface optimized for customer-facing usage
- Tour search by title and keywords
- Turkish character-tolerant and fuzzy search support
- Voice search with browser speech recognition
- Category-based filtering
- Rich tour detail pages with gallery support
- Shareable public tour pages
- Locale-preserving URLs for shared links
- QR code and WhatsApp sharing
- Modular i18n setup with `de`, `en`, and `tr`
- Firebase Firestore integration for content data
- Firebase Storage integration for media assets
- Seed script for sample tour data
- Skeleton loading states and custom not-found handling

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI Library:** Material UI
- **Backend / Data:** Firebase Firestore
- **Storage:** Firebase Storage
- **Internationalization:** Next.js-compatible i18n setup
- **Testing:** Vitest / Testing Library
- **Package Manager:** Npm

## Architecture Highlights

This project is built with maintainability and scalability in mind.

### Front-end Architecture

- App Router-based project structure
- Clear separation between server and client components
- Reusable, focused UI components
- Shared types, constants, helpers, and services extracted into dedicated modules
- Centralized Material UI theme and token structure

### Data Layer

- Firebase access is isolated behind service modules
- Raw Firestore documents are mapped into typed domain models before being used in the UI
- The codebase is structured to support future multilingual tour content without major refactors

### UX / Product Decisions

- Tablet-friendly spacing and touch targets
- Locale-aware routing for public pages
- Graceful fallbacks for unsupported browser APIs
- Skeleton-based loading experience instead of empty loading screens
- Polished empty, error, and no-result states

## Project Structure

```bash
app/
components/
features/
services/
theme/
types/
utils/
i18n/
messages/
scripts/
tests/
```
