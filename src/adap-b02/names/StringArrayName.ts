import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {


    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];


    /** Expects that all Name components are properly masked */
    constructor(source: string[], delimiter?: string) {
        this.components = source;
        if (delimiter != undefined){
            this.delimiter = delimiter;
        }
    }


    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     * @methodtype conversion-method
     */
    public asString(delimiter: string = this.delimiter): string {
        let res: string = "";
        for (let index = 0; index < this.components.length; index++) {
            let comp: string = this.components[index];
            res += comp;
            if (index != this.components.length - 1) res += delimiter;   // do not put delimiter after last component
        }
        return res; 
    }


    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     * @methodtype conversion-method
     */
    public asDataString(): string {
        let res: string = "";
        for (let index = 0; index < this.components.length; index++) {
            let comp: string = this.components[index];
            comp = comp.replaceAll(".", ESCAPE_CHARACTER + ".");
            comp = comp.replaceAll("\\", ESCAPE_CHARACTER + "\\");
            res += comp;
            if (index != this.components.length - 1) res += DEFAULT_DELIMITER;
        }
        return res;
    }


    /** @methodtype boolean-query-method */
    public isEmpty(): boolean {
        throw new Error("needs implementation or deletion");
    }


    /** @methodtype get-method */
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }


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


    /** @methodtype command-method */
    public concat(other: Name): void {
        let otherComponents: string[] = this.parseDataString(other.asDataString());
        for (let comp of otherComponents){
            this.append(comp);
        }
    }


    /**
     * Parses a given data string back into a string array, with respect to escaped delimiters.
     * E.g. input "oss\\.\\..fau.de" returns ["oss..", "fau", "de"]
     * E.g. input "hey.voll\\.\\..cool.hier\\." returns ["hey", "voll..", "cool", "hier."]
     * @methodtype command-method
     */
    protected parseDataString(data: string): string[]{
        let res: string[] = [];
        let chars: string[] = data.split("");
        let comp: string = "";
        for (let i = 0; i < chars.length; i++){
            // search for escaped delimiter ["\\", "\\", "."] and append only it to component
            if (chars[i] == ESCAPE_CHARACTER && chars[i+1] == ESCAPE_CHARACTER && chars[i+2] == DEFAULT_DELIMITER){
                comp += DEFAULT_DELIMITER;
                i += 2;         // skip over the following escape character + delimiter
                continue;
            }
            if (chars[i] == DEFAULT_DELIMITER){
                // if delimiter not escaped, append the now ended component to the result and begin construction of new component
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