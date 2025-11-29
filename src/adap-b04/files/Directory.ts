import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        // Precondition: cn must be a valid Node. Guarded through argument type and (hypothetical) Node class invariant.
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        // Precondition: cn must be a valid Node. Guarded through argument type and (hypothetical) Node class invariant.
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        // Precondition: cn must be a valid Node. Guarded through argument type and (hypothetical) Node class invariant.
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

}