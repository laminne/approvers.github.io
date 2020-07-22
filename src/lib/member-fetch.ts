import z from "zod";

const ContactSchema = z.object({
  twitter: z.number().optional(),
  github: z.number().optional(),
  discord: z.number().optional(),
});

export type Contact = z.infer<typeof ContactSchema>;

const MemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  contacts: ContactSchema,
});

export type Member = z.infer<typeof MemberSchema>;

const validateMember = MemberSchema.check;

const validateMembers = (obj: unknown): obj is Member[] =>
  typeof obj === "object" && obj != null && (Object.values(obj) as unknown[]).every(validateMember);

const membersUrl = "https://db.siketyan.approvers.dev/";

export async function getMembers(): Promise<Member[]> {
  const file = await fetch(membersUrl);
  const parsed = await file.json();
  if (!validateMembers(parsed)) {
    throw "invalid list format";
  }
  return parsed;
}
