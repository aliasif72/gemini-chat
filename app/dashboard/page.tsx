"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setChatrooms } from "@/store/slices/chatSlice";
import { storage } from "@/lib/storage";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ChatroomList } from "@/components/dashboard/chatroom-list";
import { WelcomeScreen } from "@/components/dashboard/welcome-screen";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { activeChatroom } = useAppSelector((state) => state.chat);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    // Load chatrooms from storage
    const savedChatrooms = storage.getChatrooms();
    dispatch(setChatrooms(savedChatrooms));
  }, [isAuthenticated, router, dispatch]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="flex h-full">
        <ChatroomList />
        {activeChatroom ? (
          <div className="flex-1">
            {/* Chat interface will be rendered here */}
            <WelcomeScreen />
          </div>
        ) : (
          <WelcomeScreen />
        )}
      </div>
    </DashboardLayout>
  );
}
