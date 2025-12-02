import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";


export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);

        this.name = source;

        this.noComponents = this.parseString().length;

        // Check validity of invariant after instantiation.
        // Especially check validity of delimiter there & component/attribute settings and state. 
        this.assertInvariant();
    }


    // Primitive methods, which are not yet provided in the abstract superclass.
    // This is because they are implementation-dependent.


    public getNoComponents(): number {
        // No pre- & postcondition, since a valid state is guaranteed by way of the invariant.
        return this.noComponents;
    }


    public getComponent(i: number): string {
        // Precondition:
        IllegalArgumentException.assert(this.isValidIndex(i), "IllegalArgumentException: Index out of bounds.");

        return this.parseString()[i];
    }


    public setComponent(i: number, c: string): void {
        // Preconditions:
        IllegalArgumentException.assert(this.isValidIndex(i), "IllegalArgumentException: Index out of bounds.");
        IllegalArgumentException.assert(this.isValidComponent(c), "IllegalArgumentException: Invalid component.");

        let components: string[] = this.parseString();
        components[i] = c;
        this.name = components.join(this.delimiter);

        // Postcondition:
        const newComp: string = this.getComponent(i);
        MethodFailedException.assert(newComp == c, "MethodFailedException: Method failed.");

        // Invariant:
        this.assertInvariant();
    }


    public insert(i: number, c: string): void {
        // Preconditions:
        IllegalArgumentException.assert(this.isValidIndex(i), "IllegalArgumentException: Index out of bounds.");
        IllegalArgumentException.assert(this.isValidComponent(c), "IllegalArgumentException: Invalid component.");

        let components: string[] = this.parseString();
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.noComponents += 1;

        // Postcondition:
        const newComp: string = this.getComponent(i);
        MethodFailedException.assert(newComp == c, "MethodFailedException: Method failed.");

        // Invariant:
        this.assertInvariant();
    }


    public append(c: string): void {
        // Precondition:
        IllegalArgumentException.assert(this.isValidComponent(c), "IllegalArgumentException: Invalid component.");

        this.name = this.name + this.delimiter + c;
        this.noComponents += 1;

        // Postcondition:
        const newComp: string = this.getComponent(this.getNoComponents() - 1);
        MethodFailedException.assert(newComp == c, "MethodFailedException: Method failed.");     
        
        // Invariant:
        this.assertInvariant();
    }


    public remove(i: number): void {
        // Precondition:
        IllegalArgumentException.assert(this.isValidIndex(i), "IllegalArgumentException: Index out of bounds.");
        IllegalArgumentException.assert(! this.isEmpty(), "IllegalArgumentException: Name is empty.")

        const oldLength: number = this.getNoComponents();
        const oldComp: string = this.getComponent(i);

        let components: string[] = this.parseString();
        const removedComp = components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents -= 1;

        // Postcondition:
        MethodFailedException.assert(oldLength - 1 == this.getNoComponents(), "MethodFailedException: Method failed.");
        MethodFailedException.assert(removedComp.toString() == oldComp, "MethodFailedException: Method failed.");

        // Invariant:
        this.assertInvariant();
    }


    public newInstance(): StringName {
        // No pre- & postconditions, since invariant guarantees valid new instance in constructor of new instance.
        return new StringName(this.name, this.delimiter);
    }


    /**
     * Parses a given data string back into a string array, with respect to escaped delimiters.
     * A more fancy version of String.split().
     * E.g. input "oss\\.\\..fau.de" returns ["oss\\.\\.", "fau", "de"]
     * E.g. input "hey.voll\\.\\..cool.hier\\." returns ["hey", "voll\\.\\.", "cool", "hier\\."]
     * @methodtype command-method
     */
    private parseString(): string[]{
        let res: string[] = [];

        // internal data string conversion, to avoid infinite loops by calling asDataString() repeatedly in the call stack
        let dataString: string = "";
        if (this.delimiter == ESCAPE_CHARACTER){
                    // Regex pattern: if 
                    dataString = this.name.replaceAll(/\\\\|\\/g, match => {
                    if (match == "\\\\") return "\\\\";             // do not un-escape literal backslash
                    return DEFAULT_DELIMITER;                       // substitute delimiter
                })
                } else {
                    dataString = this.name.replaceAll(this.delimiter, DEFAULT_DELIMITER);
                }

        let chars: string[] = dataString.split("");
        let comp: string = "";

        for (let i = 0; i < chars.length; i++){
            // search for escaped delimiter ["\\", "."] and append it to component (do not close it)
            if (chars[i] == ESCAPE_CHARACTER && chars[i+1] == DEFAULT_DELIMITER){
                comp += ESCAPE_CHARACTER;
                comp += DEFAULT_DELIMITER;
                i += 1;         // skip over the following delimiter, since it's already added
                continue;
            }
            // if un-escaped delimiter, end component and append to result
            if (chars[i] == DEFAULT_DELIMITER){
                res.push(comp);
                comp = "";
                continue;
            }
            comp += chars[i];
        }
        res.push(comp);      // append last component that had no delimiter at the end
        return res;
    }

}