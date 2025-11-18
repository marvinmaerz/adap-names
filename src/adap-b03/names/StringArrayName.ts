import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super();
        throw new Error("needs implementation or deletion");
    }

    // Primitive methods, which are not yet provided in the abstract superclass.
    // This is because they are implementation-dependent.

    /** @methodtype get-method */
    public getNoComponents(): number {
        return this.components.length;
    }

    /** @methodtype get-method */
    public getComponent(i: number): string {
        if (i < 0) {throw new Error("i < 0");}
        if (i >= this.components.length) {throw new Error("i >= components.length !");}
        return this.components[i];
    }

    /** @methodtype set-method */
    public setComponent(i: number, c: string): void {
        if (i < 0) {throw new Error("i < 0");}
        if (i >= this.components.length) {throw new Error("i >= components.length !");}
        this.components[i] = c;
    }

    /** @methodtype command-method */
    public insert(i: number, c: string): void {
        if (i < 0) {throw new Error("i < 0");}
        if (i >= this.components.length) {
            this.append(c);
            return;
        }
        this.components.splice(i, 0, c);
    }

    /** Expects that new Name component c is properly masked 
     * @methodtype command-method */
    public append(c: string): void {
        this.components.push(c);
    }

    /** @methodtype command-method */
    public remove(i: number): void {
        if (i < 0) {throw new Error("i < 0");}
        if (i >= this.components.length) {throw new Error("i >= components.length !");}
        this.components.splice(i, 1);
    }

}