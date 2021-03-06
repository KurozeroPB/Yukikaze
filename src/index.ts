export class Interval {
    public active: boolean;
    public baseline?: number;
    public timer?: NodeJS.Timeout;

    #first = true;

    constructor() {
        this.active = false;
    }

    /**
     * @since 0.1.0 Created function
     * @since 0.3.0 Added `initial` param
     *
     * Start and run the interval
     *
     * @param fn The function to run
     * @param duration The duration between each function run
     * @param initial Whether to run the given function immediately or wait the x milliseconds before running it the first time
     *
     * @returns {NodeJS.Timeout}
     */
    run(fn: (...args: any[]) => void, duration: number, initial = false): NodeJS.Timeout {
        if (this.baseline === undefined) {
            this.baseline = new Date().getTime();
        }

        if ((initial && this.#first) || !this.#first) fn();
        if (this.#first) this.#first = false;

        const end = new Date().getTime();
        this.baseline += duration;

        let nextTick = duration - (end - this.baseline);
        if (nextTick < 0) {
            nextTick = 0;
        }

        this.timer = setTimeout(() => this.run(fn, duration), nextTick);
        this.active = true;
        return this.timer;
    }

    /**
     * @since 0.1.0 Created function
     *
     * Stop the interval
     */
    stop(): void {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
            this.active = false;
        }
    }
}

export default Interval;
/**
 * export default only creates `exports.default = Interval;`
 * which is very ugly and impractical syntax in javascript so we add a module.exports
 * imo export default should be transpiled to module.exports
 */
module.exports = Interval;
