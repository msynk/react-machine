# React Machine

A simple but feature-rich **state machine** for React, built as a small open-source project that can evolve into a real-world library.

## Example
```tsx
const machine = createMachine({
  id: "toggle",
  initial: "off",
  states: {
    off: { on: { TOGGLE: "on" } },
    on: { on: { TOGGLE: "off" } },
  },
});

function Toggle() {
  const [state, send] = useMachine(machine);
  return <button onClick={() => send("TOGGLE")}>{state.value}</button>;
}
