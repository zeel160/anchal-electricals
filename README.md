# Anchal Electricals – Full Stack Web Application

**Student:** Zeel Padhiyar | **Project Type:** Final Year Internship (MERN Stack)  
**Organization:** Anchal Electricals, Shop 14/16, Nirant Shopping Centre, C.T.M., Ahmedabad – 380026

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js 18, React Router v6, Recharts, React Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose ODM |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Styling | Custom CSS (no framework) |
| PDF/Print | Browser native print API |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm

### 1. Clone & Setup

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET
```

### 3. Run Development Servers

```bash
# Terminal 1 – Backend (port 5000)
cd server
npm run dev

# Terminal 2 – Frontend (port 3000)
cd client
npm start
```

### 4. Create First Admin User

Send a POST request to:
```
POST http://localhost:5000/api/auth/setup
{
  "name": "Admin",
  "email": "admin@anchalelectricals.com",
  "password": "your_password"
}
```

Or use a tool like Postman / Thunder Client.

---

## 📁 Project Structure

```
anchal-electricals/
├── server/
│   ├── index.js           # Entry point
│   ├── models/            # MongoDB schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Invoice.js
│   │   └── Inquiry.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── invoices.js
│   │   ├── inquiries.js
│   │   ├── customers.js
│   │   └── stats.js
│   └── middleware/
│       └── auth.js        # JWT middleware
│
└── client/
    └── src/
        ├── App.js          # Routes
        ├── context/
        │   └── AuthContext.js
        ├── components/
        │   ├── Layout.js        # Public navbar + footer
        │   └── AdminLayout.js   # Admin sidebar
        └── pages/
            ├── HomePage.js
            ├── ProductsPage.js
            ├── AboutPage.js
            ├── ContactPage.js
            ├── LoginPage.js
            ├── Dashboard.js
            ├── AdminProducts.js
            ├── AdminInvoices.js
            ├── CreateInvoice.js
            ├── InvoiceDetail.js
            ├── AdminInquiries.js
            └── AdminCustomers.js
```

---

## ✨ Features

### Public Website
- **Home Page** – Hero, product categories, features, testimonials, WhatsApp CTA
- **Products Page** – Search, filter by category, pagination, WhatsApp enquiry
- **About Page** – Shop info, GSTIN, location
- **Contact Page** – Inquiry form, Google Map embed
- **Floating WhatsApp Button** on all pages

### Admin Dashboard
- **Dashboard** – Sales stats, bar chart, low-stock alerts, recent invoices
- **Products** – Full CRUD, search, stock tracking, low-stock badges
- **Invoices** – Create GST-compliant tax invoices with auto-numbering (2025-26/XXX format)
- **Invoice Detail** – Print/PDF, payment status update, complete billing layout
- **Customers** – Auto-aggregated from invoices, WhatsApp link per customer
- **Inquiries** – View and manage website contact inquiries with status tracking

### Business Logic
- Auto GST calculation (SGST 9% + CGST 9% for intra-state Gujarat)
- Invoice auto-numbering in format `2025-26/001`
- Round-off handling
- Low-stock alert system
- Role-based access control (admin / staff)

---

## 🗄️ API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/setup | ❌ | First-time admin setup |
| POST | /api/auth/login | ❌ | Login |
| GET | /api/auth/me | ✅ | Get current user |
| GET | /api/products | ❌ | List products (public) |
| POST | /api/products | ✅ Admin | Add product |
| PUT | /api/products/:id | ✅ Admin | Update product |
| DELETE | /api/products/:id | ✅ Admin | Soft delete |
| GET | /api/invoices | ✅ | List invoices |
| POST | /api/invoices | ✅ | Create invoice |
| GET | /api/invoices/:id | ✅ | Get invoice detail |
| PUT | /api/invoices/:id | ✅ | Update invoice |
| POST | /api/inquiries | ❌ | Submit inquiry (public) |
| GET | /api/inquiries | ✅ | List inquiries |
| GET | /api/customers | ✅ | Customer summary |
| GET | /api/stats | ✅ | Dashboard statistics |

---

## 🔐 Security Features
- Passwords hashed with bcryptjs (salt rounds: 12)
- JWT tokens with expiry
- Protected routes (frontend + backend)
- Admin-only middleware for sensitive operations
- Input validation

---

## 📦 Deployment
- **Frontend:** Netlify, Vercel, or any static hosting
- **Backend:** Render, Railway, or VPS
- **Database:** MongoDB Atlas (free tier available)

---

*Developed as a Final Year Internship Project for K.S. School of Business Management & IT, Gujarat University*
