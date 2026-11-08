import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { createAuthClient } from "better-auth/svelte"

const client = new MongoClient(process.env.MONGODB_URI as string)
const db = client.db("loopAdmin")

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "seeker",
        input: true, // accepted from the client during sign-up
        required: false,
        returned: true,
      },
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
})

export const { signIn, signUp, useSession } = createAuthClient()
