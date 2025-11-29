import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";


export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);

        this.components = source;

        // Check validity of invariant after instantiation.
        // Especially check validity of delimiter there & component/attribute settings and state. 
        this.assertInvariant();

    }

    // Primitive methods, which are not yet provided in the abstract superclass.
    // This is because they are implementation-dependent.


    /** @methodtype get-method */
    public getNoComponents(): number {
        // No pre- & postcondition, since a valid state is guaranteed by way of the invariant. 
        return this.components.length;
    }


    /** @methodtype get-method */
    public getComponent(i: number): string {
        // Precondition:
        IllegalArgumentException.assert(this.isValidIndex(i), "IllegalArgumentException: Index out of bounds.");

        return this.components[i];
    }


    /** @methodtype set-method */
    public setComponent(i: number, c: string): void {
        // Preconditions:
        IllegalArgumentException.assert(this.isValidIndex(i), "IllegalArgumentException: Index out of bounds.");
        IllegalArgumentException.assert(this.isValidComponent(c), "IllegalArgumentException: Invalid component.");

        this.components[i] = c;

        // Postcondition:
        const newComp: string = this.getComponent(i);
        MethodFailedException.assert(newComp == c, "MethodFailedException: Method failed.");

        // Invariant:
        this.assertInvariant();
    }


    /** @methodtype command-method */
    public insert(i: number, c: string): void {
        // Preconditions:
        IllegalArgumentException.assert(this.isValidIndex(i), "IllegalArgumentException: Index out of bounds.");
        IllegalArgumentException.assert(this.isValidComponent(c), "IllegalArgumentException: Invalid component.");

        this.components.splice(i, 0, c);

        // Postcondition:
        const newComp: string = this.getComponent(i);
        MethodFailedException.assert(newComp == c, "MethodFailedException: Method failed.");

        // Invariant:
        this.assertInvariant();
    }


    /** Expects that new Name component c is properly masked 
     * @methodtype command-method */
    public append(c: string): void {
        // Precondition:
        IllegalArgumentException.assert(this.isValidComponent(c), "IllegalArgumentException: Invalid component.");

        this.components.push(c);

        // Postcondition:
        const newComp: string = this.getComponent(this.getNoComponents() - 1);
        MethodFailedException.assert(newComp == c, "MethodFailedException: Method failed.");     
        
        // Invariant:
        this.assertInvariant();
    }


    /** @methodtype command-method */
    public remove(i: number): void {
        // Precondition:
        IllegalArgumentException.assert(this.isValidIndex(i), "IllegalArgumentException: Index out of bounds.");
        IllegalArgumentException.assert(! this.isEmpty(), "IllegalArgumentException: Name is empty.")

        const oldLength: number = this.getNoComponents();
        const oldComp: string = this.getComponent(i);

        const removedComp = this.components.splice(i, 1);

        // Postcondition:
        MethodFailedException.assert(oldLength - 1 == this.getNoComponents(), "MethodFailedException: Method failed.");
        MethodFailedException.assert(removedComp.toString() == oldComp, "MethodFailedException: Method failed.");

        // Invariant:
        this.assertInvariant();
    }


    public newInstance(): StringArrayName {
        // No pre- & postconditions, since invariant guarantees valid new instance in constructor of new instance.
        return new StringArrayName([... this.components], this.delimiter);
    }

}