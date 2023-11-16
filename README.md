# Ordering Management System

An ordering management system for Man Cave Supplies PH, Inc.

> In compliance to the course: `CIT 305 System Integration and Architecture`.

> [!NOTE]\
> The company mentioned above is imaginary, any similarity or conflict of a real-life company is purely coincidental.

## Architecture

<img src="./docs/overview.svg" width="100%" />

## Development

### Prerequisites

- [Node.js LTS](https://nodejs.org/en)
- [PNPM](https://pnpm.io/installation#using-winget)
- Supabase Credentials

### Setup

1. Clone and install deps:

   ```bash
   git clone https://github.com/jhdcruz/mancave-oms.git --depth 10
   cd mancave-oms
   pnpm i
   ```

2. You'll need a Supabase credentials:

   - Shared in GC; or,
   - Create your own [via the Supabase dashboard](https://database.new)

3. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found
   in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api).

4. You can now run the Next.js local development server,

   to run all apps (admin, staff, etc.):

   ```bash
   turbo dev
   ```

   to run single app:

   ```bash
   turbo dev --filter @mcsph/admin
   ```

## License

This project is distributed under [MIT License](./LICENSE.txt)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fjhdcruz%2Fmancave-oms.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fjhdcruz%2Fmancave-oms?ref=badge_large)
