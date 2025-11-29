import { describe, it, test, expect } from "vitest";

import { Name } from "../../../src/adap-b04/names/Name";
import { AbstractName } from "../../../src/adap-b04/names/AbstractName";
import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";

import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
import { MethodFailedException } from "../../../src/adap-b04/common/MethodFailedException";
import { InvalidStateException } from "../../../src/adap-b04/common/InvalidStateException";


// PUBLIC TESTS --------------------------------------------

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
    expect(n.getNoComponents()).toBe(4);
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss\\.cs\\.fau\\.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
    // MINE:
    expect(n.asDataString()).toBe("oss\\.cs\\.fau\\.de.people")
  });
});


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

    test("isEmtpy", ()=>{
        let n1: Name = new StringName("");
        let n2: Name = new StringArrayName([]);
        expect(n1.isEmpty()).toBe(false);
        expect(n2.isEmpty()).toBe(true);
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

    test("concat StringName", () => {
        let n1: Name = new StringName("oss.fau.de");
        let n2: Name = new StringName("oss.fau.de");
        n1.concat(n2)
        expect(n1.asDataString()).toBe("oss.fau.de.oss.fau.de");
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

	test("insert", ()=> {
		let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
		let n2: Name = new StringName("oss.cs.fau.de");
		for (let n of [n1, n2]){
			expect(() => n.insert(-1, "test")).toThrowError(IllegalArgumentException);
			expect(() => n.insert(4, "inf")).toThrow(IllegalArgumentException);
			expect(n.asString()).toBe("oss.cs.fau.de");
			n.insert(3, "test");
			expect(n.asString()).toBe("oss.cs.fau.test.de");
			n.insert(0, "hallo");
			expect(n.asString()).toBe("hallo.oss.cs.fau.test.de");
			expect(()=> n.insert(n.getNoComponents() + 5, "amEnde")).toThrow(IllegalArgumentException);			// out of bounds index on insert -> no longer expected to call append, instead Exception now
			expect(n.asString()).toBe("hallo.oss.cs.fau.test.de");
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


describe("Cloneable and Equality", () => {
    test("clone StringName", () => {
        let n1: AbstractName = new StringName("oss.cs.fau.de", "+");
        let n2: Name = n1.clone()
        // console.log(n1.asDataString(), n1.getNoComponents())
        // console.log(n2.asDataString(), n2.getNoComponents())
        expect(n1.isEqual(n2)).toBe(true);
    });

    test("clone StringArrayName", () => {
        let n1: AbstractName = new StringArrayName(["oss", "cs", "fau", "de"], "+");
        let n2: Name = n1.clone()
        // console.log(n1.asDataString(), n1.getNoComponents())
        // console.log(n2.asDataString(), n2.getNoComponents())
        expect(n1.isEqual(n2)).toBe(true);
    });

    test("isEqual", () => {
        let n1: Name = new StringName("oss.cs.fau.de");
        let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        expect(n1.isEqual(n2)).toBe(true);
        let n3: Name = new StringArrayName(["oss", "cs", "fau", "de"], "#");
        expect(n1.isEqual(n3)).toBe(false);
        expect(n2.isEqual(n3)).toBe(false);
    });

    test("hashCode", ()=>{
        let n1: Name = new StringName("oss.cs.fau.de");
        let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        let n3: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        let n4: Name = new StringArrayName(["oss", "cs", "fau", "de"], "+");
        let n5: Name = new StringArrayName(["oss", "cs", "fau", "de", "hello"], "+");
        expect(n1.getHashCode()).toBe(n2.getHashCode());
        expect(n2.getHashCode()).toBe(n3.getHashCode());
        expect(n2.getHashCode()).toBe(n4.getHashCode());
        expect(n4.getHashCode()).not.toBe(n5.getHashCode());
    });
});



// B04 ---------------------------------------------------------
// Preconditions, Postconditions & Invariant

describe("Class Invariant Violation & Protection", () => {
    test("Invalid components", ()=>{
		expect(() => {let n: Name = new StringArrayName(["oss\\", "cs\\\\", "fau\.", "de."], ".")}).toThrow(InvalidStateException);
        // same test not possible for StringName, since that class cannot discern correctly delimiter at runtime
	});

    test("Backslash as delimiter", () => {
		expect(() => {let n1: Name = new StringArrayName(["path\\\\to", "user"], "\\")}).toThrow(InvalidStateException);
		expect(() => {let n2: Name = new StringName("path\\\\to\\user", "\\")}).toThrow(InvalidStateException);
	});

    test("Invalid delimiter", () => {
        expect(()=> {let n:Name=new StringArrayName(["oss", "cs", "fau", "de"], "null")}).toThrow(InvalidStateException);
        expect(()=> {let n:Name=new StringName("ossnullcsnullfaunullde", "null")}).toThrow(InvalidStateException);
    });

});


describe("Precondition Violations", () => {
    test("asString", ()=>{
        let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
		let n2: Name = new StringName("oss.cs.fau.de");
        for (let n of [n1, n2]){
            expect(()=> n.asString("null")).toThrow(IllegalArgumentException);
        }
    })

    test("getComponent", ()=>{
        let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
		let n2: Name = new StringName("oss.cs.fau.de");
        for (let n of [n1, n2]){
            expect(()=> n.getComponent(-1)).toThrow(IllegalArgumentException);
            expect(()=> n.getComponent(n.getNoComponents())).toThrow(IllegalArgumentException);
        }
    })

    test("setComponent", ()=>{
        let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"], ".");
		let n2: Name = new StringName("oss.cs.fau.de", ".");
        for (let n of [n1, n2]){
            expect(()=> n.setComponent(-1, "string")).toThrow(IllegalArgumentException);
            expect(()=> n.setComponent(n.getNoComponents(), "string")).toThrow(IllegalArgumentException);
            expect(()=> n.setComponent(2, "string.")).toThrow(IllegalArgumentException);
        }
    })

    test("insert", ()=> {
		let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
		let n2: Name = new StringName("oss.cs.fau.de");
		for (let n of [n1, n2]){
			expect(() => n.insert(-1, "test")).toThrowError(IllegalArgumentException);
			expect(() => n.insert(4, "inf")).toThrow(IllegalArgumentException);
			expect(n.asString()).toBe("oss.cs.fau.de");
			n.insert(3, "test");
			expect(n.asString()).toBe("oss.cs.fau.test.de");
			n.insert(0, "hallo");
			expect(n.asString()).toBe("hallo.oss.cs.fau.test.de");
			expect(()=> n.insert(n.getNoComponents() + 5, "amEnde")).toThrow(IllegalArgumentException);			// out of bounds index on insert -> no longer expected to call append, instead Exception now
			expect(n.asString()).toBe("hallo.oss.cs.fau.test.de");
            expect(()=> n.insert(2, "string.")).toThrow(IllegalArgumentException);
		}
    });

    test("append", ()=>{
        let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
		let n2: Name = new StringName("oss.cs.fau.de");
        for (let n of [n1, n2]){
            expect(()=> n.append("null.")).toThrow(IllegalArgumentException);
            expect(()=> n.append("null\\.")).not.toThrow(IllegalArgumentException);
        }
    });

    test("remove", ()=>{
        let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
		let n2: Name = new StringName("oss.cs.fau.de");
        for (let n of [n1, n2]){
            expect(()=> n.remove(-1)).toThrow(IllegalArgumentException);
            expect(()=> n.remove(n.getNoComponents())).toThrow(IllegalArgumentException);
        }
    })
});


// describe("Postcondition Violations", ()=>{
//     // How to test this?
// });
