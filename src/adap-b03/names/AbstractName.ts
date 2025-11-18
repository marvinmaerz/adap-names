import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        throw new Error("needs implementation or deletion");
    }

    public clone(): Name {      // Kandidat für Implementierung hier
        throw new Error("needs implementation or deletion");
    }

    public asString(delimiter: string = this.delimiter): string {
        throw new Error("needs implementation or deletion");
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        throw new Error("needs implementation or deletion");
    }

    public isEqual(other: Name): boolean {  // Kandidat für Implementierung hier
        throw new Error("needs implementation or deletion");
    }

    public getHashCode(): number {  // Kandidat für Implementierung hier
        throw new Error("needs implementation or deletion");
    }

    public isEmpty(): boolean { // Kandidat für Implementierung hier
        throw new Error("needs implementation or deletion");
    }

    public getDelimiterCharacter(): string {    // Kandidat für Implementierung hier
        throw new Error("needs implementation or deletion");
    }

    public concat(other: Name): void {
        throw new Error("needs implementation or deletion");
    }


    // Primitive methods, need to be implemented in the sub-classes.
    // The above non-abstract methods can be built solely with logic using those functions.
    // When they are implemented in their respective sub-classes, the narrow inheritance interface is complete.
    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;
}