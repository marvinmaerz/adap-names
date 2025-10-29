import { describe, it, test, expect } from "vitest";

import { Name } from "../../../src/adap-b02/names/Name";
import { StringName } from "../../../src/adap-b02/names/StringName";
import { StringArrayName } from "../../../src/adap-b02/names/StringArrayName";


describe("Concatenate tests", ()=>{
    test("concat", () => {
        let n1: Name = new StringArrayName(["oss", "fau", "de"]);
        let n2: Name = new StringArrayName(["oss", "fau", "de"]);
        n1.concat(n2)
        expect(n1.asDataString()).toBe("oss.fau.de.oss.fau.de");
    });

    test("concat with delimiter in component", ()=>{
        let n1: Name = new StringArrayName(["oss.", "fau", "de"]);
        let n2: Name = new StringArrayName(["oss.", "fau.", "de"]);
        let n3: Name = new StringArrayName(["hey", "voll..", "cool", "hier."])
        n1.concat(n2);
        expect(n1.asDataString()).toBe("oss\\\\..fau.de.oss\\\\..fau\\\\..de");
        n1.concat(n3);
        expect(n1.asDataString()).toBe("oss\\\\..fau.de.oss\\\\..fau\\\\..de.hey.voll\\\\.\\\\..cool.hier\\\\.")
    });
});