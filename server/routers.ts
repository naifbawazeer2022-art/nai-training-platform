import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getPublishedCourses,
  getCourseById,
  searchCourses,
  getUserEnrollments,
  getEnrollmentByCourseAndUser,
  getLessonsByCourse,
  getUserBadges,
  getLeaderboard,
  getUserCertificates,
  getCommunityPosts,
  getUpcomingEvents,
  getAvailableConsultants,
  getDb,
  getUserById,
} from "./db";
import { enrollments, courses, lessons, certificates, communityPosts } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Courses router
  courses: router({
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return getPublishedCourses(input.limit, input.offset);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getCourseById(input.id);
      }),

    search: publicProcedure
      .input(
        z.object({
          query: z.string(),
          level: z.string().optional(),
          specialty: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        return searchCourses(input.query, input.level, input.specialty);
      }),

    lessons: publicProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input }) => {
        return getLessonsByCourse(input.courseId);
      }),
  }),

  // Enrollments router
  enrollments: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserEnrollments(ctx.user.id);
    }),

    getByCoursAndUser: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        return getEnrollmentByCourseAndUser(input.courseId, ctx.user.id);
      }),

    enroll: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const course = await getCourseById(input.courseId);
        if (!course) throw new Error("Course not found");

        const lessonCount = await db
          .select()
          .from(lessons)
          .where(eq(lessons.courseId, input.courseId));

        await db.insert(enrollments).values({
          userId: ctx.user.id,
          courseId: input.courseId,
          totalLessons: lessonCount.length,
        });

        return { success: true };
      }),
  }),

  // Gamification router
  gamification: router({
    getUserStats: protectedProcedure.query(async ({ ctx }) => {
      const user = await getUserById(ctx.user.id);
      return {
        xpPoints: user?.xpPoints || 0,
        level: user?.level || 1,
        currentStreak: user?.currentStreak || 0,
        longestStreak: user?.longestStreak || 0,
      };
    }),

    getUserBadges: protectedProcedure.query(async ({ ctx }) => {
      return getUserBadges(ctx.user.id);
    }),

    getLeaderboard: publicProcedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(async ({ input }) => {
        return getLeaderboard(input.limit);
      }),
  }),

  // Certificates router
  certificates: router({
    getUserCertificates: protectedProcedure.query(async ({ ctx }) => {
      return getUserCertificates(ctx.user.id);
    }),

    verifyCertificate: publicProcedure
      .input(z.object({ certificateNumber: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db
          .select()
          .from(certificates)
          .where(eq(certificates.certificateNumber, input.certificateNumber))
          .limit(1);

        if (result.length === 0) {
          return { valid: false };
        }

        const cert = result[0];
        const user = await getUserById(cert.userId);
        const course = await getCourseById(cert.courseId);

        return {
          valid: true,
          certificateNumber: cert.certificateNumber,
          userName: user?.name,
          courseName: course?.title,
          issuedAt: cert.issuedAt,
          qrCode: cert.qrCode,
        };
      }),
  }),

  // Community router
  community: router({
    getPosts: publicProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return getCommunityPosts(input.limit, input.offset);
      }),

    createPost: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          content: z.string(),
          type: z.enum(["post", "question", "achievement"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.insert(communityPosts).values({
          userId: ctx.user.id,
          title: input.title,
          content: input.content,
          type: input.type,
        });

        return { success: true };
      }),
  }),

  // Events router
  events: router({
    getUpcoming: publicProcedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(async ({ input }) => {
        return getUpcomingEvents(input.limit);
      }),
  }),

  // Consultants router
  consultants: router({
    getAvailable: publicProcedure.query(async () => {
      return getAvailableConsultants();
    }),
  }),
});

export type AppRouter = typeof appRouter;
