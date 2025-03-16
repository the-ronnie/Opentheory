import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Existing users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// Tables for the consultant job platform
export const consultants = pgTable('consultants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').unique(),
  avatar: text('avatar').notNull(),
  bio: text('bio'),
  company: text('company'),
  position: text('position'),
  location: text('location'),
  joinedDate: timestamp('joined_date').notNull().defaultNow(),
});

export const jobSeekers = pgTable('job_seekers', {
  id: uuid('id').defaultRandom().primaryKey(),
  consultantId: uuid('consultant_id')
    .notNull()
    .references(() => consultants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull().unique(),
  resume: text('resume').notNull(),
  skills: text('skills').array().notNull(),
  experience: integer('experience').notNull(),
  education: text('education').notNull(),
  location: text('location').notNull(),
  about: text('about').notNull(),
  addedDate: timestamp('added_date').notNull().defaultNow(),
});

export const jobs = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  location: text('location').notNull(),
  description: text('description').notNull(),
  skills: text('skills').array().notNull(),
  salary: integer('salary').notNull(),
  type: text('type').notNull(),
  postedDate: timestamp('posted_date').notNull().defaultNow(),
  deadline: timestamp('deadline').notNull(),
  status: text('status').notNull().default('active'),
});

// New activity logs table for job platform
export const jobActivityLogs = pgTable('job_activity_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  consultantId: uuid('consultant_id').references(() => consultants.id, { onDelete: 'set null' }),
  entityType: varchar('entity_type', { length: 20 }).notNull(), // 'consultant', 'jobseeker', 'job'
  entityId: text('entity_id').notNull(),
  action: varchar('action', { length: 50 }).notNull(),
  details: text('details'),
  ipAddress: varchar('ip_address', { length: 45 }),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});

// Relations for users
export const usersRelations = relations(users, ({ }) => ({}));

// Relations for consultant job platform
export const consultantsRelations = relations(consultants, ({ many }) => ({
  jobSeekers: many(jobSeekers),
  activityLogs: many(jobActivityLogs),
}));

export const jobSeekersRelations = relations(jobSeekers, ({ one }) => ({
  consultant: one(consultants, {
    fields: [jobSeekers.consultantId],
    references: [consultants.id],
  }),
}));

export const jobActivityLogsRelations = relations(jobActivityLogs, ({ one }) => ({
  consultant: one(consultants, {
    fields: [jobActivityLogs.consultantId],
    references: [consultants.id],
  }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Type exports for consultant job platform
export type Consultant = typeof consultants.$inferSelect;
export type NewConsultant = typeof consultants.$inferInsert;
export type JobSeeker = typeof jobSeekers.$inferSelect;
export type NewJobSeeker = typeof jobSeekers.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type JobActivityLog = typeof jobActivityLogs.$inferSelect;
export type NewJobActivityLog = typeof jobActivityLogs.$inferInsert;

export enum ActivityType {
  // Existing activity types
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  
  // New activity types for job platform
  CONSULTANT_CREATED = 'CONSULTANT_CREATED',
  CONSULTANT_UPDATED = 'CONSULTANT_UPDATED',
  JOB_SEEKER_ADDED = 'JOB_SEEKER_ADDED',
  JOB_SEEKER_UPDATED = 'JOB_SEEKER_UPDATED',
  JOB_SEEKER_DELETED = 'JOB_SEEKER_DELETED',
  JOB_POSTED = 'JOB_POSTED',
  JOB_UPDATED = 'JOB_UPDATED',
  JOB_CLOSED = 'JOB_CLOSED'
}