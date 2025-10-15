import { describe, it, expect, test } from "vitest";
import { Name } from "../../../src/adap-b01/names/Name";

//ADDITIONAL TESTS BY ME ---------------------------

describe("Escape character carnage", () => {
  it("test correct escaping of dot", () => {
    let n: Name = new Name(["path.to", "user"], ".");
    expect(n.asString()).toBe("path.to.user");
    expect(n.asDataString()).toBe("path\\\\.to.user");
    
  });

  it("test correct escaping of backslash", () => {
    let n: Name = new Name(["path\\to", "user"], "\\");
    expect(n.asString()).toBe("path\\to\\user");
    expect(n.asDataString()).toBe("path\\\\to.user");
  });
});

describe("Modify operations tests", () => {
  test("getComponent()", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect.soft(() => n.getComponent(-1)).toThrowError();
    expect.soft(() => n.getComponent(4)).toThrowError();
    expect(n.getComponent(3)).toBe("de");
    expect(n.getComponent(0)).toBe("oss");
  });

  test("getNoComponents()", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect.soft(n.getNoComponents()).toBe(4);
    n.append("test");
    expect(n.getNoComponents()).toBe(5);
    n.insert(0, "test2");
    expect(n.getNoComponents()).toBe(6);
  });

  test("setComponent()", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(() => n.setComponent(-1, "test")).toThrowError();
    expect(() => n.setComponent(4, "test")).toThrowError();
    n.append("inf");
    n.setComponent(4, "test");
    expect(n.asString()).toBe("oss.cs.fau.de.test");
  });

  test("insert (and append)", ()=> {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(() => n.insert(-1, "test")).toThrowError();
    n.insert(4, "inf");
    expect(n.asString()).toBe("oss.cs.fau.de.inf");
    n.insert(3, "test");
    expect(n.asString()).toBe("oss.cs.fau.test.de.inf");
    n.insert(0, "hallo");
    expect(n.asString()).toBe("hallo.oss.cs.fau.test.de.inf");
    n.insert(n.getNoComponents() + 5, "amEnde");
    expect(n.asString()).toBe("hallo.oss.cs.fau.test.de.inf.amEnde");
  });

  test("remove", ()=> {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(() => n.remove(-1)).toThrowError();
    expect(() => n.remove(4)).toThrowError();
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
    n.remove(2);
    expect(n.asString()).toBe("cs.fau");
  });
});