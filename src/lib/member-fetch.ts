export type SNSLinkInfo = { type: "twitter"; url: string } | { type: "github"; url: string };

const validateSNSLink = (obj: unknown): obj is SNSLinkInfo => {
  if (typeof obj !== "object" || obj == null) {
    console.error("not object: ", obj);
    return false;
  }

  if (!("type" in obj && ["twitter", "github"].includes((obj as SNSLinkInfo).type))) {
    console.error("unknown type from: ", obj);
    return false;
  }
  if (!("url" in obj && typeof (obj as SNSLinkInfo).url === "string")) {
    console.error("`url` not in: ", obj);
    return false;
  }
  return true;
};

export type Member = {
  avatar: string;
  name: string;
  role: string;
  links: SNSLinkInfo[];
};

const validateMember = (obj: unknown): obj is Member => {
  if (typeof obj !== "object" || obj == null) {
    console.error("not object: ", obj);
    return false;
  }

  if (!("avatar" in obj && typeof (obj as Member).avatar === "string")) {
    console.error("`avatar` not in: ", obj);
    return false;
  }
  if (!("name" in obj && typeof (obj as Member).name === "string")) {
    console.error("`name` not in: ", obj);
    return false;
  }
  if (!("role" in obj && typeof (obj as Member).role === "string")) {
    console.error("`role` not in: ", obj);
    return false;
  }
  if (
    !(
      "links" in obj &&
      typeof (obj as Member).links === "object" &&
      (Object.values((obj as Member).links) as unknown[]).every(validateSNSLink)
    )
  ) {
    console.error("`links` not in: ", obj);
    return false;
  }

  return true;
};

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
