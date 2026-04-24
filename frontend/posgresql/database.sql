/* ------------- */
/* Table - users */
/* ------------- */

/* Sync authentication table with user table */
create or replace function public.handle_new_users()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users(id, name, email, picture)
  values (new.id, new.raw_user_meta_data ->> 'name', new.email, new.raw_user_meta_data ->> 'picture');
  return new;
end;
$$;


create or replace trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_users();

/* ----  Policy  ---- */
/* Read */
alter policy "Only authenticated user can read their own data"
on "public"."users"
to authenticated
using (auth.uid() = id);


/* ------------- */
/* Table - conversations */
/* ------------- */

/* ----  Policy  ---- */
/* Read */
alter policy "only authenticatead can access their own conversation"
on "public"."conversations"
to authenticated
using (auth.uid() = user_id);

/* Insert */
alter policy "Only authenticated user can insert data for themselves"
on "public"."conversations"
to authenticated
with check (auth.uid() = user_id);


/* ------------- */
/* Table - messages */
/* ------------- */
alter policy "Only authenticated user can insert data for themselves"
on "public"."messages"
to authenticated
with check (auth.uid() = user_id);

/* ----  Policy  ---- */
/* Read */
alter policy "only authenticatead can access their own message"
on "public"."messages"
to authenticated
using (auth.uid() = user_id);





