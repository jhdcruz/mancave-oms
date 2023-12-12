create table
  public.orders (
    customer uuid null,
    total_price numeric not null default 0.00,
    created_at timestamp with time zone not null default (now() at time zone 'utc'::text),
    last_updated timestamp with time zone null default (now() at time zone 'utc'::text),
    disabled boolean not null default false,
    order_status text not null default 'Processing',
    payment text not null default 'cash',
    last_updated_by uuid null,
    payment_status boolean null default false,
    id uuid not null default gen_random_uuid (),
    constraint orders_pkey primary key (id),
    constraint orders_customer_fkey foreign key (customer) references customers (id) on update cascade on delete set null,
    constraint orders_last_updated_by_fkey foreign key (last_updated_by) references auth.users (id) on update cascade on delete set null
  ) tablespace pg_default;

create trigger handle_last_updated before
update on orders for each row
execute function moddatetime ('last_updated');