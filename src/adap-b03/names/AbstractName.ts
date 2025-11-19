import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }


    public clone(): Name {
        return this.newInstance();
    }


    public asString(delimiter: string = this.delimiter): string {
        let s: string = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (i > 0) s += delimiter;
            let comp: string = this.getComponent(i);
            if (this.delimiter == ESCAPE_CHARACTER) {
                comp = comp.replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER); // "\\\\" (escaped backslash) -> "\\" (literal backslash at runtime)
            } 
            else {
                comp = comp.replaceAll(ESCAPE_CHARACTER, "");
            }
            s += comp;          
        }

        return s;
    }
    

    public toString(): string {
        return this.asDataString();
    }


    public asDataString(): string {
        let s: string = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (i > 0) s += DEFAULT_DELIMITER;
            s += this.getComponent(i);
        }

        return s;
    }


    public isEqual(other: Name): boolean {
        // Different lengths => not equal
        if (this.getNoComponents() != other.getNoComponents()) {
            return false;
        }

        if (this.delimiter != other.getDelimiterCharacter()) {
            return false;
        }

        // Check for (mis-)matching components
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) != other.getComponent(i)) {
                return false;
            }
        }

        return true;
    }


    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }

        return hashCode;
    }


    public isEmpty(): boolean {
        return this.getNoComponents() == 0;
    }


    public getDelimiterCharacter(): string {   
        return this.delimiter;
    }


    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
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

    /**
     * Helper method for AbstractName.clone() 
     * @returns A new instance that can be returned as a clone of this object. */
    abstract newInstance(): AbstractName;
}