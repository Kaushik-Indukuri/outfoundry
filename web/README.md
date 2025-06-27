# Outfoundry Web Application

This is the Next.js frontend application for Outfoundry, a lead enrichment and email automation platform.

## Getting Started

### Prerequisites

1. Node.js 18+ installed
2. Supabase project set up

### Environment Setup

Create a `.env.local` file in the `web` directory with your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Authentication**: Sign up, sign in, and sign out with Supabase Auth
- **Protected Routes**: Dashboard access requires authentication
- **Responsive Design**: Built with Tailwind CSS and shadcn/ui components
- **Type Safety**: Full TypeScript support

## Project Structure

```
web/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Protected dashboard page
│   ├── login/            # Sign in page
│   └── signup/           # Sign up page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── layout/           # Layout components (Navbar, Footer)
├── contexts/             # React contexts (AuthContext)
├── lib/                  # Utility functions and configurations
└── public/               # Static assets
```

## Authentication Flow

1. Users can sign up with email/password
2. Email confirmation is required (handled by Supabase)
3. Users can sign in with their credentials
4. Authenticated users are redirected to the dashboard
5. Protected routes automatically redirect unauthenticated users to login

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
