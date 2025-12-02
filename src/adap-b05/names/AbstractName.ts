import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }


    public clone(): Name {
        // No pre- & postconditions, validity of this instance asserted by class invariant, successful cloning checked by unit tests.
        return this.newInstance();
    }



    public asString(delimiter: string = this.delimiter): string {
        // Precondition:
        IllegalArgumentException.assert(this.isValidDelChar(delimiter), "IllegalArgumentException: Delimiter is invalid");

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

        // Postcondition: none (no mutation method, validity of output guaranteed by validity of Name invariant).
        return s;
    }
    

    public toString(): string {
        return this.asDataString();
    }


    public asDataString(): string {
        // Precondition: none (no user input, validity of Name asserted through invariant).

        let s: string = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (i > 0) s += DEFAULT_DELIMITER;
            s += this.getComponent(i);
        }
        
        // Postcondition: none (no mutation method, validity of output guaranteed by validity of Name through invariant).
        return s;
    }


    public isEqual(other: Name): boolean {
        // Precondition: other must be a valid Name. This is satisfied by its own class invariant, so no need to check here.

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

        // Postcondition: none (no mutation method, validity of output guaranteed by validity of Name invariant).
        return true;
    }


    public getHashCode(): number {
        // Precondition: none (no user input, validity of Name asserted through invariant).

        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }

        // Postcondition: none (no mutation method, validity of output guaranteed by unit tests & validity of Name invariant).
        return hashCode;
    }


    public isEmpty(): boolean {
        // No pre- & postconditions.
        return this.getNoComponents() == 0;
    }


    public getDelimiterCharacter(): string { 
        // No pre- & postconditions, since validity of delimiter is checked in the invariant, after the constructor.
        // Since validity of delimiter is safeguarded by the invariant, there is no need to potentially throw an IllegalArgumentException for it here.
        return this.delimiter;
    }


    public concat(other: Name): void {
        // Precondition: other must be a valid Name. This is satisfied by its own class invariant, so no need to check here.

        let oldName: Name = this.clone();
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }

        // Postcondition: this should be un-equal to oldName.
        MethodFailedException.assert(! this.isEqual(oldName), "MethodFailedException: Method failed.")

        // Invariant:
        this.assertInvariant();
    }


    // ------------------------------------------------------------------
    // B03: Primitive methods, need to be implemented in the sub-classes.
    // The above non-abstract methods can be built solely with logic using those functions.
    // When they are implemented in their respective sub-classes, the narrow inheritance interface is complete.

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    /**
     * Helper method for AbstractName.clone().
     * @returns A new instance that can be returned as a clone of this object. */
    abstract newInstance(): AbstractName;



    // -----------------------------------------------
    // B04: Pre- & Postcondition, Invariant helper methods:

    /**
     * The class invariant, which must hold anytime the object is in a "safe" state.
     * Should be called after mutation methods.
     * Throws an InvalidStateException, if the invariant is not satisfied, i.e. the object is in an invalid state.
     */
    protected assertInvariant(): void {
        const str: string = "InvalidStateException: ";

        InvalidStateException.assert(this.getNoComponents() >= 0, str+"Name cannot not have less than zero components.");

        InvalidStateException.assert(this.getDelimiterCharacter() != ESCAPE_CHARACTER, str+"Delimiter cannot be the escape character.");
        InvalidStateException.assert(this.getDelimiterCharacter() != undefined, str+"Delimiter cannot be undefined.");
        InvalidStateException.assert(this.isValidDelChar(), str+"Delimiter must be a single character.");

        for (let i=0; i < this.getNoComponents(); i++) {
            let comp: string = this.getComponent(i);
            InvalidStateException.assert(this.isValidComponent(comp), str+"Components must be valid.");
        }
    }

    
    /**
     * Checks index for validity.
     * @param index To be checked.
     * @returns True, if index is in range [0, this.getNoComponents).
     */
    protected isValidIndex(index: number): boolean{
        return (index >= 0 && index < this.getNoComponents())
    }


    /**
     * Checks correct masking of delimiter characters and existence of components.
     * @returns True, if all delimiter characters that are to appear verbatim in the component are correctly masked.
     */
    protected isValidComponent(component: string): boolean{
        if (component == undefined || component == null) return false;

        let delim: string = this.getDelimiterCharacter();
        let chars: string[] = component.split("");
        for (let i = 0; i < chars.length; i++) {
            if (chars[i] == delim && chars[i-1] != ESCAPE_CHARACTER) return false;
        }
        return true;
    }


    /**
     * Checks if delimiter is valid.
     * @param delimiter To be checked.
     * @returns True if delimiter is exactly a char.
     */
    protected isValidDelChar(delimiter: string = this.delimiter): boolean{
        if (delimiter == ESCAPE_CHARACTER) return false;
        if (delimiter == undefined) return false;
        return delimiter.length == 1;
    }


    
}