# ERP

## Tech Stack

- [Next.js 14](https://nextjs.org)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com)
- [Lucide Icons](https://lucide.dev/)

### Monitoring & Analytics

- [Axiom](https://axiom.co)
- [Checkly](https://vercel.com/integrations/checkly)

### Utilities

- [Codacy](https://codacy.com)
- [Mend Renovate](https://www.mend.io/renovate-free/)
- [Mend Bolt](https://www.mend.io/free-developer-tools/bolt/)
- [Vercel](https://vercel.com)
- [Turborepo](https://turbo.build/)

## Development

### Prerequisites

- Node.js 20+
- PNPM
- Supabase Credentials

### Setup

1. Clone the repository

   ```bash
   git clone https://github.com/jhdcruz/erp.git
   ```

2. Install pnpm & dependencies

   - Run `scripts/setup.bat` on Windows; or,
   - [Manually](https://pnpm.io/installation#using-winget)

3. Make your changes.

## Deployment

### Clone and run locally

1. You'll first need a Supabase credentials:

   - Shared in GC; or,
   - Create your own [via the Supabase dashboard](https://database.new)

2. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found
   in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

3. You can now run the Next.js local development server:

   ```bash
   pnpm dev
   ```

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also
> run Supabase locally.
