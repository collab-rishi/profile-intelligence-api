import { v7 as uuidv7 } from 'uuid';


export const getAgeGroup = (age: number): string => {
  if (age <= 12) return "child";
  if (age <= 19) return "teenager";
  if (age <= 59) return "adult";
  return "senior";
};


export const generateId = (): string => {
  return uuidv7();
};


export const normalizeName = (name: string): string => {
  return name.toLowerCase().trim();
};