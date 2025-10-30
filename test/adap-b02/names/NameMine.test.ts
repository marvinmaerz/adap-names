import { describe, it, test, expect } from "vitest";

import { Name } from "../../../src/adap-b02/names/Name";
import { StringName } from "../../../src/adap-b02/names/StringName";
import { StringArrayName } from "../../../src/adap-b02/names/StringArrayName";


//ADDITIONAL TESTS BY ME ---------------------------

describe("StringName basic tests", ()=>{
    test("asString", ()=>{
        let n: Name = new StringName("oss.cs.fau.de", ".");
        let n2: Name = new StringName("oss#cs#fau#de", "#");
        expect(n.asString()).toBe("oss.cs.fau.de");
        expect(n.asString("#")).toBe("oss#cs#fau#de");
        expect(n.asDataString()).toBe("oss.cs.fau.de");
        expect(n2.asString()).toBe("oss#cs#fau#de");
        expect(n2.asDataString()).toBe("oss.cs.fau.de");
    });
})


describe("Interchangeability of StringArrayName and StringName", ()=>{
    test("basic output equality", ()=>{
        let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        let n2: Name = new StringName("oss.cs.fau.de");
        expect(n1.asString()).toBe(n2.asString());
        expect(n1.asDataString()).toBe(n2.asDataString());
        expect(n1.asString("#")).toBe(n2.asString("#"));
        // test for same dataString output even with different user set delimiters
        let n3: Name = new StringArrayName(["oss", "cs", "fau", "de"], "-");
        let n4: Name = new StringName("oss#cs#fau#de", "#");
        n3.insert(2, "hello");
        n4.insert(2, "hello");
        expect(n3.asDataString()).toBe(n4.asDataString());
    });

    test("concat StringName with StringArrayName", ()=>{
        let n1: Name = new StringName("oss/cs/fau\\.de", "/");
        let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"], "/");
        n1.concat(n2)
        expect(n1.asString()).toBe("oss/cs/fau.de/oss/cs/fau/de");
        n1.append("dataType");
        expect(n1.asString()).toBe("oss/cs/fau.de/oss/cs/fau/de/dataType");
        expect(n1.asDataString()).toBe("oss.cs.fau\\.de.oss.cs.fau.de.dataType")
    });

    test("concat StringArrayName with StringName", ()=>{
        let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        let n2: Name = new StringName("oss.cs.fau.de");
        n1.concat(n2);
        expect(n1.asDataString()).toBe("oss.cs.fau.de.oss.cs.fau.de");
    });
})


describe("Concatenate tests", ()=>{
    test("concat", () => {
        let n1: Name = new StringArrayName(["oss", "fau", "de"]);
        let n2: Name = new StringArrayName(["oss", "fau", "de"]);
        n1.concat(n2)
        expect(n1.asDataString()).toBe("oss.fau.de.oss.fau.de");
		expect(n1.getNoComponents()).toBe(6);
    });

    test("concat with delimiter in component", ()=>{
        let n1: Name = new StringArrayName(["oss\\.", "fau", "de"]);
        let n2: Name = new StringArrayName(["oss\\.", "fau\\.", "de"]);
        let n3: Name = new StringArrayName(["hey", "voll\\.\\.", "cool", "hier\\."])
        n1.concat(n2);
        expect(n1.asDataString()).toBe("oss\\..fau.de.oss\\..fau\\..de");
		expect(n1.getNoComponents()).toBe(6);
        n1.concat(n3);
        expect(n1.asDataString()).toBe("oss\\..fau.de.oss\\..fau\\..de.hey.voll\\.\\..cool.hier\\.")
    });
});


describe("Modify operations tests", () => {
	test("getComponent()", () => {
		let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
		let n2: Name = new StringName("oss.cs.fau.de");
		expect.soft(() => n.getComponent(-1)).toThrowError();
		expect.soft(() => n.getComponent(4)).toThrowError();
		expect(n.getComponent(3)).toBe("de");
		expect(n.getComponent(0)).toBe("oss");
		expect(n2.getComponent(3)).toBe("de");
		expect(n2.getComponent(0)).toBe("oss");
	});

	test("getComponent", ()=>{
		let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
		let n2: Name = new StringName("oss.cs.fau.de");
		for (let n of [n1, n2]){

		}
	});

	test("getComponent masking", ()=>{
		let n: Name = new StringArrayName(["oss\\", "cs\\\\", "fau\.", "de."], ".");
		expect(n.getComponent(0)).toBe("oss\\");
		expect(n.getComponent(1)).toBe("cs\\\\");
		expect(n.getComponent(3)).toBe("de.");      // since the dot is supposed to be a part of the component (not masked when coming into the constructor), do not mask it here
	});

	test("getNoComponents()", () => {
		let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
		let n2: Name = new StringName("oss.cs.fau.de");
		for (let n of [n1, n2]){
			expect.soft(n.getNoComponents()).toBe(4);
			n.append("test");
			expect(n.getNoComponents()).toBe(5);
			n.insert(0, "test2");
			expect(n.getNoComponents()).toBe(6);
		}

	});

	test("setComponent()", () => {
		let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
		let n2: Name = new StringName("oss.cs.fau.de");
		for (let n of [n1, n2]){
			expect(() => n.setComponent(-1, "test")).toThrowError();
			expect(() => n.setComponent(4, "test")).toThrowError();
			n.append("inf");
			n.setComponent(4, "test");
			expect(n.asString()).toBe("oss.cs.fau.de.test");
		}
    
  });

	test("insert (and append)", ()=> {
		let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
		let n2: Name = new StringName("oss.cs.fau.de");
		for (let n of [n1, n2]){
			expect(() => n.insert(-1, "test")).toThrowError();
			n.insert(4, "inf");
			expect(n.asString()).toBe("oss.cs.fau.de.inf");
			n.insert(3, "test");
			expect(n.asString()).toBe("oss.cs.fau.test.de.inf");
			n.insert(0, "hallo");
			expect(n.asString()).toBe("hallo.oss.cs.fau.test.de.inf");
			n.insert(n.getNoComponents() + 5, "amEnde");			// out of bounds index on insert -> expected to call append
			expect(n.asString()).toBe("hallo.oss.cs.fau.test.de.inf.amEnde");
		}
  });

	test("remove", ()=> {
		let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
		let n2: Name = new StringName("oss.cs.fau.de");
		for (let n of [n1, n2]){
			expect(() => n.remove(-1)).toThrowError();
			expect(() => n.remove(4)).toThrowError();
			n.remove(0);
			expect(n.asString()).toBe("cs.fau.de");
			n.remove(2);
			expect(n.asString()).toBe("cs.fau");
		}
	});
});



describe("Escape character carnage", () => {
	it("test correct escaping of dot", () => {
		// careful to mask the dot (or backslash) in first component correctly! 
		// else, StringName becomes ambiguous when parsing the string
		let n1: Name = new StringArrayName(["path\\.to", "user"], ".");
		let n2: Name = new StringName("path\\.to.user", ".");
		expect(n1.asString()).toBe("path.to.user");
		expect(n1.asDataString()).toBe("path\\.to.user");
		expect(n2.asString()).toBe("path.to.user");
		expect(n2.asDataString()).toBe("path\\.to.user");
	});

	it("test correct escaping of backslash 1", () => {
		let n1: Name = new StringArrayName(["path\\\\to", "user"], "\\");
		let n2: Name = new StringName("path\\\\to\\user", "\\");
		for (let n of [n1, n2]){
			expect(n.asString()).toBe("path\\to\\user");
			expect(n.asString(".")).toBe("path\\to.user");
			expect(n.asDataString()).toBe("path\\\\to.user");
		}
	});

	it("test correct escaping of backslash 2", () => {
		let n: Name = new StringArrayName(["path\\to", "user"], ".");
		let n2: Name = new StringName("path\\to.user", ".");
		expect(n.asString()).toBe("pathto.user");
		expect(n2.asString()).toBe("pathto.user");
	});

	it("test correct escaping of backslash 3 (verified by Prof Riehle)", () => {
		let n: Name = new StringArrayName(["oss\\", "cs", "fau\\.", "de"], ".");
		let n2: Name = new StringName("oss\\.cs.fau\\..de", ".");
		expect(n.asString()).toBe("oss.cs.fau..de")
		expect(n2.asString()).toBe("oss.cs.fau..de");
	});

	it("test escape and delimiter boundary conditions", () => {
		// Original name string = "oss.cs.fau.de"
		let n: Name = new StringArrayName(["oss\\.cs\\.fau\\.de"], '#');
		let n2: Name = new StringName("oss\\.cs\\.fau\\.de", "#");
		expect(n.asString()).toBe("oss.cs.fau.de");
		expect(n2.asString()).toBe("oss.cs.fau.de");
		n.append("people");
		n2.append("people");
		expect(n.asString()).toBe("oss.cs.fau.de#people");
		expect(n2.asString()).toBe("oss.cs.fau.de#people");
		expect(n.asString("-")).toBe("oss.cs.fau.de-people")
		expect(n2.asString("-")).toBe("oss.cs.fau.de-people")
		expect(n.asDataString()).toBe("oss\\.cs\\.fau\\.de.people");
		expect(n2.asDataString()).toBe("oss\\.cs\\.fau\\.de.people");
	});
});