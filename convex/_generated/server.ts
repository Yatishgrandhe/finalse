// Generated Convex server - placeholder for build compatibility
// This file will be replaced when Convex is properly deployed

export interface QueryBuilder {
  eq: (field: string | QueryBuilder, value: any) => QueryBuilder;
  neq: (field: string | QueryBuilder, value: any) => QueryBuilder;
  lt: (field: string | QueryBuilder, value: any) => QueryBuilder;
  lte: (field: string | QueryBuilder, value: any) => QueryBuilder;
  gt: (field: string | QueryBuilder, value: any) => QueryBuilder;
  gte: (field: string | QueryBuilder, value: any) => QueryBuilder;
  withIndex: (index: string, predicate: (q: QueryBuilder) => QueryBuilder) => QueryBuilder;
  field: (field: string) => QueryBuilder;
  first: () => Promise<any>;
  collect: () => Promise<any[]>;
  filter: (predicate: (q: QueryBuilder) => QueryBuilder) => QueryBuilder;
}

export interface Database {
  query: (table: string) => QueryBuilder;
  get: (id: string) => Promise<any>;
  insert: (table: string, doc: any) => Promise<string>;
  patch: (id: string, updates: any) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export interface MutationCtx {
  db: Database;
  auth: any;
}

export interface QueryCtx {
  db: Database;
  auth: any;
}

export const mutation = (config: { args?: any; handler: (ctx: MutationCtx, args: any) => any }) => config.handler;
export const query = (config: { args?: any; handler: (ctx: QueryCtx, args: any) => any }) => config.handler;
export const action = (config: { args?: any; handler: (ctx: any, args: any) => any }) => config.handler;
export const internalMutation = (config: { args?: any; handler: (ctx: MutationCtx, args: any) => any }) => config.handler;
export const internalQuery = (config: { args?: any; handler: (ctx: QueryCtx, args: any) => any }) => config.handler;
export const internalAction = (config: { args?: any; handler: (ctx: any, args: any) => any }) => config.handler;

// Schema definition functions
export const defineSchema = (schema: any) => schema;
export const defineTable = (schema: any) => schema;
