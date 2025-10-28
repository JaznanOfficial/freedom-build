const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI environment variable");
}

let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export async function connectMongoose() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoose = await import("mongoose");

    cached.promise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      .then((connection) => connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
