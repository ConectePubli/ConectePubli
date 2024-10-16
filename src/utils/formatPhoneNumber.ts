export function formatPhoneNumber(value: string): string {
  value = value.replace(/\D/g, "");

  if (value.length > 2 && value.length <= 7) {
    value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  } else if (value.length > 7) {
    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }

  return value;
}
