# UPND Membership System - Next.js Migration

## Setup Instructions

This project has been converted from React (Vite) to Next.js 15.1.6.

### Installation

Since npm install has been problematic, you have two options:

#### Option 1: Force Install (Recommended)
```bash
npm install --force
```

#### Option 2: Legacy Peer Deps
```bash
npm install --legacy-peer-deps
```

### Running the Project

After successful installation:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Project Structure

```
project/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page (Landing)
│   │   ├── admin/             # Admin login page
│   │   ├── register/          # Public registration
│   │   ├── success/           # Registration success
│   │   └── dashboard/         # Protected dashboard
│   ├── components/            # All React components
│   ├── context/               # Auth context
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilities & Supabase client
│   ├── types/                 # TypeScript types
│   └── data/                  # Static data
├── public/                    # Static assets
└── supabase/                  # Database migrations
```

### Key Changes from React to Next.js

1. **Routing**: Changed from `react-router-dom` to Next.js App Router
2. **Navigation**: Using `next/link` and `useRouter` from `next/navigation`
3. **Client Components**: Added `'use client'` directive to interactive components
4. **Environment Variables**: Changed from `VITE_*` to `NEXT_PUBLIC_*`
5. **Supabase Client**: Updated to work with Next.js environment

### Environment Variables

The `.env.local` file contains:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Demo Accounts

- **National Admin**: admin@upnd.zm / upnd2024
- **Provincial Admin**: provincial@upnd.zm / upnd2024
- **District Admin**: district@upnd.zm / upnd2024
- **Branch Admin**: branch@upnd.zm / upnd2024

### Features

All original features are preserved:
- Public landing page
- Member registration
- Admin authentication
- Member management
- Event management
- Disciplinary cases
- Membership cards
- Geo mapping
- Communications
- Reports & Analytics

### Troubleshooting

If you encounter issues:

1. Delete `node_modules` and `.next`:
   ```bash
   rm -rf node_modules .next
   ```

2. Try installing with force flag:
   ```bash
   npm install --force
   ```

3. Clear npm cache if needed:
   ```bash
   npm cache clean --force
   ```
