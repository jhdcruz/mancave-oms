create table
  public.employees (
    id uuid not null,
    first_name text null default ''::text,
    last_name text null default ''::text,
    middle_name text null default ''::text,
    email text null default ''::text,
    avatar_url text null default ''::text,
    last_updated timestamp with time zone null default (now() at time zone 'utc'::text),
    active boolean null default true,
    created_at timestamp with time zone null default (now() at time zone 'utc'::text),
    phone text null default ''::text,
    role  text null default 'Staff',
    auth_provider boolean not null default false,
    constraint profiles_pkey primary key (id),
    constraint employees_email_key unique (email),
    constraint employees_id_fkey foreign key (id) references auth.users (id) on update cascade on delete cascade,
    constraint employees_first_name_check check ((char_length(first_name) >= 0)),
    constraint employees_last_name_check check ((char_length(last_name) >= 0)),
    constraint employees_middle_name_check check ((char_length(middle_name) >= 0))
  ) tablespace pg_default;

create index if not exists employees_role_email_disabled_idx on public.employees using btree (role, email, active) tablespace pg_default;

create trigger handle_last_updated before
update on employees for each row
execute function moddatetime ('last_updated');