export type Outcome = "emergency" | "urgent" | "self-care" | null;

export type Message = {
  role: "user" | "bot";
  text: string;
};