import { z } from "zod"

export const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(1000, "Message too long"),
  image: z.string().optional(),
})

export const chatroomSchema = z.object({
  title: z.string().min(1, "Chatroom title is required").max(50, "Title must not exceed 50 characters"),
})

export type MessageFormData = z.infer<typeof messageSchema>
export type ChatroomFormData = z.infer<typeof chatroomSchema>
