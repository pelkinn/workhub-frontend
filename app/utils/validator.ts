import type { BaseValidation } from "@vuelidate/core";

export const getErrorMessage = (field: BaseValidation) => {
  return toValue(field.$errors?.[0]?.$message ?? "");
};

export const containsDigit = (value: string) => /\d/.test(value);
