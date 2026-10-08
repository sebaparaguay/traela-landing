-- Apply once in a private Supabase project. Customer access goes through Next.js.
create table public.traela_conversations (
 id uuid primary key default gen_random_uuid(), customer_key_hash text unique not null,
 title text not null default 'Nueva conversación', status text not null default 'auto' check(status in ('auto','needs_quote','waiting_payment','in_progress','closed')),
 auto_enabled boolean not null default true, notes text not null default '',
 quote_pyg bigint, eta_start date, eta_end date,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.traela_messages (
 id uuid primary key default gen_random_uuid(), conversation_id uuid not null references public.traela_conversations(id) on delete cascade,
 role text not null check(role in ('user','assistant','operator')), text text not null,
 payload jsonb not null default '{}', created_at timestamptz not null default now()
);
create index on public.traela_messages(conversation_id,created_at);
create index on public.traela_conversations(updated_at desc);
alter table public.traela_conversations enable row level security;
alter table public.traela_messages enable row level security;
revoke all on public.traela_conversations, public.traela_messages from anon, authenticated;
grant all on public.traela_conversations, public.traela_messages to service_role;

create function public.traela_receive(p_hash text,p_text text,p_id uuid,p_payload jsonb)
returns jsonb language plpgsql security definer set search_path=public as $$
declare c traela_conversations; inserted uuid;
begin
 insert into traela_conversations(customer_key_hash,title) values(p_hash,left(p_text,100)) on conflict(customer_key_hash) do nothing;
 select * into c from traela_conversations where customer_key_hash=p_hash for update;
 insert into traela_messages(id,conversation_id,role,text,payload) values(p_id,c.id,'user',p_text,p_payload) on conflict(id) do nothing returning id into inserted;
 if inserted is not null then update traela_conversations set updated_at=now(),status=case when status='closed' then 'needs_quote' else status end where id=c.id; end if;
 return jsonb_build_object('id',c.id,'auto_enabled',c.auto_enabled,'duplicate',inserted is null);
end $$;
create function public.traela_publish_auto(p_id uuid,p_text text,p_payload jsonb,p_handoff boolean)
returns boolean language plpgsql security definer set search_path=public as $$
declare enabled boolean;
begin
 select auto_enabled into enabled from traela_conversations where id=p_id for update;
 if enabled is distinct from true then return false; end if;
 insert into traela_messages(conversation_id,role,text,payload) values(p_id,'assistant',p_text,p_payload);
 update traela_conversations set updated_at=now(),status=case when p_handoff then 'needs_quote' else status end,auto_enabled=not p_handoff where id=p_id;
 return true;
end $$;
create function public.traela_operator_action(p_id uuid,p_action text,p_text text,p_status text,p_auto boolean,p_notes text,p_price bigint,p_start date,p_end date)
returns boolean language plpgsql security definer set search_path=public as $$
begin
 perform 1 from traela_conversations where id=p_id for update;
 if not found then return false; end if;
 if p_action='reply' then
  insert into traela_messages(conversation_id,role,text) values(p_id,'operator',p_text);
  update traela_conversations set auto_enabled=false,updated_at=now() where id=p_id;
 elsif p_action='quote' then
  if p_price<=0 or p_start is null or p_end<p_start then raise exception 'Invalid quote'; end if;
  insert into traela_messages(conversation_id,role,text,payload) values(p_id,'operator',p_text,jsonb_build_object('quote',jsonb_build_object('price_pyg',p_price,'eta_start',p_start,'eta_end',p_end)));
  update traela_conversations set quote_pyg=p_price,eta_start=p_start,eta_end=p_end,status='waiting_payment',auto_enabled=false,updated_at=now() where id=p_id;
 elsif p_action='update' then
  update traela_conversations set status=coalesce(p_status,status),auto_enabled=coalesce(p_auto,auto_enabled),notes=coalesce(p_notes,notes),updated_at=now() where id=p_id;
 else raise exception 'Invalid action'; end if;
 return true;
end $$;
revoke all on function public.traela_receive(text,text,uuid,jsonb),public.traela_publish_auto(uuid,text,jsonb,boolean),public.traela_operator_action(uuid,text,text,text,boolean,text,bigint,date,date) from public,anon,authenticated;
grant execute on function public.traela_receive(text,text,uuid,jsonb),public.traela_publish_auto(uuid,text,jsonb,boolean),public.traela_operator_action(uuid,text,text,text,boolean,text,bigint,date,date) to service_role;
