export type StateConfig<TEvent extends string, TState extends string> = {
    on?: Record<TEvent, TState>;
    onEntry?: () => void;
    onExit?: () => void;
};

export type MachineConfig<TState extends string, TEvent extends string> = {
    id: string;
    initial: TState;
    states: Record<TState, StateConfig<TEvent, TState>>;
};

export function createMachine<TState extends string, TEvent extends string>(
    config: MachineConfig<TState, TEvent>
) {
    return config;
}
