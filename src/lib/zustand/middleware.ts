import { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

/**
 * Zustand Middleware Types
 */
export type ImmerStateCreator<T> = StateCreator<
    T,
    [['zustand/immer', never], ['zustand/devtools', never]],
    [],
    T
>;

/**
 * Immer middleware for immutable state updates
 * Usage: store.setState((draft) => { draft.count += 1; })
 */
export { immer };

/**
 * DevTools middleware for Redux DevTools integration
 */
export { devtools };

/**
 * Persist middleware for localStorage persistence
 */
export { persist };
