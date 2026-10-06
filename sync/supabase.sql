-- Chạy một lần trong Supabase → SQL Editor. Mỗi tài khoản có đúng một dòng chứa toàn bộ dữ liệu học.
create table if not exists public.english_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.english_state enable row level security;

-- Chỉ chủ dòng mới đọc/ghi được dòng của mình (anon key công khai nhưng không đọc được dữ liệu người khác).
drop policy if exists "own row" on public.english_state;
create policy "own row" on public.english_state
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
