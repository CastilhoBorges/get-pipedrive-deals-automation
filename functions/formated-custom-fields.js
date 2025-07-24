export function formatCustomFields(customFields, dealFields) {
  const formatted = {};

  Object.entries(customFields).forEach(([key, value]) => {
    const field = dealFields.find((f) => f.key === key);
    const fieldName = field ? field.name : key;
    formatted[fieldName] = value;
  });

  return formatted;
}
