import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        IllegalArgumentException.assert(! this.isFileOpen() && this.doGetFileState() != FileState.DELETED, "IllegalArgumentException: Don't open an open or deleted file.");
        // do something
    }

    public read(noBytes: number): Int8Array {
        IllegalArgumentException.assert(this.isFileOpen(), "IllegalArgumentException: Don't read from a closed or deleted file.");

        let result: Int8Array = new Int8Array(noBytes);
        // do something

        let tries: number = 0;
        for (let i: number = 0; i < noBytes; i++) {
            try {
                result[i] = this.readNextByte();
            } catch(ex) {
                tries++;
                if (ex instanceof MethodFailedException) {
                    // Oh no! What @todo?!
                }
            }
        }

        return result;
    }

    protected readNextByte(): number {
        return 0; // @todo
    }

    public close(): void {
        IllegalArgumentException.assert(this.isFileOpen(), "IllegalArgumentException: Don't close a closed or deleted file.");
        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }


    /**
     * Precondition check.
     * @returns True if the file is open, else false.
     */
    private isFileOpen(): boolean{
        let state: FileState = this.doGetFileState();
        if (state == FileState.CLOSED || state == FileState.DELETED) return false;
        return true;
    }

}