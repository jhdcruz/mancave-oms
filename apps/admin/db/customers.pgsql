create table
  public.customers (
    id uuid not null,
    full_name text null default ''::text,
    email text not null default ''::text,
    phone text null default ''::text,
    billing_address text null default ''::text,
    shipping_address text null default ''::text,
    created_at timestamp with time zone not null default now(),
    last_updated timestamp with time zone null default (now() at time zone 'utc'::text),
    active boolean not null default false,
    avatar_url text null default ''::text,
    constraint customers_pkey primary key (id),
    constraint customers_email_key unique (email),
    constraint customers_id_fkey foreign key (id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;

create trigger handle_last_updated before
update on customers for each row
execute function moddatetime ('last_updated');