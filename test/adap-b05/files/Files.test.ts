import { describe, it, expect } from "vitest";

import { Exception } from "../../../src/adap-b05/common/Exception";
import { InvalidStateException } from "../../../src/adap-b05/common/InvalidStateException";
import { ServiceFailureException } from "../../../src/adap-b05/common/ServiceFailureException";

import { StringName } from "../../../src/adap-b05/names/StringName";

import { Node } from "../../../src/adap-b05/files/Node";
import { Link } from "../../../src/adap-b05/files/Link";
import { File } from "../../../src/adap-b05/files/File";
import { BuggyFile } from "../../../src/adap-b05/files/BuggyFile";
import { Directory } from "../../../src/adap-b05/files/Directory";
import { RootNode } from "../../../src/adap-b05/files/RootNode";

function createFileSystem(): RootNode {
  let rn: RootNode = new RootNode();

  let usr: Directory = new Directory("usr", rn);
  let bin: Directory = new Directory("bin", usr);
  let ls: File = new File("ls", bin);
  let code: File = new File("code", bin);
  let link: Link = new Link("link", bin, code);         // added link with base name "link" to the File "code"

  let media: Directory = new Directory("media", rn);

  let home: Directory = new Directory("home", rn);
  let riehle: Directory = new Directory("riehle", home);
  let bashrc: File = new File(".bashrc", riehle);
  let wallpaper: File = new File("wallpaper.jpg", riehle);
  let projects: Directory = new Directory("projects", riehle);

  return rn;
}

describe("Basic naming test", () => {
  it("test name checking", () => { 
    let fs: RootNode = createFileSystem();
    let ls: Node = [...fs.findNodes("ls")][0]; 
    expect(ls.getFullName().asString()).toBe(new StringName("/usr/bin/ls", '/').asString());

    // Test if links work as intended
    let codeAndLink: Node[] = [...fs.findNodes("code")];      // fs.findNodes("link") wouldn't work, since it returns the base name of its target Node
    expect(codeAndLink[0].getFullName().asString()).toBe(new StringName("/usr/bin/code", '/').asString());    // 1st element is the code File
    expect(codeAndLink[1].getFullName().asString()).toBe(new StringName("/usr/bin/code", '/').asString());    // 2nd element is the link to code File
  });
});


function createBuggySetup(): RootNode {
  let rn: RootNode = new RootNode();

  let usr: Directory = new Directory("usr", rn);
  let bin: Directory = new Directory("bin", usr);
  let ls: File = new BuggyFile("ls", bin);
  let code: File = new BuggyFile("code", bin);

  let media: Directory = new Directory("media", rn);

  let home: Directory = new Directory("home", rn);
  let riehle: Directory = new Directory("riehle", home);
  let bashrc: File = new BuggyFile(".bashrc", riehle);
  let wallpaper: File = new BuggyFile("wallpaper.jpg", riehle);
  let projects: Directory = new Directory("projects", riehle);

  return rn;
}

describe("Buggy setup test", () => {
  it("test finding files", () => {
    let threwException: boolean = false;
    try {
      let fs: RootNode = createBuggySetup();
      fs.findNodes("ls");
    } catch(er) {
      threwException = true;
      let ex: Exception = er as Exception;
      expect(ex).toBeInstanceOf(ServiceFailureException);
      expect(ex.hasTrigger()).toBe(true);
      let tx: Exception = ex.getTrigger();
      expect(tx).toBeInstanceOf(InvalidStateException);
    }
    expect(threwException).toBe(true);
  });
});
