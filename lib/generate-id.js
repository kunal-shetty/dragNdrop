// Utility function to generate unique IDs for components
export function generateId() {
  return `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
