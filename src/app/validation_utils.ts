// // validation-utils.ts
// export interface ValidationRule {
//     field: string;
//     message: string;
//     validate: (value: any, formData?: any) => boolean;
//   }
  
//   export interface ValidationResult {
//     isValid: boolean;
//     errors: Record<string, string>;
//   }
  
//   // Generate nested field path from string like 'owners[0].firstName'
//   export const getNestedValue = (obj: any, path: string): any => {
//     // Handle array notation like owners[0].firstName
//     const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1');
//     const keys = normalizedPath.split('.');
    
//     let current = obj;
//     for (const key of keys) {
//       if (current === null || current === undefined) {
//         return undefined;
//       }
//       current = current[key];
//     }
//     return current;
//   };
  
//   // Set nested value in an object
//   export const setNestedValue = (obj: any, path: string, value: any): void => {
//     // Handle array notation like owners[0].firstName
//     const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1');
//     const keys = normalizedPath.split('.');
    
//     let current = obj;
//     const lastKey = keys.pop()!;
    
//     for (const key of keys) {
//       if (current[key] === undefined) {
//         // Create object or array as needed
//         const nextKey = keys[keys.indexOf(key) + 1];
//         if (nextKey && !isNaN(Number(nextKey))) {
//           current[key] = [];
//         } else {
//           current[key] = {};
//         }
//       }
//       current = current[key];
//     }
    
//     current[lastKey] = value;
//   };
  
//   // Validate form data against rules
//   export const validateForm = (formData: any, rules: ValidationRule[]): ValidationResult => {
//     const errors: Record<string, string> = {};
    
//     for (const rule of rules) {
//       const value = getNestedValue(formData, rule.field);
//       if (!rule.validate(value, formData)) {
//         errors[rule.field] = rule.message;
//       }
//     }
    
//     return {
//       isValid: Object.keys(errors).length === 0,
//       errors
//     };
//   };
  
//   // Common validation functions
//   export const required = (value: any) => {
//     if (Array.isArray(value)) return value.length > 0;
//     if (typeof value === 'string') return value.trim() !== '';
//     if (typeof value === 'number') return true;
//     if (typeof value === 'boolean') return true;
//     return value !== null && value !== undefined;
//   };
  
//   export const minLength = (min: number) => (value: string) => 
//     value !== undefined && value !== null && value.length >= min;
  
//   export const exactLength = (length: number) => (value: string) => 
//     value !== undefined && value !== null && value.length === length;
  
//   export const isValidDate = (value: string) => {
//     if (!value) return false;
//     // Check for MM/DD/YYYY format
//     const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
//     if (!regex.test(value)) return false;
    
//     // Validate that it's a real date
//     const [month, day, year] = value.split('/').map(Number);
//     const date = new Date(year, month - 1, day);
//     return date.getMonth() === month - 1 && date.getDate() === day && date.getFullYear() === year;
//   };
  
//   export const isValidPhoneNumber = (value: string) => {
//     if (!value) return false;
//     // Basic US phone validation - can be customized
//     const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
//     return regex.test(value);
//   };
  
//   export const isValidNumber = (value: string) => {
//     if (!value) return false;
//     return !isNaN(Number(value.replace(/[\$,]/g, '')));
//   }; 