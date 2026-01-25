<div align="center">

# 🔐 Personal Cabinet

### Enterprise-Level Authentication & User Management System

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Screenshots](#-screenshots) • [Documentation](#-documentation)

</div>

---

## 📖 About

**Personal Cabinet** is a production-ready, full-stack authentication module with an admin panel, designed for integration into any project. Built with modern technologies and best practices, it provides a complete user management solution out of the box.

### 🎯 Key Highlights

- ⚡ **Full-Stack TypeScript** - End-to-end type safety
- 🔐 **JWT Authentication** - Secure access & refresh tokens
- 👥 **Role-Based Access Control** - USER, ADMIN, SUPER_ADMIN
- 🎨 **Professional Design System** - Dark mode, design tokens, Framer Motion animations
- 📧 **Email Integration** - Verification, password reset, notifications
- 🛡️ **Security First** - bcrypt, XSS protection, CORS, rate limiting
- 📊 **Admin Dashboard** - User management, audit logs, analytics
- 📱 **Fully Responsive** - Mobile-first design

---

## ✨ Features

### 🔑 Authentication & Security
- ✅ **User Registration** with email verification
- ✅ **Login/Logout** with JWT access & refresh tokens
- ✅ **Password Reset** via email
- ✅ **Session Management** - View and terminate active sessions
- ✅ **Password Strength Indicator**
- ✅ **bcrypt** password hashing

### 👤 User Profile
- ✅ **View Profile** - Display name, avatar, username, email
- ✅ **Edit Profile** - Update personal information
- ✅ **Avatar Upload** with cropping and preview
- ✅ **Change Password**
- ✅ **Username System** with rate limiting (once per 30 days)

### 🛠 Admin Panel
- ✅ **Dashboard** - User statistics and activity graphs
- ✅ **User Management** - View, block/unblock, change roles, delete
- ✅ **Audit Logs** - Complete history of admin actions
- ✅ **System Settings** - Configure email, registration, limits

### 🎨 UI/UX
- ✅ **Dark/Light Mode** with smooth transitions
- ✅ **Design Tokens** - Professional 3-tier color system
- ✅ **Framer Motion** animations
- ✅ **Skeleton Loading States**
- ✅ **Toast Notifications**
- ✅ **Form Validation** - Real-time with Zod
- ✅ **Accessibility** - ARIA labels, keyboard navigation

---

## 🚀 Tech Stack

### Frontend
```
Next.js 14 (App Router) • React 18 • TypeScript 5.3
TailwindCSS 3.4 • Framer Motion 12 • React Hook Form
Zod • TanStack Query • Axios • Lucide Icons
```

### Backend
```
NestJS 10 • TypeScript 5.1 • Prisma ORM 5.7
PostgreSQL / SQLite • Passport JWT • bcrypt
Nodemailer • Winston Logger • Class Validator
```

### DevOps
```
Git • Vercel (Frontend) • PostgreSQL (Production)
Environment Variables • Prisma Migrations
```

---

## 📸 Screenshots

> **Примечание**: Добавьте скриншоты в папку `.github/screenshots/`

### Landing Page
![Landing Page](.github/screenshots/landing.png)

---

## ⚡ Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (или SQLite для development)
- npm или yarn

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Horman69/-Personal-Cabinet.git
cd -Personal-Cabinet
```

### 2️⃣ Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3️⃣ Environment Setup

**Backend** - Create `backend/.env`:
```env
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/personal_cabinet"
# For development with SQLite:
# DATABASE_URL="file:./dev.db"

# JWT Secrets (CHANGE IN PRODUCTION!)
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_EXPIRATION=900
JWT_REFRESH_EXPIRATION=604800

# Email (use your SMTP provider)
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT=2525
SMTP_USER="your-smtp-user"
SMTP_PASSWORD="your-smtp-password"
SMTP_FROM="noreply@personalcabinet.local"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
CORS_ORIGIN="http://localhost:3000"
```

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4️⃣ Database Setup

```bash
cd backend

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### 5️⃣ Run Development Servers

**Terminal 1 - Backend**:
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🚀

---

## 📁 Project Structure

```
personal-cabinet/
├── frontend/                 # Next.js Application
│   ├── src/
│   │   ├── app/             # App Router (Pages)
│   │   │   ├── login/       # Login page
│   │   │   ├── register/    # Registration page
│   │   │   ├── dashboard/   # User dashboard
│   │   │   ├── profile/     # User profile
│   │   │   └── admin/       # Admin panel
│   │   ├── components/      # React Components
│   │   │   ├── ui/          # UI Library (Button, Input, etc.)
│   │   │   └── layouts/     # Layout components
│   │   ├── design-tokens/   # Design system tokens
│   │   ├── lib/             # Utilities & API client
│   │   └── types/           # TypeScript types
│   └── package.json
│
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── users/           # Users module
│   │   ├── admin/           # Admin module
│   │   ├── profile/         # Profile module
│   │   ├── email/           # Email service
│   │   ├── upload/          # File upload
│   │   └── prisma/          # Prisma service
│   ├── prisma/              # Database schema & migrations
│   └── package.json
│
└── README.md
```

---

## 🔐 Security Features

- ✅ **bcrypt** password hashing (10 rounds)
- ✅ **JWT** access tokens (15 min expiry)
- ✅ **Refresh tokens** (7 days, stored in database)
- ✅ **CORS** configuration
- ✅ **XSS** protection
- ✅ **CSRF** tokens (coming soon)
- ✅ **Rate limiting** on sensitive endpoints
- ✅ **Input validation** (Zod on frontend, class-validator on backend)
- ✅ **SQL injection** protection (Prisma ORM)

---

## 📖 Documentation

- [Backend Setup](./backend/SETUP.md) - Detailed backend configuration
- [Frontend Setup](./frontend/SETUP.md) - Detailed frontend configuration  
- [Quick Start Guide](./QUICKSTART.md) - Step-by-step tutorial
- [API Documentation](#api-documentation) - REST API endpoints

---

## 🌐 Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   ```
4. Deploy!

### Backend (Railway / Render)

1. Create PostgreSQL database
2. Set environment variables (see `.env.example`)
3. Deploy backend
4. Run migrations: `npx prisma migrate deploy`

---

## 📊 Stats

- **📝 130 Files** - Well-organized codebase
- **💻 33,000+ LOC** - Comprehensive implementation
- **🎨 34 Components** - Reusable UI library
- **🔌 42 Backend Modules** - Modular architecture
- **🗄️ 5 Database Models** - User, Session, ActivityLog, AuditLog, SystemSetting

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ruslan Iskenderov**

- GitHub: [@Horman69](https://github.com/Horman69)
- Project Link: [Personal Cabinet](https://github.com/Horman69/-Personal-Cabinet)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ using Next.js and NestJS

</div>
