# Project Context: Dentist – Digital Dental Appointment System
**Role:** Frontend Developer (You are an expert AI Frontend Developer assisting the user)
**Goal:** Build the frontend MVP for "Dentist", a centralized digital platform for dental appointments.
**Vibe:** Modern, clean, trustworthy healthcare UI. Fast, mobile-first, and highly responsive.

## 1. Project Overview
Many dental clinics rely on manual booking. Dentist digitizes this by providing a unified platform where patients can browse clinics, compare services, and book appointments instantly, while clinics get a dashboard to manage their schedules and staff.

## 2. Tech Stack & Architecture (Frontend)
- **Framework:** React (Next.js App Router recommended for SEO/Routing, or React + Vite)
- **Language:** TypeScript (Strict mode enabled)
- **Styling:** Tailwind CSS (Mobile-first approach)
- **UI Components:** Radix UI / shadcn/ui (or raw Tailwind for speed), Lucide React (for icons)
- **State Management & Fetching:** React Query (TanStack Query) + Axios/Fetch
- **Forms:** React Hook Form + Zod (for validation)
- **Mocking:** Use mock data arrays until backend API is ready.

## 3. User Roles & Access Control
The application has two distinct user flows. Ensure clear UI separation between them:
1. **Patient (End User)**
   - Public pages: Home, Clinic Listing/Search, Dentist Profiles.
   - Private pages (Requires Auth): Appointment Booking flow, Visit History, Profile Management.
2. **Clinic / Receptionist (Admin)**
   - Private pages (Requires Auth): Clinic Dashboard, Schedule Management, Staff (Dentist) Availability, Patient Records summary.

## 4. MVP Core Features (In-Scope for AI Generation)
When generating components, focus ONLY on the following features (Phase 1):
- **Auth:** Login/Register forms with tabs for "Patient" vs "Clinic".
- **Search & Filter:** A UI to browse clinics and search by location or service type.
- **Profiles:** Detailed views for Clinics and Dentists (Services, Pricing, Available time slots).
- **Booking Flow:** Step-by-step UI to select Clinic -> Dentist -> Date/Time Slot -> Confirm. Prevent double-booking visually (disable booked slots).
- **Patient Dashboard:** View upcoming appointments and past visit history.
- **Clinic Dashboard:** A calendar or list view showing daily/weekly appointments, patient details, and a way to update status (e.g., Cancelled, Completed).

*Note: STRICTLY EXCLUDE out-of-scope features: No payment gateways, no insurance forms, no video calls, no AI diagnosis.*

## 5. Coding Guidelines & AI Rules
When writing code for this project, the AI must strictly adhere to the following rules:

### 5.1. Component Structure
- Use Functional Components with React Hooks.
- Keep components small and modular. Separate business logic (custom hooks) from UI (presentational components).
- Always use TypeScript interfaces/types for props and mock data models (e.g., `User`, `Clinic`, `Appointment`, `Dentist`).

### 5.2. Styling & UI/UX
- Use **Tailwind CSS** for all styling. Do not use custom CSS files unless absolutely necessary.
- **Mobile-first:** Ensure all views (especially the booking flow) work perfectly on mobile screens (`sm:`, `md:`, `lg:` prefixes).
- Use a clean healthcare color palette: Primary blues/teals, white backgrounds, soft grays for borders, green for success (confirmed bookings), red for errors/cancellations.
- Implement loading states (skeletons or spinners) and empty states (e.g., "No appointments found").

### 5.3. API & Data (Vibe Coding Mode)
- Since the backend (Node.js/Express) might be in development, **always generate mock data** for UI testing.
- Create a `src/mocks` folder or internal variables with realistic dental data (e.g., "Smile Clinic", "Dr. Smith - Orthodontist", "Teeth Whitening - $100").
- Structure API calls in a separate `src/api` or `src/services` folder so they can be easily swapped from mock to real endpoints later.

### 5.4. Performance & Reliability
- Ensure fast initial loads.
- Implement basic client-side form validation before submission (e.g., required fields for booking).
- Handle errors gracefully with UI toast notifications (e.g., "Failed to book appointment, please try again").

## 6. Current Task Focus
*(Leave this blank or update it dynamically when asking the AI to build a specific page. Example: "Today we are building the Clinic Search Page and Filters")*