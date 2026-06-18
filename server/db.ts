import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  courses,
  enrollments,
  lessons,
  userBadges,
  badges,
  certificates,
  assessments,
  assessmentResults,
  communityPosts,
  events,
  consultants,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Courses queries
export async function getPublishedCourses(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(courses)
    .where(eq(courses.isPublished, true))
    .orderBy(desc(courses.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getCourseById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function searchCourses(query: string, level?: string, specialty?: string) {
  const db = await getDb();
  if (!db) return [];

  let conditions = [eq(courses.isPublished, true)];

  if (level) {
    conditions.push(eq(courses.level, level as any));
  }
  if (specialty) {
    conditions.push(eq(courses.specialty, specialty));
  }

  return db
    .select()
    .from(courses)
    .where(and(...conditions))
    .orderBy(desc(courses.enrollmentCount));
}

// Enrollments queries
export async function getUserEnrollments(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(enrollments).where(eq(enrollments.userId, userId));
}

export async function getEnrollmentByCourseAndUser(courseId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.courseId, courseId), eq(enrollments.userId, userId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Lessons queries
export async function getLessonsByCourse(courseId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, courseId))
    .orderBy(lessons.order);
}

// Gamification queries
export async function getUserBadges(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select({
      badge: badges,
      earnedAt: userBadges.earnedAt,
    })
    .from(userBadges)
    .innerJoin(badges, eq(userBadges.badgeId, badges.id))
    .where(eq(userBadges.userId, userId));
}

export async function getLeaderboard(limit = 10) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select({
      id: users.id,
      name: users.name,
      xpPoints: users.xpPoints,
      level: users.level,
    })
    .from(users)
    .orderBy(desc(users.xpPoints))
    .limit(limit);
}

// Certificates queries
export async function getUserCertificates(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(certificates).where(eq(certificates.userId, userId));
}

export async function getCertificateByNumber(certificateNumber: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(certificates)
    .where(eq(certificates.certificateNumber, certificateNumber))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Community queries
export async function getCommunityPosts(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(communityPosts)
    .orderBy(desc(communityPosts.createdAt))
    .limit(limit)
    .offset(offset);
}

// Events queries
export async function getUpcomingEvents(limit = 10) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(events)
    .where(sql`${events.startTime} > NOW()`)
    .orderBy(events.startTime)
    .limit(limit);
}

// Consultants queries
export async function getAvailableConsultants() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(consultants)
    .where(eq(consultants.isAvailable, true));
}

export async function getConsultantByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(consultants)
    .where(eq(consultants.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}
