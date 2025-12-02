import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";


export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }


    public findNodes(bn: string): Set<Node>{
        this.assertInvariant();
        IllegalArgumentException.assert(this.isValidBaseName(bn), "IllegalArgumentException: Invalid base name.");

        let nodes: Set<Node> = new Set<Node>();

        for (let child of this.childNodes){
            let matchingChildren: Set<Node> = child.findNodes(bn);      // recursive search in child nodes, base case provided in Node.ts
            for (let c of matchingChildren){
                nodes.add(c);
            }
        }

        return nodes;
    }

}