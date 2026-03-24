-- Campus First Aid Identity System Migration
-- Creates profiles, classes, class_students, learning_records tables with RLS

-- 1. User Profiles Table (extends Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text not null,
  role text check (role in ('student', 'teacher', 'admin')) not null default 'student',
  stage text check (stage in ('primary', 'middle', 'high')), -- student's education stage
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Classes Table
create table if not exists public.classes (
  id uuid default gen_random_uuid() primary key,
  name text not null, -- e.g., "Grade 3 Class A"
  stage text not null check (stage in ('primary', 'middle', 'high')),
  teacher_id uuid references public.profiles(id),
  invite_code text unique, -- class invitation code for self-enrollment
  created_at timestamptz default now()
);

-- 3. Class-Student Relationship Table (many-to-many)
create table if not exists public.class_students (
  id uuid default gen_random_uuid() primary key,
  class_id uuid references public.classes(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  joined_at timestamptz default now(),
  unique(class_id, student_id)
);

-- 4. Learning Records Table (structured learning data)
create table if not exists public.learning_records (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.profiles(id) on delete cascade,
  stage text not null,
  module_type text check (module_type in ('lesson', 'quiz', 'scenario')),
  module_id text not null,
  score int check (score >= 0 and score <= 100),
  completion_time int, -- seconds
  answers jsonb, -- detailed answer data
  created_at timestamptz default now()
);

-- 5. Enable RLS
alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_students enable row level security;
alter table public.learning_records enable row level security;

-- 6. Helper function to check admin role (security definer to avoid recursion)
create or replace function public.is_admin()
returns boolean as $$
begin
  return (select role from public.profiles where id = auth.uid()) = 'admin';
exception
  when others then return false;
end;
$$ language plpgsql security definer;

-- 7. RLS Policies (FIXED: no recursion by using helper function)

-- Profiles: users can read/write own, teachers can read their class students, admin can read all
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
  
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Teachers can view class student profiles" on public.profiles
  for select using (
    auth.uid() in (
      select c.teacher_id from public.classes c
      join public.class_students cs on cs.class_id = c.id
      where cs.student_id = profiles.id
    )
  );

create policy "Admin full access on profiles" on public.profiles
  for all using (public.is_admin());

-- Classes: teachers manage their own, students view their enrolled classes, admin manages all
create policy "Teachers can manage their classes" on public.classes
  for all using (teacher_id = auth.uid())
  with check (teacher_id = auth.uid());

create policy "Students can view enrolled classes" on public.classes
  for select using (
    id in (
      select class_id from public.class_students 
      where student_id = auth.uid()
    )
  );

create policy "Admin full access on classes" on public.classes
  for all using (public.is_admin());

-- Class_students: teachers manage students in their classes
create policy "Teachers can manage class students" on public.class_students
  for all using (
    class_id in (select id from public.classes where teacher_id = auth.uid())
  );

create policy "Students can view own class relationships" on public.class_students
  for select using (student_id = auth.uid());

create policy "Admin full access on class_students" on public.class_students
  for all using (public.is_admin());

-- Learning_records: students view own, teachers view class students', admin views all
create policy "Students can view own records" on public.learning_records
  for select using (student_id = auth.uid());

create policy "Students can insert own records" on public.learning_records
  for insert with check (student_id = auth.uid());

create policy "Teachers can view class records" on public.learning_records
  for select using (
    student_id in (
      select cs.student_id from public.class_students cs
      join public.classes c on c.id = cs.class_id
      where c.teacher_id = auth.uid()
    )
  );

create policy "Admin full access on learning_records" on public.learning_records
  for all using (public.is_admin());

-- 8. Trigger: Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, stage)
  values (
    new.id, 
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'stage'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if exists, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 9. Function to update timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists handle_profiles_updated_at on public.profiles;
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();
