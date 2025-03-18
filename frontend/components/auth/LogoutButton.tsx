'use client';

import { Button, ButtonProps } from "../ui/button";
import { useLogoutMutation } from "../../apiSlice/userApiSlice";
import { useRouter } from "next/navigation";
import { useUser } from "./UserProvider";
import React from "react";
import { Loader2 } from "lucide-react";

interface LogoutButtonProps extends ButtonProps {}

export function LogoutButton({ 
  children, 
  className,
  ...props 
}: LogoutButtonProps) {
  const router = useRouter();
  const { clearUser } = useUser();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      clearUser();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button 
      onClick={handleLogout} 
      className={className}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Logging out...
        </>
      ) : (
        children || "Log out"
      )}
    </Button>
  );
}