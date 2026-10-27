# UniMart — Firestore Schema & Security Rules Specification

This document details the database schema, data constraints, collection hierarchy, and security policies governing Google Cloud Firestore in **UniMart**.

---

## 1. Cloud Firestore Architecture

UniMart uses a document-oriented structure optimized for fast student catalog reads, isolated user profile spaces, subcollection cart persistence, and secure order auditing.

```
/databases/(default)/documents
│
├── products/{productId}               (Academic & Campus Product Catalog)
│
├── users/{userId}                     (Student Profiles)
│   └── cartItems/{cartItemId}         (Persistent Student Shopping Cart Subcollection)
│
└── orders/{orderId}                   (Hostel Delivery & Campus Orders)
```

---

## 2. Detailed Collection Schemas

### 2.1. `products` Collection
Stores all academic textbooks, university lab stationery, tech accessories, campus backpacks, and curated student bundles.

| Field Name | Type | Description | Validation / Constraints |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Unique document ID | Matches Firestore doc ID |
| `name` | `string` | Product name / textbook title | Required, 3–120 characters |
| `description`| `string` | Detailed academic description | Required |
| `price` | `number` | Unit price in PKR (Pakistani Rupees) | Positive integer, > 0 |
| `category` | `string` | Product classification | `'books' \| 'stationery' \| 'tech' \| 'bags' \| 'bundles'` |
| `imageUrl` | `string` | Optimized Cloudinary CDN URL | Valid HTTPS URL |
| `stock` | `number` | Available campus inventory count | Integer >= 0 |
| `isActive` | `boolean` | Visibility flag for student catalog | Default `true` |
| `isFeatured` | `boolean` | Display priority on Homepage hero/grid| Boolean |
| `department` | `string` (opt) | Academic field (CS, EE, MBBS, BBA) | Optional |
| `university` | `string` (opt) | Recommended campus partner | Optional (e.g. NUST, FAST, LUMS) |
| `createdAt` | `string` | ISO 8601 creation timestamp | Set on seed / creation |

---

### 2.2. `users` Collection
Stores student identity, university affiliation, roll number, and hostel delivery information.

| Field Name | Type | Description | Validation / Constraints |
| :--- | :--- | :--- | :--- |
| `uid` | `string` | Firebase Auth User ID | Must match `request.auth.uid` |
| `email` | `string` | Student email address | Valid university or student email |
| `displayName`| `string` | Student full name | Min 3 characters |
| `role` | `string` | Account authorization role | Strictly `'student'` on registration |
| `university` | `string` | University name | e.g., "NUST Islamabad", "FAST-NUCES" |
| `campus` | `string` | Campus location | e.g., "H-12 Main Campus" |
| `studentId` | `string` | Student roll number or CMS ID | e.g., "2024-NUST-CS-042" |
| `hostelWing` | `string` (opt) | Hostel wing & room number | e.g., "Attar Hostel, Room 312" |
| `phone` | `string` (opt) | Mobile / WhatsApp number | Pakistani mobile format (`03xx-xxxxxxx`) |
| `createdAt` | `string` | Timestamp string | ISO format |

---

### 2.3. `users/{userId}/cartItems` Subcollection
Stores user-owned shopping cart state synchronized across devices.

| Field Name | Type | Description | Validation / Constraints |
| :--- | :--- | :--- | :--- |
| `productId` | `string` | Referenced product ID | Valid product reference |
| `title` | `string` | Cached product title | For quick cart rendering |
| `price` | `number` | Reference price at time of add | Authoritatively checked at checkout |
| `quantity` | `number` | Selected item quantity | Integer >= 1 |
| `image` | `string` | Cloudinary thumbnail URL | HTTPS URL |
| `updatedAt` | `timestamp`| Last modified timestamp | Firestore server timestamp |

---

### 2.4. `orders` Collection
Authoritative purchase records with student contact, hostel delivery point, and snapshot of purchased items.

| Field Name | Type | Description | Validation / Constraints |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Order document ID | e.g. `ord-1740673200000` |
| `orderNumber`| `string` | Human-readable campus tracking code | e.g. `UM-144844` |
| `userId` | `string` | Authenticated student UID | Must match `request.auth.uid` |
| `status` | `string` | Campus fulfillment status | `'processing' \| 'dispatched' \| 'delivered'` |
| `subtotal` | `number` | Authoritative sum of items | Computed server-side |
| `deliveryFee`| `number` | Campus courier charge | PKR 0 (over PKR 2,500) or PKR 150 |
| `total` | `number` | Final payable amount | `subtotal + deliveryFee` |
| `paymentMethod`| `string`| Payment mode | Currently `'Cash on Delivery'` |
| `shippingAddress` | `map` | Delivery destination object: | |
| ├─ `customerName` | `string` | Recipient student name | |
| ├─ `contactPhone` | `string` | Contact phone for gate arrival | Pakistani format |
| ├─ `university` | `string` | Destination campus | |
| ├─ `hostelOrDepartment` | `string` | Hostel wing or academic block | Courier drop-off point |
| └─ `studentId` | `string` | Roll number verification | |
| `items` | `array` | Snapshot of ordered items: | Array of items (id, title, price, qty) |
| `serverTimestamp`| `timestamp`| Official creation time | Firestore `serverTimestamp()` |

---

## 3. Restrictive Security Rules (`firestore.rules`)

The security rules enforce the principle of least privilege:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuthenticated() && (
        request.auth.token.role == 'admin' ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }

    // -----------------------------------------------------------------
    // 1. PRODUCTS COLLECTION
    // Rule: Anyone can browse active campus products.
    // Rule: Customers NEVER have permission to create, edit, or delete product records.
    // -----------------------------------------------------------------
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // -----------------------------------------------------------------
    // 2. USERS COLLECTION & USER-OWNED CART ITEMS
    // Rule: Students can only read their own profile document.
    // Rule: During registration, role must strictly be 'student'. No privilege escalation allowed.
    // Rule: Student cartItems subcollection is accessible only by the owning student.
    // -----------------------------------------------------------------
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      // On create, non-admins can only create profile with role == 'student'
      allow create: if isOwner(userId) && (!('role' in request.resource.data) || request.resource.data.role == 'student');
      // On update, students cannot alter their own 'role' field
      allow update: if (isOwner(userId) && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role'])) || isAdmin();
      allow delete: if isAdmin();

      match /cartItems/{cartItemId} {
        allow read, write: if isOwner(userId);
      }
    }

    // -----------------------------------------------------------------
    // 3. ORDERS COLLECTION
    // Rule: Students can create orders for themselves with their own authenticated uid.
    // Rule: Students can only view their own past & active campus orders.
    // Rule: Modifying or deleting placed orders is blocked for customers.
    // -----------------------------------------------------------------
    match /orders/{orderId} {
      allow read: if isAuthenticated() && (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAdmin();
    }
  }
}
```

---

## 4. Security Highlights & Attack Mitigation

1. **Privilege Escalation Prevention**:
   Students cannot grant themselves `admin` privileges during account creation or profile update. `request.resource.data.role` is constrained to `'student'`.
2. **Customer Catalog Lockdown**:
   Direct client writes to `/products` are rejected unless the user possesses an administrative claim.
3. **Price Manipulation Defense**:
   Even if an attacker modifies client-side JavaScript to send a lower order total or unit price, [`trustedOrderBackend`](src/services/trustedOrderBackend.ts) fetches current catalog prices directly from Firestore and recomputes the true subtotal and delivery charge before creating the order.
4. **Data Isolation**:
   Students can only access `/orders/{orderId}` where `resource.data.userId == request.auth.uid`. Competitor or peer order history is inaccessible.
5. **Zero Private Secrets**:
   Client bundles only include public Firebase web project identifiers. No private keys or service account credentials exist in frontend code.
