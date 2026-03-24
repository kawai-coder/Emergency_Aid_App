-- ============================================
-- FIX RLS INFINITE RECURSION - DROP ALL FIRST
-- ============================================

-- Drop ALL existing policies on all tables
drop policy if exists "Teachers can view class student profiles" on profiles;
drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Admin full access on profiles" on profiles;
drop policy if exists "个人查看自己档案" on profiles;
drop policy if exists "个人更新自己档案" on profiles;
drop policy if exists "老师查看班级学生档案" on profiles;

drop policy if exists "Teachers can manage their classes" on classes;
drop policy if exists "Students can view enrolled classes" on classes;
drop policy if exists "Admin full access on classes" on classes;
drop policy if exists "老师管理班级" on classes;
drop policy if exists "学生查看班级" on classes;

drop policy if exists "Teachers can manage class students" on class_students;
drop policy if exists "Students can view own class relationships" on class_students;
drop policy if exists "Admin full access on class_students" on class_students;
drop policy if exists "老师管理班级学生" on class_students;
drop policy if exists "学生查看自己班级关系" on class_students;

drop policy if exists "Learning records access policy" on learning_records;
drop policy if exists "Students can insert own records" on learning_records;
drop policy if exists "Students can view own records" on learning_records;
drop policy if exists "Teachers can view class records" on learning_records;
drop policy if exists "Admin full access on learning_records" on learning_records;
drop policy if exists "数据归属策略" on learning_records;
drop policy if exists "学生插入自己记录" on learning_records;

-- Drop helper function if exists
drop function if exists public.is_admin();

-- ============================================
-- CREATE FIXED POLICIES
-- ============================================

-- Create helper function (security definer avoids recursion)
create or replace function public.is_admin()
returns boolean as $$
begin
  return (select role from public.profiles where id = auth.uid()) = 'admin';
exception
  when others then return false;
end;
$$ language plpgsql security definer;

-- PROFILES policies
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

-- CLASSES policies
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

-- CLASS_STUDENTS policies
create policy "Teachers can manage class students" on public.class_students
  for all using (
    class_id in (select id from public.classes where teacher_id = auth.uid())
  );

create policy "Students can view own class relationships" on public.class_students
  for select using (student_id = auth.uid());

create policy "Admin full access on class_students" on public.class_students
  for all using (public.is_admin());

-- LEARNING_RECORDS policies
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
