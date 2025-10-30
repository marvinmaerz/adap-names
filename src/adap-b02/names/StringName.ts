import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;


    constructor(source: string, delimiter?: string) {
        this.name = source;
        if (delimiter != undefined){
            this.delimiter = delimiter;
        }
        this.noComponents = this.parseDataString(this.asDataString()).length;
    }


    public asString(delimiter: string = this.delimiter): string {
        return this.name.replaceAll(this.delimiter, delimiter);
    }


    public asDataString(): string {
        // if DEFAULT_DELIMITER = "." is part of the component, and e.g. this.delimiter = "#", then mask the dot like this: "\\\\." 
        // before replacing "#" with "." for the data string output
        if (this.delimiter != DEFAULT_DELIMITER) { 
            let res: string = "";
            res = this.name.replaceAll(DEFAULT_DELIMITER, ESCAPE_CHARACTER + ESCAPE_CHARACTER + DEFAULT_DELIMITER);
            return res.replaceAll(this.delimiter, DEFAULT_DELIMITER);
        }
        return this.name.replaceAll(this.delimiter, DEFAULT_DELIMITER);
    }


    public getDelimiterCharacter(): string {
        return this.delimiter;
    }


    public isEmpty(): boolean {
        return this.name.length == 0;
    }


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

    public concat(other: Name): void {
        let otherComponents: string[] = this.parseDataString(other.asDataString());
        for (let comp of otherComponents){
            this.append(comp);
        }
        this.noComponents += otherComponents.length;
    }


    /**
     * Parses a given data string back into a string array, with respect to escaped delimiters.
     * A more fancy version of String.split().
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