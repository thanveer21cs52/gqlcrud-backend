import { pubsub } from "../../index.js";
import path from "path";
import { fileURLToPath } from "url";
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.db_url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- DB Helpers ---
const readUsers = async () => {
  try {
    const data = await sql`SELECT * FROM gqlusers`;
    return data ?? [];
  } catch (err) {
    console.error("Error reading users:", err);
    return [];
  }
};

const createUser = async (name) => {
  const result = await sql`
    INSERT INTO gqlusers (name) 
    VALUES (${name}) 
    RETURNING id, name
  `;
  return result[0]; 
};

const updateUser = async (id, name) => {
  const result = await sql`
    UPDATE gqlusers 
    SET name = ${name} 
    WHERE id = ${id}
    RETURNING id, name
  `;
  return result[0];
};

const deleteUser = async (id) => {
  const result = await sql`
    DELETE FROM gqlusers 
    WHERE id = ${id}
    RETURNING id, name
  `;
  return result[0];
};

// --- GraphQL Resolvers ---
export default {
  Query: {
    user: () => readUsers(),
  },

  Mutation: {
    addUser: async (_, { name }) => {
      const user = await createUser(name);
      pubsub.publish("USER_ADDED", { userAdded: user });
      return user;
    },

    editUser: async (_, { id, name }) => {
      const updated = await updateUser(id, name);
      if (updated) {
        pubsub.publish("USER_EDITED", { userEdited: updated });
      }
      return updated;
    },

    deleteUser: async (_, { id }) => {
      const deleted = await deleteUser(id);
      if (deleted) {
        pubsub.publish("USER_DELETED", { userDeleted: deleted });
      }
      return deleted;
    },
  },

  Subscription: {
    userAdded: {
      subscribe: () => pubsub.asyncIterableIterator(["USER_ADDED"]),
    },
    userEdited: {
      subscribe: () => pubsub.asyncIterableIterator(["USER_EDITED"]),
    },
    userDeleted: {
      subscribe: () => pubsub.asyncIterableIterator(["USER_DELETED"]),
    },
  },
};
