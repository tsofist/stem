export type Perfectionist = {
    /**
     * Starts a new Lap
     */
    start: (label: symbol) => void;
    /**
     * Ends the Lap
     */
    end: (label: symbol) => PerfectionistLap;
    /**
     * Returns the current state of the Lap without ending it
     */
    lap: (label: symbol) => PerfectionistLap;
};

export type PerfectionistLap = {
    /** The label of the Lap */
    label: symbol;
    /** The timestamp when the Lap started */
    start: number;
    /** The timestamp when the Lap ended */
    end: number | undefined;
    /** The time spent in milliseconds */
    elapsed: number;
};
