import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";
import { Node } from "./Node";

import { Exception } from "../common/Exception";


import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { InvalidStateException } from "../common/InvalidStateException";


export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode() {
        return this.ROOT_NODE;
    }

    constructor() {
        super("", new Object as Directory);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = this;
    }

    public getFullName(): Name {
        return new StringName("", '/');
    }

    public move(to: Directory): void {
        // null operation, cannot move the root node
    }

    protected doSetBaseName(bn: string): void {
        // null operation, cannot rename the root node
    }


    /**
     * Valid state of the root node differs from the valid state of other nodes:
     * Root node is allowed to (only) have base name "", while this behavior is prohibited for any other node.
     */
    protected assertInvariant(): void{
        const str: string = "InvalidStateException: ";
        InvalidStateException.assert(this.getBaseName() == "", str+"Invalid base name for root node.");
    }


    public findNodes(bn: string): Set<Node>{
        // Catching any exceptions that "bubble" up inside of the service and components.
        try {
            return super.findNodes(bn);     // Use Directory.findNodes(bn) for the actual recursive search
        } catch (ex) {
            if (ex instanceof Exception) {
                // Throw ServiceFailureException, with trigger chain attached (i.e. Exceptions that caused the service to fail)
                ServiceFailureException.assert(false, "ServiceFailureException: File system failure", ex);
            }
        }
        
        return new Set<Node>();
    }

}