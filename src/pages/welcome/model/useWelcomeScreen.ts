import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useUserName } from "@/src/shared/lib/useUserName";
import { useTheme } from "@/src/shared/lib/useTheme";
import { useToastStore } from "@/src/shared/store/toastStore";
import { nameSchema, type NameSchema } from "@/src/entities/user";

export function useWelcomeScreen() {
  const router = useRouter();
  const { name: savedName, saveName } = useUserName();
  const theme = useTheme();
  const showToast = useToastStore((s) => s.show);

  const { control, handleSubmit, formState: { errors } } = useForm<NameSchema>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (savedName) {
      router.replace("/home");
    }
  }, [savedName, router]);

  useEffect(() => {
    if (errors.name?.message) {
      showToast(errors.name.message, "error");
    }
  }, [errors.name?.message]);

  const handleContinue = handleSubmit(async ({ name }) => {
    await saveName(name);
    router.replace("/home");
  });

  return { control, errors, handleContinue, theme };
}
