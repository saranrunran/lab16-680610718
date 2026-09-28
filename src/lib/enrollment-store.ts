import { create } from "zustand";

import {
  students as initialStudents,
  courses as initialCourses,
} from "@/lib/mock-data";
import type { Course, Student } from "@/lib/types";
import { persist } from "zustand/middleware";

type EnrollmentStore = {
  students: Student[];
  courses: Course[];

  //เพิ่มวิชานั้นๆ
  addCourse: (course: Course) => void;
  //ลบผู้สอน
  removeInstruc: (instruc: string, courseId: string) => void;
  //ลงทะเบียนนศ
  enrollStudent: (studentId: string[], courseId: string) => void;
  //ลบนศแค่อันใดอันนึงไม่ทั้งหมด
  unenrollStudent: (studentId: string, courseId: string) => void;
  /** ลบนักศึกษา พร้อมการลงทะเบียนทั้งหมดของคนนั้น */
  removeStudent: (studentId: string) => void;
  /** ลบวิชาออกจากรายวิชาที่เปิดสอน พร้อม cascade ลบ enrollment ที่อ้างถึงวิชานั้นทั้งหมด */
  removeCourse: (courseId: string) => void;
};

export const useEnrollmentStore = create<EnrollmentStore>()(
  persist (
    (set) => ({
      students: initialStudents,
      courses: initialCourses,

      addCourse: (course) =>
        set((state)=>({
          courses: [...state.courses, course]
        })),

      removeInstruc: (instruc, courseId) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.courseCode === courseId
            ? {
              ...course,
              instructors: (course.instructors)?.filter(
                (i) => i !== instruc,
              ),
            }
            : course
          ),
        })),

      enrollStudent: (studentId, courseId) =>
        set((state) => ({
          students: state.students.map((s) => {
            if (studentId.includes(s.studentId)) {
              if(s.enrolledCourses?.includes(courseId)) return s;
              return {
                ...s,
                enrolledCourses: [...(s.enrolledCourses || []), courseId],
              };
            }
            return s;
          })
        })),

      unenrollStudent: (studentId, courseId) =>
        set((state) => ({
          students: state.students.map((s) => 
            s.studentId === studentId
            ? {
              ...s,
              enrolledCourses: (s.enrolledCourses || []).filter((c) => c !== courseId),
            } : s,
          ),
        })),

      removeStudent: (studentId) =>
        set((state) => ({
          students: state.students.filter((s) => s.studentId !== studentId),
          // enrollments: state.enrollments.filter((e) => e.studentId !== studentId),
        })),

      removeCourse: (courseId) => //ลบวิชาออก วิชาหาย นักเรียนที่ลงวิชานั้น ก้จะหายไปด้วย
        set((state) => ({
          courses: state.courses.filter((c) => c.courseCode !== courseId), //เอาเหลือแค่ที่เหลือ
          students: state.students.map((std) => ({
            ...std,
            enrolledCourses: std.enrolledCourses?.filter((c) => c !== courseId) ?? [],
          }),
          ),
        })),
    }),
    {
      name: "lab16-2569-680610718",
      partialize: (state) => ({
        students: state.students,
        courses: state.courses,
      }),
    },
  ),
);
