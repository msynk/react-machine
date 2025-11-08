import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createMachine } from "../createMachine";
import { useMachine } from "../useMachine";

const machine = createMachine({
    id: "toggle",
    initial: "off" as const,
    states: {
        off: {
            on: { TOGGLE: "on" },
            onEntry: vi.fn(),
            onExit: vi.fn(),
        },
        on: {
            on: { TOGGLE: "off" },
            onEntry: vi.fn(),
            onExit: vi.fn(),
        },
    },
});

describe("useMachine", () => {
    it("initializes with initial state", () => {
        const { result } = renderHook(() => useMachine(machine));
        const [state] = result.current;
        expect(state.value).toBe("off");
        expect(state.matches("off")).toBe(true);
        expect(state.matches("on")).toBe(false);
    });

    it("transitions on valid event", () => {
        const { result } = renderHook(() => useMachine(machine));
        act(() => {
            const [, send] = result.current;
            send("TOGGLE");
        });
        const [state] = result.current;
        expect(state.value).toBe("on");
    });

    it("calls onExit of previous and onEntry of next", () => {
        const offExit = machine.states.off.onExit as ReturnType<typeof vi.fn>;
        const onEntry = machine.states.on.onEntry as ReturnType<typeof vi.fn>;
        offExit.mockClear();
        onEntry.mockClear();

        const { result } = renderHook(() => useMachine(machine));
        act(() => {
            const [, send] = result.current;
            send("TOGGLE");
        });

        expect(offExit).toHaveBeenCalledTimes(1);
        expect(onEntry).toHaveBeenCalledTimes(1);
    });

    it("ignores unknown events", () => {
        const { result } = renderHook(() => useMachine(machine));
        act(() => {
            const [, send] = result.current;
            // @ts-expect-error testing runtime ignore
            send("NOT_A_REAL_EVENT");
        });
        const [state] = result.current;
        expect(state.value).toBe("off");
    });

    it("no-op when transition target equals current", () => {
        const noopMachine = createMachine({
            id: "noop",
            initial: "idle" as const,
            states: {
                idle: {
                    on: { STAY: "idle" },
                    onEntry: vi.fn(),
                    onExit: vi.fn(),
                },
            },
        });

        const { result } = renderHook(() => useMachine(noopMachine));
        const onExit = noopMachine.states.idle.onExit as ReturnType<typeof vi.fn>;
        const onEntry = noopMachine.states.idle.onEntry as ReturnType<typeof vi.fn>;
        onExit.mockClear();
        onEntry.mockClear();

        act(() => {
            const [, send] = result.current;
            send("STAY");
        });

        const [state] = result.current;
        expect(state.value).toBe("idle");
        expect(onExit).not.toHaveBeenCalled();
        expect(onEntry).not.toHaveBeenCalled();
    });

    it("matches helper reflects current state", () => {
        const { result } = renderHook(() => useMachine(machine));
        let [state] = result.current;
        expect(state.matches("off")).toBe(true);
        act(() => {
            const [, send] = result.current;
            send("TOGGLE");
        });
        [state] = result.current;
        expect(state.matches("on")).toBe(true);
    });
});
