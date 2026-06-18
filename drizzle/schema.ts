import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
  date,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with additional fields for NAI platform.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  bio: text("bio"),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "instructor", "admin"]).default("user").notNull(),
  
  // Gamification fields
  xpPoints: int("xpPoints").default(0).notNull(),
  level: int("level").default(1).notNull(),
  currentStreak: int("currentStreak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  lastActivityDate: timestamp("lastActivityDate"),
  
  // Profile completion
  isProfileComplete: boolean("isProfileComplete").default(false).notNull(),
  specialization: varchar("specialization", { length: 255 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Courses table - main learning content
 */
export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail"),
  instructorId: int("instructorId").notNull(),
  
  // Course metadata
  level: mysqlEnum("level", ["beginner", "intermediate", "advanced"]).notNull(),
  specialty: varchar("specialty", { length: 100 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  duration: int("duration"), // in minutes
  
  // Course stats
  enrollmentCount: int("enrollmentCount").default(0).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: int("reviewCount").default(0).notNull(),
  
  // Status
  isPublished: boolean("isPublished").default(false).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

/**
 * Lessons table - individual lessons within courses
 */
export const lessons = mysqlTable("lessons", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  content: text("content"), // HTML or markdown
  order: int("order").notNull(),
  duration: int("duration"), // in minutes
  
  // Media
  videoUrl: text("videoUrl"),
  resources: json("resources"), // Array of resource URLs/files
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

/**
 * Course enrollments - tracks user progress
 */
export const enrollments = mysqlTable("enrollments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  
  // Progress
  completedLessons: int("completedLessons").default(0).notNull(),
  totalLessons: int("totalLessons").notNull(),
  progressPercentage: decimal("progressPercentage", { precision: 5, scale: 2 }).default("0"),
  
  // Assessment
  assessmentScore: decimal("assessmentScore", { precision: 5, scale: 2 }),
  assessmentPassed: boolean("assessmentPassed").default(false),
  
  // Certificate
  certificateId: int("certificateId"),
  certificateIssuedAt: timestamp("certificateIssuedAt"),
  
  // Timestamps
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;

/**
 * Lesson progress - tracks individual lesson completion
 */
export const lessonProgress = mysqlTable("lessonProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonId: int("lessonId").notNull(),
  
  isCompleted: boolean("isCompleted").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LessonProgress = typeof lessonProgress.$inferSelect;
export type InsertLessonProgress = typeof lessonProgress.$inferInsert;

/**
 * Assessments/Quizzes table
 */
export const assessments = mysqlTable("assessments", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  // Questions stored as JSON array
  questions: json("questions").notNull(), // Array of question objects
  passingScore: decimal("passingScore", { precision: 5, scale: 2 }).default("70"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;

/**
 * Assessment results - user quiz attempts
 */
export const assessmentResults = mysqlTable("assessmentResults", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  assessmentId: int("assessmentId").notNull(),
  
  answers: json("answers").notNull(), // User's answers
  score: decimal("score", { precision: 5, scale: 2 }).notNull(),
  passed: boolean("passed").notNull(),
  
  attemptNumber: int("attemptNumber").default(1).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AssessmentResult = typeof assessmentResults.$inferSelect;
export type InsertAssessmentResult = typeof assessmentResults.$inferInsert;

/**
 * Certificates table
 */
export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  
  certificateNumber: varchar("certificateNumber", { length: 100 }).notNull().unique(),
  qrCode: text("qrCode"),
  
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;

/**
 * Badges and achievements
 */
export const badges = mysqlTable("badges", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  icon: text("icon"),
  criteria: varchar("criteria", { length: 255 }).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;

/**
 * User badges - tracks earned badges
 */
export const userBadges = mysqlTable("userBadges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  badgeId: int("badgeId").notNull(),
  
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
});

export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = typeof userBadges.$inferInsert;

/**
 * Community posts
 */
export const communityPosts = mysqlTable("communityPosts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: mysqlEnum("type", ["post", "question", "achievement"]).default("post").notNull(),
  
  // Engagement
  likesCount: int("likesCount").default(0).notNull(),
  commentsCount: int("commentsCount").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = typeof communityPosts.$inferInsert;

/**
 * Community comments
 */
export const communityComments = mysqlTable("communityComments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  
  content: text("content").notNull(),
  likesCount: int("likesCount").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CommunityComment = typeof communityComments.$inferSelect;
export type InsertCommunityComment = typeof communityComments.$inferInsert;

/**
 * Events and webinars
 */
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  instructorId: int("instructorId").notNull(),
  thumbnail: text("thumbnail"),
  
  eventType: mysqlEnum("eventType", ["workshop", "webinar", "live_session"]).notNull(),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime").notNull(),
  
  maxAttendees: int("maxAttendees"),
  registeredCount: int("registeredCount").default(0).notNull(),
  
  meetingLink: text("meetingLink"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

/**
 * Event registrations
 */
export const eventRegistrations = mysqlTable("eventRegistrations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  eventId: int("eventId").notNull(),
  
  registeredAt: timestamp("registeredAt").defaultNow().notNull(),
  attended: boolean("attended").default(false),
  attendedAt: timestamp("attendedAt"),
});

export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = typeof eventRegistrations.$inferInsert;

/**
 * Consulting sessions
 */
export const consultingSessions = mysqlTable("consultingSessions", {
  id: int("id").autoincrement().primaryKey(),
  consultantId: int("consultantId").notNull(),
  userId: int("userId").notNull(),
  
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  scheduledAt: timestamp("scheduledAt").notNull(),
  duration: int("duration").notNull(), // in minutes
  
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  
  meetingLink: text("meetingLink"),
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ConsultingSession = typeof consultingSessions.$inferSelect;
export type InsertConsultingSession = typeof consultingSessions.$inferInsert;

/**
 * Consultant profiles
 */
export const consultants = mysqlTable("consultants", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  title: varchar("title", { length: 255 }).notNull(),
  bio: text("bio"),
  expertise: varchar("expertise", { length: 255 }),
  
  hourlyRate: decimal("hourlyRate", { precision: 10, scale: 2 }).notNull(),
  
  isAvailable: boolean("isAvailable").default(true).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Consultant = typeof consultants.$inferSelect;
export type InsertConsultant = typeof consultants.$inferInsert;

/**
 * Resources/Downloads
 */
export const resources = mysqlTable("resources", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId"),
  
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  fileUrl: text("fileUrl").notNull(),
  fileType: varchar("fileType", { length: 50 }).notNull(),
  
  category: varchar("category", { length: 100 }).notNull(),
  
  downloadCount: int("downloadCount").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Resource = typeof resources.$inferSelect;
export type InsertResource = typeof resources.$inferInsert;

/**
 * AI Coach conversations
 */
export const aiCoachConversations = mysqlTable("aiCoachConversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  title: varchar("title", { length: 255 }),
  messages: json("messages").notNull(), // Array of message objects
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AiCoachConversation = typeof aiCoachConversations.$inferSelect;
export type InsertAiCoachConversation = typeof aiCoachConversations.$inferInsert;
