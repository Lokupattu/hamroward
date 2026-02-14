export const wardNumbers = Array.from({ length: 50 }, (_, index) => index + 1);

export const wardSelectOptions = wardNumbers.map((number) => ({
  id: number,
  label: `Ward ${number}`,
  name: `Ward ${number}`,
}));

