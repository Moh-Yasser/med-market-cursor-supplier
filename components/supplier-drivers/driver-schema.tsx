import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const DriverSchema = z
  .object({
    name: z.string().min(1, "الاسم مطلوب"),

    email: z.string().email("البريد الإلكتروني غير صالح"),

    phone: z
      .string()
      .regex(/^(\+9630?9|9630?9|09)\d{8}$/, "رقم الجوال غير صالح"),

    password: z.string().min(8, "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل"),

    workStartTime: z.string().regex(timeRegex, "وقت بداية العمل غير صالح"),

    workEndTime: z.string().regex(timeRegex, "وقت نهاية العمل غير صالح"),
  })
  .refine(({ workStartTime, workEndTime }) => workEndTime > workStartTime, {
    path: ["workEndTime"],
    message: "يجب أن يكون وقت نهاية العمل بعد وقت بداية العمل",
  });

export type DriverFormValues = z.infer<typeof DriverSchema>;

export const driverDefaultValues: DriverFormValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  workStartTime: "",
  workEndTime: "",
};
