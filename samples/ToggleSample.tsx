import { createMachine, useMachine } from "../src";

const toggleMachine = createMachine({
    id: "toggle",
    initial: "off",
    states: {
        off: {
            on: { TOGGLE: "on" },
            onEntry: () => console.log("Entered off"),
            onExit: () => console.log("Exiting off"),
        },
        on: {
            on: { TOGGLE: "off" },
            onEntry: () => console.log("Entered on"),
            onExit: () => console.log("Exiting on"),
        },
    },
});

export function ToggleSample() {
    const [state, send] = useMachine(toggleMachine);

    return (
        <div style={{ padding: 20 }}>
            <button
                onClick={() => send("TOGGLE")}
                style={{
                    background: state.matches("on") ? "green" : "gray",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: 6,
                    cursor: "pointer",
                }}
            >
                {state.matches("on") ? "ON" : "OFF"}
            </button>
        </div>
    );
}
