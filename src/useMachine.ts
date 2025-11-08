import { useState, useCallback } from "react";
import { MachineConfig } from "./createMachine";

export function useMachine<TState extends string, TEvent extends string>(
    machine: MachineConfig<TState, TEvent>
) {
    const [state, setState] = useState<TState>(machine.initial);

    const send = useCallback(
        (event: TEvent) => {
            const current = machine.states[state];
            const next = current.on?.[event];
            if (!next || next === state) return;

            current.onExit?.();
            machine.states[next].onEntry?.();
            setState(next);
        },
        [state, machine]
    );

    const matches = useCallback((s: TState) => s === state, [state]);

    return [{ value: state, matches }, send] as const;
}
