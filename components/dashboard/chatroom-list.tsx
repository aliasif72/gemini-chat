"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppSelector } from "@/hooks/useAppSelector"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { addChatroom, deleteChatroom, setActiveChatroom, setSearchQuery } from "@/store/slices/chatSlice"
import { chatroomSchema, type ChatroomFormData } from "@/lib/validations/chat"
import { generateId, debounce } from "@/lib/utils"
import { storage } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Trash2, MessageCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import styles from "./chatroom-list.module.scss"

export function ChatroomList() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { chatrooms, searchQuery, activeChatroom } = useAppSelector((state) => state.chat)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChatroomFormData>({
    resolver: zodResolver(chatroomSchema),
  })

  const filteredChatrooms = chatrooms.filter((room) => room.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const debouncedSearch = debounce((query: string) => {
    dispatch(setSearchQuery(query))
  }, 300)

  const handleCreateChatroom = (data: ChatroomFormData) => {
    const newChatroom = {
      id: generateId(),
      title: data.title,
      messages: [],
      createdAt: new Date(),
    }

    dispatch(addChatroom(newChatroom))

    // Update storage
    const updatedChatrooms = [newChatroom, ...chatrooms]
    storage.setChatrooms(updatedChatrooms)

    toast({
      title: "Chatroom Created",
      description: `"${data.title}" has been created successfully.`,
    })

    setIsCreateDialogOpen(false)
    reset()
  }

  const handleDeleteChatroom = (chatroomId: string, title: string) => {
    dispatch(deleteChatroom(chatroomId))

    // Update storage
    const updatedChatrooms = chatrooms.filter((room) => room.id !== chatroomId)
    storage.setChatrooms(updatedChatrooms)

    toast({
      title: "Chatroom Deleted",
      description: `"${title}" has been deleted.`,
      variant: "destructive",
    })
  }

  const handleSelectChatroom = (chatroomId: string) => {
    dispatch(setActiveChatroom(chatroomId))
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <Input
            placeholder="Search chatrooms..."
            className={styles.searchInput}
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className={styles.createButton}>
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className={styles.dialog}>
            <DialogHeader>
              <DialogTitle>Create New Chatroom</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleCreateChatroom)} className={styles.form}>
              <div className={styles.field}>
                <Input placeholder="Enter chatroom title..." className={styles.titleInput} {...register("title")} />
                {errors.title && <p className={styles.error}>{errors.title.message}</p>}
              </div>
              <div className={styles.dialogActions}>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className={styles.chatroomList}>
        {filteredChatrooms.length === 0 ? (
          <div className={styles.emptyState}>
            <MessageCircle className={styles.emptyIcon} />
            <p className={styles.emptyText}>{searchQuery ? "No chatrooms found" : "No chatrooms yet"}</p>
            <p className={styles.emptySubtext}>
              {searchQuery ? "Try a different search term" : "Create your first chatroom to get started"}
            </p>
          </div>
        ) : (
          filteredChatrooms.map((chatroom) => (
            <div
              key={chatroom.id}
              className={`${styles.chatroomItem} ${activeChatroom === chatroom.id ? styles.active : ""}`}
              onClick={() => handleSelectChatroom(chatroom.id)}
            >
              <div className={styles.chatroomContent}>
                <div className={styles.chatroomHeader}>
                  <h3 className={styles.chatroomTitle}>{chatroom.title}</h3>
                  <span className={styles.chatroomDate}>{formatDate(chatroom.createdAt)}</span>
                </div>
                {chatroom.lastMessage && <p className={styles.lastMessage}>{chatroom.lastMessage.content}</p>}
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={styles.deleteButton}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Chatroom</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{chatroom.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteChatroom(chatroom.id, chatroom.title)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
