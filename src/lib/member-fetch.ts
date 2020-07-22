import z from "zod";

const SNSLinkInfoSchema = z.union([
  z.object({
    type: z.literal("twitter"),
    url: z.string(),
  }),
  z.object({
    type: z.literal("github"),
    url: z.string(),
  }),
]);

export type SNSLinkInfo = z.infer<typeof SNSLinkInfoSchema>;

const MemberSchema = z.object({
  avatar: z.string(),
  name: z.string(),
  role: z.string(),
  links: z.array(SNSLinkInfoSchema),
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
