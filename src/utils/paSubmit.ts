import { RegisterFormState } from "./types";

export type PASubmitOutcome = "success" | "failure";

export async function fakePaSubmit(form: RegisterFormState): Promise<PASubmitOutcome> {
  if (form.first_name.trim() === "John" && form.last_name.trim() === "Doe") {
    return "failure";
  }
  return "success";
}
