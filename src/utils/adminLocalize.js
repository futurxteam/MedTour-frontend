/**
 * 🛠️ ADMIN LOCALIZE HELPER
 * Ensures Admin/Hospital UI always displays English.
 * Safely handles both { en, ar } objects and legacy strings.
 */
export function adminLocalize(field) {
  if (!field) return "";

  // If multilingual object → return English
  if (typeof field === "object") {
    return field.en || "";
  }

  // If already string (old data) → return as is
  return field;
}
