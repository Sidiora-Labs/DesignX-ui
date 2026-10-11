import { useState } from "react";
import { Code2, Mail } from "lucide-react";

import AuthForm, { type AuthFormMode } from "@/components/elements/auth-form";

export default function AuthFormDemo() {
  const [mode, setMode] = useState<AuthFormMode>("sign-in");
  return (
    <AuthForm
      className="w-full max-w-sm"
      mode={mode}
      onModeChange={setMode}
      providers={[
        { id: "code", label: "Code host", icon: <Code2 className="size-4" /> },
        { id: "email", label: "Email link", icon: <Mail className="size-4" /> },
      ]}
    />
  );
}
