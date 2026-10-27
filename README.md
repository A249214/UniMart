# UniMart — University Campus E-Commerce Platform

> **"Everything for your campus life."**  
> A tailored e-commerce experience engineered for university students across Pakistan (NUST, FAST-NUCES, LUMS, IBA, GIKI, UET, and partner campuses). Built with React, Vite, TypeScript, Firebase (Auth & Cloud Firestore), and Cloudinary Media CDN.

---

## Table of Contents
1. [Architecture & Tech Stack](#architecture--tech-stack)
2. [Environment Variables Setup](#environment-variables-setup)
3. [Firebase Integration & Configuration](#firebase-integration--configuration)
   - [Firebase Authentication](#firebase-authentication)
   - [Cloud Firestore Collections](#cloud-firestore-collections)
   - [Restrictive Firestore Security Rules](#restrictive-firestore-security-rules)
   - [Deploying Security Rules](#deploying-security-rules)
4. [Cloudinary Media Integration](#cloudinary-media-integration)
   - [Cloudinary Account & Unsigned Preset Setup](#cloudinary-account--unsigned-preset-setup)
   - [Client-Side Security (No Secrets in Frontend)](#client-side-security-no-secrets-in-frontend)
   - [Responsive Transformations & Fallback Component](#responsive-transformations--fallback-component)
5. [Sample Product Data Seeding](#sample-product-data-seeding)
   - [Method 1: In-App Diagnostics Modal (One-Click)](#method-1-in-app-diagnostics-modal-one-click)
   - [Method 2: Programmatic Seed Service](#method-2-programmatic-seed-service)
   - [Product Schema Details](#product-schema-details)
6. [Offline & Zero-Config Resilience](#offline--zero-config-resilience)
7. [Running Locally](#running-locally)

---

## Architecture & Tech Stack

- **Frontend Core**: React 18, Vite, TypeScript
- **Styling & Design System**: Tailwind CSS with custom academic palette:
  - *Deep Forest Green* (`#1E3A2F`, `#142921`, `#0D1C16`)
  - *Warm Ivory & Sand* (`#FAF7F2`, `#F4EFEA`, `#E8DDD1`)
  - *Muted Terracotta Clay* (`#C46A4A`, `#9A4F35`)
- **Backend Data**: Google Firebase (Authentication & Cloud Firestore)
- **Media Hosting & CDN**: Cloudinary with dynamic responsive transformations (`f_auto,q_auto,w_*`)
- **Icons**: Lucide React

---

## Environment Variables Setup

Copy `.env.example` to `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Populate the values from your Firebase Project Console and Cloudinary Dashboard:

```env
# =============================================================================
# UniMart Environment Configuration
# =============================================================================

# --- Firebase Configuration (Client SDK - Safe for Public Delivery) ---
VITE_FIREBASE_API_KEY=AIzaSyYourActualApiKeyHere12345
VITE_FIREBASE_AUTH_DOMAIN=unimart-campus.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=unimart-campus
VITE_FIREBASE_STORAGE_BUCKET=unimart-campus.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef0123456789

# --- Cloudinary Configuration (Media CDN & Unsigned Uploads) ---
VITE_CLOUDINARY_CLOUD_NAME=unimart-campus
VITE_CLOUDINARY_UPLOAD_PRESET=unimart_unsigned_preset
```

---

## Firebase Integration & Configuration

### Firebase Authentication
1. Navigate to the [Firebase Console](https://console.firebase.google.com/) and create a project (e.g., `unimart-campus`).
2. In the left sidebar, click **Build > Authentication**.
3. Click **Get Started**, choose **Email/Password** as the Sign-in provider, enable it, and save.
4. UniMart handles student signups with `authService.signUp(email, password, profileData)`, automatically creating the user in Firebase Auth and generating a matching student document in Firestore.

### Cloud Firestore Collections
UniMart uses the following collection hierarchy:

| Collection Path | Description | Access Policy |
| :--- | :--- | :--- |
| `products/{productId}` | Academic books, stationery, electronics, backpacks | Public read for active items; **Never writable by customers** |
| `users/{userId}` | Student profile (university, campus, roll number, hostel) | Accessible and writable only by the authenticated owner |
| `users/{userId}/cartItems/{itemId}` | Subcollection storing persistent user shopping cart | Authenticated owner only |
| `orders/{orderId}` | Campus delivery orders with hostel drop point & phone | Authenticated owner can create and view their own orders |

### Restrictive Firestore Security Rules
All database access is protected by restrictive rules defined in [`firestore.rules`](./firestore.rules). 

**Critical Security Guarantee:**  
Customers are **strictly forbidden** from creating, updating, or deleting arbitrary product documents. Catalog modifications require administrative rights.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Product Catalog: Public read-only for active items. CUSTOMERS CANNOT WRITE PRODUCTS.
    match /products/{productId} {
      allow read: if resource.data.isActive == true;
      allow write: if false; // Denies all customer writes
    }

    // User Profiles: Only the authenticated student can read or edit their profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // User-Owned Cart Items
      match /cartItems/{cartItemId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // Campus Orders: Students can create orders and inspect their own order history
    match /orders/{orderId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow update, delete: if false;
    }
  }
}
```

### Deploying Security Rules
Deploy the security rules using the Firebase CLI:

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to your Google account
firebase login

# Set active project
firebase use --add <your-project-id>

# Deploy only the Firestore rules
firebase deploy --only firestore:rules
```

---

## Cloudinary Media Integration

### Cloudinary Account & Unsigned Preset Setup
1. Sign up for a free account at [Cloudinary](https://cloudinary.com/).
2. From your Cloudinary Dashboard, copy your **Cloud Name** (e.g. `unimart-campus`).
3. Click **Settings (Gear Icon) > Upload > Upload presets**.
4. Click **Add upload preset**:
   - Preset Name: `unimart_unsigned_preset`
   - Signing Mode: **Unsigned** (Allows secure frontend image uploads directly from the browser)
   - Folder: `unimart/products` (optional, organizes images)
   - Incoming Transformations: `f_auto`, `q_auto`, `w_1200`
5. Save the preset.

### Client-Side Security (No Secrets in Frontend)
- **UniMart NEVER stores or exposes the Cloudinary API Secret** (`CLOUDINARY_API_SECRET`) in frontend JavaScript or `.env` bundles.
- Media uploads are performed via standard direct POST requests to Cloudinary's secure REST endpoint:
  ```
  POST https://api.cloudinary.com/v1_1/<cloud_name>/image/upload
  Body: { file: <image_file>, upload_preset: <unsigned_preset> }
  ```
- Image downloads strictly fetch optimized HTTPS URLs from `https://res.cloudinary.com/<cloud_name>/...`.

### Responsive Transformations & Fallback Component
The reusable [`CloudinaryImage`](src/components/common/CloudinaryImage.tsx) and [`ImageWithFallback`](src/components/common/ImageWithFallback.tsx) components provide:
- Automatic WebP/AVIF delivery using `f_auto,q_auto`.
- Dynamic responsive `srcset` (e.g. 320w, 640w, 960w, 1200w).
- Smooth shimmer skeleton while images download.
- Elegant SVG fallback placeholder if a remote image fails to load or the network drops.

---

## Sample Product Data Seeding

UniMart includes **17 curated, campus-ready products** specifically tailored for Pakistani university students (Engineering syllabi, Medical titles, FAST/NUST dot-grid lab notebooks, 65W GaN fast chargers, and anti-theft backpacks).

### Method 1: In-App Diagnostics Modal (One-Click)
1. Start the application: `npm run dev`.
2. Scroll to the footer on any page and click the **"Backend Status"** link in the bottom-left corner.
3. The diagnostics modal will display your live Firebase and Cloudinary connection status.
4. Click the green **"Seed 17 Sample Products to Firestore"** button.
5. All 17 items with Cloudinary HTTPS image links will be batched directly into your Firestore `products` collection.

### Method 2: Programmatic Seed Service
You can trigger seeding programmatically from anywhere in the codebase via:

```typescript
import { seedProductsToFirestore } from '@/services/seedService'

// Pass true to overwrite existing records with fresh sample data
const result = await seedProductsToFirestore(true)
console.log(`Seeded ${result.count} products to Firestore!`)
```

### Product Schema Details
Every Firestore document in the `products` collection conforms to the required schema:

```typescript
interface FirestoreProduct {
  id: string              // Unique Firestore document ID
  name: string            // Product title
  description: string     // Comprehensive university student description
  price: number           // Price in PKR (Pakistani Rupees)
  category: string        // 'stationery' | 'books' | 'tech' | 'bags' | 'bundles'
  imageUrl: string        // Full HTTPS Cloudinary or CDN image URL
  stock: number           // Available inventory quantity
  isActive: boolean       // Whether product is visible to students
  isFeatured: boolean     // Featured on homepage
  createdAt: string       // ISO 8601 timestamp string
}
```

---

## Offline & Zero-Config Resilience

UniMart is engineered with a **zero-crash fallback guarantee**:
- If `VITE_FIREBASE_API_KEY` is not yet configured, the app **never hangs or crashes**.
- Services (`productService`, `orderService`, `userService`, `authService`) detect offline mode and automatically fall back to the built-in 17 sample products and browser local storage.
- A **"Continue with Demo Student Account"** shortcut on Login and Register pages allows instant testing of student workflows, hostel checkout, and order histories without requiring an active Firebase billing setup.

---

---

## Production Deployment Guide

### 1. Lovable Publishing Workflow
UniMart is fully prepared for one-click publishing via the Lovable web workflow:
1. **Sync Repository**: Connect your GitHub repository (`UniMart2`) to Lovable.
2. **Environment Variables**: In the Lovable Project Settings dashboard, configure the required production variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`
3. **Build & Publish**: Lovable automatically executes `npm run build` using Vite. The included `public/_redirects` ensures all nested client routes (`/shop`, `/product/:id`, `/cart`, `/checkout`, `/orders`) resolve seamlessly without 404 errors.
4. **Custom Domain / Lovable URL**: Once published, your site is accessible via `https://<your-subdomain>.lovable.app`.

### 2. Firebase Authentication Authorized Domains
When deploying to production, Firebase Authentication requires your deployment domain to be registered:
1. Go to **Firebase Console** -> **Authentication** -> **Settings** tab.
2. Select **Authorized domains**.
3. Click **Add domain** and enter your production hosts:
   - `localhost` (default for local development & grading)
   - `<your-app>.lovable.app` (Lovable production domain)
   - `<your-app>.web.app` / `<your-app>.firebaseapp.com` (Firebase Hosting)
   - Custom university domain if applicable (e.g., `unimart.nust.edu.pk`)

### 3. SPA Direct Nested Route Refreshes
Single-page applications rely on client-side routing (`react-router-dom`). Without server rewrites, a direct browser refresh on `/checkout` or `/orders` results in HTTP 404. UniMart includes pre-configured rewrite configurations for all major hosts:
- **Lovable / Netlify**: Handled by [`public/_redirects`](public/_redirects) (`/* /index.html 200`).
- **Firebase Hosting**: Handled by [`firebase.json`](firebase.json) (`"rewrites": [{"source": "**", "destination": "/index.html"}]`).
- **Vercel**: Handled by [`vercel.json`](vercel.json) (`"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]`).

### 4. Trusted Order Backend & Security
Client-side price manipulation is strictly prevented:
- **Authoritative Price Lookups**: The [`trustedOrderBackend`](src/services/trustedOrderBackend.ts) ignores client-supplied totals and retrieves active prices directly from Firestore.
- **Stock Validation**: Inventory levels are checked authoritatively before confirming an order, deducting purchased units to prevent overselling.
- **Hostel Drop-off Verification**: Student roll numbers and Pakistani phone numbers (`03xx-xxxxxxx`) are validated prior to Firestore order document generation.
- **Zero Sensitive Credentials**: No Firebase private service account keys or Cloudinary API secrets are bundled in the client application or checked into Git.

---

## Deliverables & Documentation Index

| Document | Description |
| :--- | :--- |
| [QA Report](QA_REPORT.md) | Full end-to-end testing report, automated build validation, and edge-case verification |
| [Presentation Outline](PRESENTATION_OUTLINE.md) | Step-by-step presentation script, live demo walkthrough, and offline contingency plan |
| [Assignment Criteria Mapping](CRITERIA_MAPPING.md) | Exhaustive mapping of all project criteria to implemented code and features |
| [Firestore Schema & Security Rules](FIRESTORE_SCHEMA_AND_RULES.md) | Detailed database schema models, security rules breakdown, and role-based access control |
| [Security Rules File](firestore.rules) | Production-ready Firestore security rules file |

---

## Running Locally

```bash
# 1. Clone repository
git clone https://github.com/your-username/unimart.git
cd unimart

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional for live Firebase/Cloudinary)
cp .env.example .env.local

# 4. Start local development server
npm run dev

# 5. Build production bundle and check TypeScript types
npm run build

# 6. Preview production build locally
npm run preview
```

---

## License
MIT — Academic Project for University Campus Operations.

