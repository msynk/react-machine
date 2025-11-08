import { describe, it, expect } from "vitest";
import { createMachine } from "../createMachine";

describe("createMachine", () => {
    it("returns the config as-is", () => {
        const m = createMachine({
            id: "toggle",
            initial: "off" as const,
            states: {
                off: { on: { TOGGLE: "on" } },
                on: { on: { TOGGLE: "off" } },
            },
        });
        expect(m.id).toBe("toggle");
        expect(m.initial).toBe("off");
        expect(m.states.off.on?.TOGGLE).toBe("on");
    });
});
