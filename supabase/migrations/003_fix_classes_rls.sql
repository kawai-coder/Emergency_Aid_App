-- ============================================
-- FIX RLS RECURSION ON CLASSES TABLE
-- ============================================

-- The issue: "Teachers can manage their classes" policy references profiles through FK
-- Solution: Separate read and write policies, avoid FK checks in RLS

-- Drop ALL policies on classes table
drop policy if exists "Teachers can manage their classes" on classes;
drop policy if exists "Students can view enrolled classes" on classes;
drop policy if exists "Admin full access on classes" on classes;
drop policy if exists "老师管理班级" on classes;
drop policy if exists "学生查看班级" on classes;

-- ============================================
-- CREATE NON-RECURSIVE POLICIES FOR CLASSES
-- ============================================

-- Policy 1: Anyone can VIEW classes (read-only, no recursion)
-- This is safe because classes don't contain sensitive data
create policy "Anyone can view classes" on public.classes
  for select using (true);

-- Policy 2: Teachers can INSERT their own classes
-- Uses auth.uid() directly, no FK lookup
create policy "Teachers can create classes" on public.classes
  for insert with check (
    -- Must be setting themselves as teacher
    teacher_id = auth.uid()
  );

-- Policy 3: Teachers can UPDATE their own classes
create policy "Teachers can update own classes" on public.classes
  for update using (
    teacher_id = auth.uid()
  )
  with check (
    teacher_id = auth.uid()
  );

-- Policy 4: Teachers can DELETE their own classes
create policy "Teachers can delete own classes" on public.classes
  for delete using (
    teacher_id = auth.uid()
  );

-- Policy 5: Admin full access (uses security definer function)
create policy "Admin full access on classes" on public.classes
  for all using (public.is_admin());

-- ============================================
-- ALSO FIX PROFILES TABLE POLICIES (SIMPLER VERSION)
-- ============================================

-- Drop and recreate profiles policies to be safe
drop policy if exists "Teachers can view class student profiles" on profiles;

-- Simple version: Only allow users to view/update their own profile
create policy "Teachers can view class student profiles" on public.profiles
  for select using (
    -- User is the teacher of a class this student is in
    auth.uid() in (
      select c.teacher_id 
      from public.classes c
      join public.class_students cs on cs.class_id = c.id
      where cs.student_id = profiles.id
    )
  );
