

# IEEE CS TEK-UP SBC Website - Implementation Plan

## Overview
A complete website for IEEE CS TEK-UP Student Branch Chapter featuring a dark theme with orange accents, dynamic public pages, and a full-featured admin panel powered by Supabase.

---

## 🎨 Design System
- **Theme**: Dark UI (near-black backgrounds `#0a0a0a` - `#1a1a1a`) with IEEE orange accents (`#F97316`)
- **Typography**: Inter font family with clean, modern styling
- **Components**: Rounded cards, soft orange glow effects, consistent spacing
- **Animations**: Framer Motion page transitions (fade + slide, 200ms), smooth scroll behaviors

---

## 🏗️ Core Structure

### Navigation (Sticky Header)
- Logo/brand on the left
- Menu links: Home, Events, Workshops, Bootcamps, Board, Contact
- Optional CTA button ("Join IEEE") - configurable from admin
- Mobile: Hamburger menu with slide-out drawer
- Active page indicator with orange styling

### Footer
- Dark background with TEK-UP location map (Google Maps embed or link)
- Social links (Facebook, Instagram, LinkedIn) from settings
- Contact email and quick navigation links
- Copyright notice (configurable)

### Sponsors Carousel
- Auto-scrolling logo carousel above the footer
- Pause on hover, responsive (1-6 logos based on viewport)
- Clickable logos open sponsor websites

---

## 📄 Public Pages

### Home Page
- **Full-screen hero** with gradient/image background, centered headline, CTA buttons
- Introduction section (markdown content from settings)
- Upcoming events/workshops/bootcamps preview cards
- "Latest from IEEE CS" section
- Sponsors carousel
- Newsletter signup form

### Events / Workshops / Bootcamps
- **List pages**: Filterable grid of cards showing title, date, excerpt, cover image
- **Detail pages**: Full content with cover image, dates, location, format, registration button, markdown description

### Board Page
- Grid/list of active board members with photos, names, positions, and LinkedIn links
- Ordered by display index

### Contact Page
- Contact form (name, email, subject, message)
- Displays contact info from settings
- Location map

---

## 🔐 Admin Panel (Protected Routes)

### Authentication
- Email/password login at `/admin/login`
- Seeded admin user via Supabase Edge Function (one-time execution)
- Credentials: `admin@ieee.cs` / `amenby123`
- Route protection + RLS enforcement

### Admin Dashboard (`/admin`)
- Summary cards: Total content items, upcoming events, drafts, active board members, active sponsors, unread messages
- Recent activity feed (last 10 updated items)
- Quick action buttons for creating new content

### Content Management (Events/Workshops/Bootcamps)
- List view with search, year filter, status filter, type filter
- Create/Edit form:
  - Title, auto-generated slug (editable)
  - Excerpt, dates, location, format
  - Cover image upload
  - Registration URL
  - **Rich markdown editor with live preview**
  - Status (draft/published)
- Actions: Save, Publish, Unpublish, Delete

### Board Members Management
- List view with drag-and-drop reordering
- Form: Full name, position, bio, photo upload, LinkedIn URL, active toggle
- Quick activate/deactivate and delete

### Sponsors Management
- List view with drag-and-drop reordering
- Form: Name, logo upload, website URL, active toggle
- Quick activate/deactivate and delete

### Messages Inbox
- List of contact form submissions
- Mark as read/unread, delete
- Export to CSV functionality

### Settings Page
- Site name, footer text, contact email
- Social media URLs (Facebook, Instagram, LinkedIn)
- Address/location text
- Home page intro (markdown)
- Maps embed URL
- Header CTA (optional text + URL)

### Newsletter Subscribers
- List of email subscribers
- Export to CSV
- Delete subscribers

---

## 🗄️ Supabase Database Schema

### Tables
1. **site_settings** - Singleton configuration (site name, social links, footer text, etc.)
2. **content_items** - Events, workshops, bootcamps with kind enum, status, markdown content
3. **board_members** - Member profiles with photos, positions, ordering
4. **sponsors** - Sponsor logos, URLs, ordering
5. **contact_messages** - Form submissions with read/unread status
6. **newsletter_subscribers** - Email list for newsletter signups

### Storage
- **Bucket**: `public-assets`
- Folders: `/covers`, `/board`, `/sponsors`
- Admin-only upload permissions

### Security (RLS Policies)
- Public read access for published content, active members/sponsors, and settings
- Public insert for contact messages and newsletter signups
- Admin-only (email = `admin@ieee.cs`) for all write operations
- Security definer function for admin email check

---

## ⚙️ Edge Function: Admin Seeder
- One-time execution function to create the admin user
- Uses service role key
- Creates user with `admin@ieee.cs` / `amenby123`
- Instructions provided to invoke once, then disable

---

## 🎬 Page Transitions
- Framer Motion `AnimatePresence` with React Router
- Fade + slight slide animation (200ms)
- Scroll to top on route change
- Smooth exit animations

---

## 📱 Responsive Design
- Mobile-first approach
- Hamburger navigation on mobile
- Responsive grids for content cards
- Touch-friendly admin interface

