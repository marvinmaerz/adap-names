import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        IllegalArgumentException.assert(this.isValidBaseName(bn), "IllegalArgumentException: Invalid base name.");
        this.doSetBaseName(bn);
        this.assertInvariant();
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    
    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        this.assertInvariant();
        IllegalArgumentException.assert(this.isValidBaseName(bn), "IllegalArgumentException: Invalid base name.");
        let nodes: Set<Node> = new Set<Node>();

        // Base case for recursive search
        if (this.getBaseName() == bn) nodes.add(this);

        return nodes;
    }




    /**
     * Precondition check.
     * @param bn Base name to be checked for validity.
     * @returns True if the base name is valid.
     */
    protected isValidBaseName(bn: string): boolean{
        return bn.length > 0;
    }


    /**
     * Defining and asserting valid object states.
     * Throwing an InvalidStateException if the Node is in an invalid state.
     */
    protected assertInvariant(): void{
        const str: string = "InvalidStateException: ";
        InvalidStateException.assert(this.getBaseName().length > 0, str+"Invalid base name.")
    }

}
