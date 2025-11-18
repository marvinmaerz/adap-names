import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super();
        throw new Error("needs implementation or deletion");
    }


    // Primitive methods, which are not yet provided in the abstract superclass.
    // This is because they are implementation-dependent.
    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        if (i < 0) {throw new Error("i < 0");}
        if (i >= this.noComponents) {throw new Error("i >= noComponents !");}
        return this.parseDataString(this.asDataString())[i];
    }

    public setComponent(i: number, c: string): void {
        if (i < 0) {throw new Error("i < 0");}
        if (i >= this.noComponents) {throw new Error("i >= noComponents !");}
        let components: string[] = this.parseDataString(this.asDataString());
        components[i] = c;
        this.name = components.join(this.delimiter);
    }

    public insert(i: number, c: string): void {
        if (i < 0) {throw new Error("i < 0");}
        if (i >= this.noComponents) {
            this.append(c);
            return;
        }
        let components: string[] = this.parseDataString(this.asDataString());
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.noComponents += 1;
    }

    public append(c: string): void {
        this.name = this.name + this.delimiter + c;
        this.noComponents += 1;
    }

    public remove(i: number): void {
        if (i < 0) {throw new Error("i < 0");}
        if (i >= this.noComponents) {throw new Error("i >= noComponents !");}
        let components: string[] = this.parseDataString(this.asDataString());
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents -= 1;
    }

    /**
     * Parses a given data string back into a string array, with respect to escaped delimiters.
     * A more fancy version of String.split().
     * E.g. input "oss\\.\\..fau.de" returns ["oss\\.\\.", "fau", "de"]
     * E.g. input "hey.voll\\.\\..cool.hier\\." returns ["hey", "voll\\.\\.", "cool", "hier\\."]
     * @methodtype command-method
     */
    protected parseDataString(data: string): string[]{
        let res: string[] = [];
        let chars: string[] = data.split("");
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