// Re-export React Query hooks (new implementation)
export * from './useAnimalQueries';

// Keep existing Context-based hooks for backward compatibility
export { useAnimals as useAnimalsLegacy } from './useAnimals';
export { default as useAnimalsDefault } from './useAnimals';
