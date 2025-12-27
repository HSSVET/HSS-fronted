# 🚀 State Management Migration Guide

## ⚠️ IMPORTANT: Breaking Changes & New Patterns

**Date:** December 27, 2024  
**Status:** Migration Complete - Phase 1-5 ✅  
**Build Status:** Production Ready (0 errors)

---

## 📋 Quick Summary

The project has been migrated from **Context API** to modern state management:
- **Server State:** React Query (`@tanstack/react-query`)
- **Client State:** Zustand (`zustand`)

---

## ⛔ DEPRECATED - DO NOT USE

### ❌ ErrorContext (DEPRECATED)
```typescript
// ❌ OLD - DO NOT USE
import { useError } from '../context/ErrorContext';
const { showSuccess, showError } = useError();
```

```typescript
// ✅ NEW - USE THIS
import { useNotifications } from '../hooks/useNotifications';
const { showSuccess, showError } = useNotifications();

// OR (better performance)
import { useUIStore } from '../stores';
const showSuccess = useUIStore(state => state.showSuccess);
```

### ❌ AppContext (DEPRECATED)
```typescript
// ❌ OLD - DO NOT USE
import { useApp, appActions } from '../context/AppContext';
const { state, dispatch } = useApp();
dispatch(appActions.toggleSidebar());
```

```typescript
// ✅ NEW - USE THIS
import { useUIStore } from '../stores';
const { sidebarOpen, toggleSidebar } = useUIStore();
toggleSidebar(); // Direct action, no dispatch
```

---

## ✅ NEW PATTERNS - MUST USE

### 1. Server State (API Calls)

**✅ Use React Query Hooks:**

```typescript
// For fetching data
import { useAnimals } from '../features/animals/hooks/useAnimalQueries';

function MyComponent() {
  const { data, isLoading, error } = useAnimals();
  
  if (isLoading) return <Loading />;
  if (error) return <Error />;
  
  return <AnimalList animals={data} />;
}
```

```typescript
// For mutations (create, update, delete)
import { useCreateAnimal } from '../features/animals/hooks/useAnimalQueries';

function MyComponent() {
  const createAnimal = useCreateAnimal();
  
  const handleSave = async () => {
    await createAnimal.mutateAsync({
      name: 'Max',
      species: 'Dog'
    });
    // Cache automatically updated!
  };
  
  return <Button onClick={handleSave}>Save</Button>;
}
```

**Available Query Hooks:**
- `useAnimalQueries.ts` - Animals module (13 hooks)
- `useAppointmentQueries.ts` - Appointments (16 hooks)
- `useBillingQueries.ts` - Billing (15 hooks)
- `useLaboratoryQueries.ts` - Laboratory (15 hooks)
- `useVaccinationQueries.ts` - Vaccinations (18 hooks)
- `useStockQueries.ts` - Stock/Inventory (16 hooks)
- `useDocumentQueries.ts` - Documents (6 hooks)
- Plus 4 more modules

---

### 2. Client State (UI State)

**✅ Use Zustand uiStore:**

```typescript
import { useUIStore } from '../stores';

function MyComponent() {
  // Get state
  const sidebarOpen = useUIStore(state => state.sidebarOpen);
  const theme = useUIStore(state => state.theme);
  
  // Get actions
  const toggleSidebar = useUIStore(state => state.toggleSidebar);
  const setTheme = useUIStore(state => state.setTheme);
  
  return (
    <div>
      <button onClick={toggleSidebar}>Toggle Sidebar</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  );
}
```

**Available UI State:**
- `sidebarOpen` / `toggleSidebar()`
- `theme` / `setTheme()` / `toggleTheme()`
- `showSuccess()` / `showError()` / `showWarning()` / `showInfo()`
- `toasts` / `addToast()` / `removeToast()`
- `modals` / `openModal()` / `closeModal()`
- `loadingStates` / `setLoading()`
- `confirmDialog` / `showConfirmDialog()` / `hideConfirmDialog()`

---

## 🚨 CRITICAL RULES FOR NEW CODE

### Rule 1: Never Create New Context Providers
❌ **DON'T:**
```typescript
const MyContext = createContext();
export const MyProvider = ({ children }) => { ... }
```

✅ **DO:**
- For server state → Create React Query hooks
- For client state → Add to existing Zustand stores

---

### Rule 2: Never Use useState for Server Data
❌ **DON'T:**
```typescript
const [animals, setAnimals] = useState([]);
useEffect(() => {
  fetch('/api/animals').then(res => setAnimals(res));
}, []);
```

✅ **DO:**
```typescript
const { data: animals } = useAnimals();
```

**Why?** React Query handles:
- Caching
- Loading states
- Error handling
- Refetching
- Background updates
- All automatically!

---

### Rule 3: Use Optimistic Updates
✅ **Required for all mutations:**

```typescript
const updateAnimal = useUpdateAnimal();

// Mutation hooks already have optimistic updates built-in!
await updateAnimal.mutateAsync({ id: 1, name: 'Updated' });
// UI updates immediately, rollback on error
```

---

### Rule 4: Use Notification Helpers
✅ **For user feedback:**

```typescript
import { useNotifications } from '../hooks/useNotifications';

const { showSuccess, showError } = useNotifications();

const handleSave = async () => {
  try {
    await saveData();
    showSuccess('Saved successfully!');
  } catch (error) {
    showError('Failed to save', error.message);
  }
};
```

---

## 📚 Where to Find Hooks

### Server State Hooks
Location: `src/features/{module}/hooks/use{Module}Queries.ts`

Examples:
- `src/features/animals/hooks/useAnimalQueries.ts`
- `src/features/appointments/hooks/useAppointmentQueries.ts`
- `src/features/billing/hooks/useBillingQueries.ts`

### Client State Store
Location: `src/stores/uiStore.ts`

### Helper Hooks
Location: `src/hooks/`
- `useNotifications.ts` - Notification system
- `useLoading.ts` - Loading states
- `useApiCall.ts` - Generic API wrapper

---

## 🐛 Common Mistakes to Avoid

### ❌ Mistake 1: Importing Deprecated Context
```typescript
import { useError } from '../context/ErrorContext'; // ❌ WRONG
```
**Solution:** Use `useNotifications` instead

### ❌ Mistake 2: Manual Cache Invalidation
```typescript
queryClient.invalidateQueries(['animals']); // ❌ WRONG (incorrect key)
```
**Solution:** Use the queryKeys factory
```typescript
import { queryKeys } from '../lib/react-query';
queryClient.invalidateQueries({ queryKey: queryKeys.animals.all });
```

### ❌ Mistake 3: Not Handling Loading/Error States
```typescript
const { data } = useAnimals(); // ❌ What if loading or error?
return <div>{data.map(...)}</div>; // Crashes!
```
**Solution:**
```typescript
const { data, isLoading, error } = useAnimals();
if (isLoading) return <Spinner />;
if (error) return <ErrorMessage />;
return <div>{data?.map(...) || []}</div>;
```

---

## 🔍 Developer Tools

### React Query DevTools
Already integrated! Open browser console:
- View all queries
- See cache state
- Monitor refetch
- Debug loading states

### Zustand DevTools
Redux DevTools compatible:
- Time-travel debugging
- State history
- Action tracking

**How to use:**
1. Install Redux DevTools browser extension
2. Open DevTools → Redux tab
3. See "HSS-UI-Store"

---

## 📖 Examples

### Example 1: Fetch and Display Data
```typescript
import { useAnimals } from '../features/animals/hooks/useAnimalQueries';

function AnimalList() {
  const { data, isLoading, error } = useAnimals(1, 20); // page, limit
  
  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;
  
  return (
    <ul>
      {data?.items.map(animal => (
        <li key={animal.id}>{animal.name}</li>
      ))}
    </ul>
  );
}
```

### Example 2: Create New Record
```typescript
import { useCreateAnimal } from '../features/animals/hooks/useAnimalQueries';
import { useNotifications } from '../hooks/useNotifications';

function AddAnimalForm() {
  const createAnimal = useCreateAnimal();
  const { showSuccess, showError } = useNotifications();
  
  const handleSubmit = async (formData) => {
    try {
      await createAnimal.mutateAsync(formData);
      showSuccess('Animal created!');
      // Cache automatically updated, list refreshes
    } catch (error) {
      showError('Failed to create animal', error.message);
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Example 3: Theme Toggle
```typescript
import { useUIStore } from '../stores';

function ThemeToggle() {
  const theme = useUIStore(state => state.theme);
  const toggleTheme = useUIStore(state => state.toggleTheme);
  
  return (
    <IconButton onClick={toggleTheme}>
      {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}
```

---

## 🚀 Performance Tips

### Tip 1: Use Selectors for Better Performance
```typescript
// ❌ BAD - Re-renders on ANY state change
const store = useUIStore();

// ✅ GOOD - Only re-renders when sidebarOpen changes
const sidebarOpen = useUIStore(state => state.sidebarOpen);
```

### Tip 2: Prefetch on Hover
```typescript
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/react-query';

function AnimalCard({ id }) {
  const queryClient = useQueryClient();
  
  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.animals.detail(id),
      queryFn: () => fetchAnimal(id),
    });
  };
  
  return <Card onMouseEnter={prefetch}>...</Card>;
}
```

---

## 📞 Need Help?

**Documentation:**
- Phase 1-5 Walkthrough: `brain/.../walkthrough.md`
- Implementation Plan: `brain/.../implementation_plan.md`
- Task Checklist: `brain/.../task.md`

**React Query Docs:** https://tanstack.com/query/latest  
**Zustand Docs:** https://zustand-demo.pmnd.rs/

---

## ✅ Checklist for New Features

When creating a new feature:

- [ ] Create hooks in `features/{module}/hooks/use{Module}Queries.ts`
- [ ] Add query keys to `lib/react-query/queryClient.ts`
- [ ] Use React Query for server state
- [ ] Use Zustand for client state
- [ ] Implement optimistic updates
- [ ] Handle loading/error states
- [ ] Add notifications (success/error)
- [ ] Test with DevTools
- [ ] **DON'T** create new Context providers
- [ ] **DON'T** use deprecated `useError` or `useApp`

---

## 🎯 Summary

**Do's:**
✅ Use React Query hooks for API calls  
✅ Use Zustand uiStore for UI state  
✅ Use `useNotifications` for feedback  
✅ Handle loading/error states  
✅ Implement optimistic updates  

**Don'ts:**
❌ Don't use Context API  
❌ Don't use `useError` or `useApp`  
❌ Don't create new providers  
❌ Don't manage server state in useState  
❌ Don't ignore loading/error states  

---

**Questions?** Check the walkthrough or ask the team!

**Build Status:** ✅ 0 errors, Production Ready
