create table public.traela_push_config (
 id integer primary key check (id=1), public_key text not null, private_key text not null
);
create table public.traela_push_subscriptions (
 endpoint text primary key, keys jsonb not null, operator_email text not null,
 updated_at timestamptz not null default now()
);
alter table public.traela_push_config enable row level security;
alter table public.traela_push_subscriptions enable row level security;
revoke all on public.traela_push_config,public.traela_push_subscriptions from public,anon,authenticated;
grant select,insert,update,delete on public.traela_push_config,public.traela_push_subscriptions to service_role;
