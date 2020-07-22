import z from "zod";

export type Contact = "twitter" | "github" | "discord";

const ContactsSchema = z.union([
  z.object({
    twitter: z.number().optional(),
  }),
  z.object({
    github: z.number().optional(),
  }),
  z.object({
    discord: z.number().optional(),
  }),
]);

export type Contacts = z.infer<typeof ContactsSchema>;

const MemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  contacts: z.record(ContactsSchema),
});

export type Member = z.infer<typeof MemberSchema>;

const validateMember = MemberSchema.check;

const validateMembers = (obj: unknown): obj is Member[] =>
  typeof obj === "object" && obj != null && (Object.values(obj) as unknown[]).every(validateMember);

const membersUrl = "https://db.siketyan.approvers.dev/";

export async function getMembers(): Promise<Member[]> {
  const file = await fetch(membersUrl);
  const parsed = await file.json();
  console.log(parsed);
  if (!validateMembers(parsed)) {
    throw "invalid list format";
  }
  return parsed;
}
