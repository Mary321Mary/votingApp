import { RegisterFormState } from "../types";

export type WASubmitOutcome = "success" | "failure";

export async function fakeWaSubmit(
  form: RegisterFormState,
): Promise<WASubmitOutcome> {
  if (form.first_name.trim() === "John" && form.last_name.trim() === "Doe") {
    return "failure";
  }
  return "success";
}
