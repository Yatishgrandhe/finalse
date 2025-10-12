// Generated Convex values - placeholder for build compatibility
// This file will be replaced when Convex is properly deployed

export const v = {
  string: () => ({}),
  number: () => ({}),
  boolean: () => ({}),
  array: (item: any) => ({}),
  object: (schema: any) => ({}),
  optional: (validator: any) => ({}),
  id: (table: string) => ({}),
  float64: () => ({}),
  int64: () => ({}),
  any: () => ({}),
  null: () => ({}),
  literal: (value: any) => ({}),
  union: (...validators: any[]) => ({}),
};

export class ConvexError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConvexError';
  }
}
