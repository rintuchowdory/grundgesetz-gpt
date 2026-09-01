import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, articles, conversations, messages, InsertMessage, InsertConversation } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _dbChecked = false;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_dbChecked) {
    _dbChecked = true;
    if (process.env.DATABASE_URL) {
      try {
        _db = drizzle(process.env.DATABASE_URL);
        console.log("[Database] Connected successfully");
      } catch (error) {
        console.warn("[Database] Failed to connect:", error);
        _db = null;
      }
    } else {
      console.warn("[Database] No DATABASE_URL set — running in memory mode");
    }
  }
  return _db;
}

// ===== In-memory fallback storage =====
interface MemUser {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}

interface MemArticle {
  id: number;
  number: string;
  title: string;
  category: string;
  body: string;
  createdAt: Date;
}

interface MemConversation {
  id: number;
  userId: number;
  articleId: number | null;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MemMessage {
  id: number;
  conversationId: number;
  role: string;
  content: string;
  createdAt: Date;
}

const memUsers: MemUser[] = [];
let memUserIdCounter = 1;
const memConversations: MemConversation[] = [];
let memConvIdCounter = 1;
const memMessages: MemMessage[] = [];
let memMsgIdCounter = 1;

// Static articles fallback (same data as client/src/data/articles.ts)
import { STATIC_ARTICLES_DATA } from "./static-data";

const memArticles: MemArticle[] = STATIC_ARTICLES_DATA.map((a, i) => ({
  id: a.id,
  number: a.number,
  title: a.title,
  category: a.category,
  body: a.body,
  createdAt: new Date(),
}));

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    // In-memory mode
    const existing = memUsers.find(u => u.openId === user.openId);
    if (existing) {
      if (user.name !== undefined) existing.name = user.name ?? null;
      if (user.email !== undefined) existing.email = user.email ?? null;
      if (user.loginMethod !== undefined) existing.loginMethod = user.loginMethod ?? null;
      existing.lastSignedIn = new Date();
      if (user.role !== undefined) existing.role = user.role;
      else if (user.openId === ENV.ownerOpenId) existing.role = 'admin';
    } else {
      memUsers.push({
        id: memUserIdCounter++,
        openId: user.openId,
        name: user.name ?? null,
        email: user.email ?? null,
        loginMethod: user.loginMethod ?? null,
        role: user.role || (user.openId === ENV.ownerOpenId ? 'admin' : 'user'),
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      });
    }
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
    return memUsers.find(u => u.openId === openId);
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== Articles =====
export async function getAllArticles() {
  const db = await getDb();
  if (!db) return memArticles;
  try {
    const dbArticles = await db.select().from(articles);
    // If DB has articles, use them; otherwise fall back to static
    return dbArticles.length > 0 ? dbArticles : memArticles;
  } catch (error) {
    console.error("[Database] Failed to get articles:", error);
    return memArticles;
  }
}

export async function getArticleById(id: number) {
  const db = await getDb();
  if (!db) return memArticles.find(a => a.id === id);
  try {
    const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
    if (result.length > 0) return result[0];
    // Fallback to static
    return memArticles.find(a => a.id === id);
  } catch (error) {
    console.error("[Database] Failed to get article:", error);
    return memArticles.find(a => a.id === id);
  }
}

export async function getArticlesByCategory(category: string) {
  const db = await getDb();
  if (!db) return memArticles.filter(a => a.category === category);
  try {
    const result = await db.select().from(articles).where(eq(articles.category, category));
    return result.length > 0 ? result : memArticles.filter(a => a.category === category);
  } catch (error) {
    console.error("[Database] Failed to get articles by category:", error);
    return memArticles.filter(a => a.category === category);
  }
}

// ===== Conversations =====
export async function getUserConversations(userId: number) {
  const db = await getDb();
  if (!db) return memConversations.filter(c => c.userId === userId).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  try {
    return await db.select().from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt));
  } catch (error) {
    console.error("[Database] Failed to get user conversations:", error);
    return memConversations.filter(c => c.userId === userId);
  }
}

export async function createConversation(data: InsertConversation) {
  const db = await getDb();
  if (!db) {
    const conv: MemConversation = {
      id: memConvIdCounter++,
      userId: data.userId,
      articleId: data.articleId ?? null,
      title: data.title,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memConversations.push(conv);
    return conv;
  }
  try {
    await db.insert(conversations).values(data);
    const result = await db.select().from(conversations)
      .where(eq(conversations.userId, data.userId))
      .orderBy(desc(conversations.createdAt))
      .limit(1);
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to create conversation:", error);
    throw error;
  }
}

export async function getConversationById(id: number) {
  const db = await getDb();
  if (!db) return memConversations.find(c => c.id === id);
  try {
    const result = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get conversation:", error);
    return memConversations.find(c => c.id === id);
  }
}

// ===== Messages =====
export async function getConversationMessages(conversationId: number) {
  const db = await getDb();
  if (!db) return memMessages.filter(m => m.conversationId === conversationId).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  try {
    return await db.select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  } catch (error) {
    console.error("[Database] Failed to get conversation messages:", error);
    return memMessages.filter(m => m.conversationId === conversationId);
  }
}

export async function addMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) {
    const msg: MemMessage = {
      id: memMsgIdCounter++,
      conversationId: data.conversationId,
      role: data.role,
      content: data.content,
      createdAt: new Date(),
    };
    memMessages.push(msg);
    return msg;
  }
  try {
    const result = await db.insert(messages).values(data);
    return result[0];
  } catch (error) {
    console.error("[Database] Failed to add message:", error);
    throw error;
  }
}
