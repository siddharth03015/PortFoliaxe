# Portfoliaxe — Full Stack Developer Portfolio

A premium, futuristic developer portfolio built with **Next.js**, **Tailwind CSS v4**, **Framer Motion**, **React Three Fiber**, **Node.js**, **Express**, and **MongoDB**.

---

## 📁 Project Structure

```
portfolio/
├── backend/          # Node.js + Express API
│   ├── models/       # Mongoose schemas
│   ├── routes/       # Express routers
│   ├── controllers/  # Business logic
│   ├── middleware/   # JWT auth guard
│   ├── seed.js       # DB seeder (auto-runs on first start)
│   └── server.js     # Entry point
│
└── frontend/         # Next.js app
    ├── app/          # App router pages
    │   ├── page.tsx                  # Home (all sections)
    │   ├── blog/[slug]/page.tsx      # Blog post detail
    │   ├── admin/page.tsx            # Admin dashboard
    │   └── admin/login/page.tsx      # Admin login
    ├── components/
    │   ├── 3d/       # React Three Fiber scene
    │   ├── sections/ # Hero, About, Skills, Projects, Experience, Blog, Contact
    │   └── ui/       # Navbar, Footer, ScrollProgress
    └── lib/          # API client, auth context
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

---

### 1. Backend Setup

```bash
cd backend
npm install

# Edit .env if needed (MongoDB URI, JWT secret, admin credentials)
# Default: mongodb://localhost:27017/dhruv_portfolio
# Admin:   username=admin, password=admin123

npm run dev    # Development (nodemon)
# or
npm start      # Production
```

The backend runs at **http://localhost:5000**. On first start, the seed script automatically:
- Creates the admin user (`admin` / `admin123`)
- Seeds 4 sample projects and 2 blog posts

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at **http://localhost:3000**.

---

## 🔑 Admin Dashboard

- URL: http://localhost:3000/admin/login
- Username: `admin`
- Password: `admin123`

**Admin Features:**
- ✅ Add / Edit / Delete Projects
- ✅ Add / Edit / Delete Blog Posts (Markdown)
- ✅ View Contact Messages

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | — | Admin login |
| GET | `/api/auth/me` | ✅ | Get admin profile |
| GET | `/api/projects` | — | List projects |
| POST | `/api/projects` | ✅ | Create project |
| PUT | `/api/projects/:id` | ✅ | Update project |
| DELETE | `/api/projects/:id` | ✅ | Delete project |
| GET | `/api/blog` | — | List blog posts |
| GET | `/api/blog/:slug` | — | Get single post |
| POST | `/api/blog` | ✅ | Create post |
| PUT | `/api/blog/:id` | ✅ | Update post |
| DELETE | `/api/blog/:id` | ✅ | Delete post |
| POST | `/api/contact` | — | Send message |
| GET | `/api/contact` | ✅ | View messages |

---

## 🚀 Deployment

### Frontend → Vercel
```bash
# Install Vercel CLI
npm install -g vercel

cd frontend
vercel

# Set environment variable in Vercel dashboard:
# NEXT_PUBLIC_API_URL = https://your-backend.onrender.com/api
```

### Backend → Render / Railway
1. Push your `backend/` folder to a GitHub repository
2. Connect to [Render](https://render.com) or [Railway](https://railway.app)
3. Set environment variables:
   ```
   MONGODB_URI=mongodb+srv://...   (MongoDB Atlas URI)
   JWT_SECRET=your_super_secret
   CLIENT_URL=https://your-vercel-app.vercel.app
   PORT=5000
   ```

### MongoDB Atlas (Cloud)
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Get your connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
3. Update `MONGODB_URI` in backend `.env`

---
Live Link for the Dynamic Portfolio Generator:-https://dynamic-portfolio-generator.vercel.app/

## ✨ Features

| Feature | Status |
|---------|--------|
| 3D animated hero (React Three Fiber) | ✅ |
| Framer Motion page transitions & scroll animations | ✅ |
| Dark / Light theme toggle | ✅ |
| Scroll progress indicator | ✅ |
| Skills with animated progress bars | ✅ |
| Projects fetched from API + filtering | ✅ |
| 3D tilt hover on project cards | ✅ |
| Experience timeline | ✅ |
| Blog with Markdown support | ✅ |
| Blog search & tag filtering | ✅ |
| Contact form → MongoDB storage | ✅ |
| Admin dashboard (JWT protected) | ✅ |
| CRUD for Projects & Blog Posts | ✅ |
| Fully responsive mobile layout | ✅ |
| SEO meta tags | ✅ |
