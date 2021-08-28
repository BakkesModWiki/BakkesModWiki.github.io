const refreshLocalSdk = true;
const hugoBaseSdkPath = "content/bakkesmod_api/"
const cachedSdk = false;
//------

const fs = require('fs');
const _ = require('lodash');
const child_process = require('child_process');
const nunjucks = require('nunjucks');
const xml2js = require('xml2js');

let timeStart = +(Date.now());
nunjucks.configure("sdk_content");

let excludeConstants = ["BAKKESMOD_PLUGIN", "BAKKESMOD_PLUGIN_EXPORT", "BAKKESMOD_PLUGIN_IMPORT", "BAKKESMOD_STANDARD_PLUGIN_STUFF", "CONSTRUCTORS", "PIMPL",
    "GETH", "GETSETH"];
let pathMapLocalReferenceBase = "/bakkesmod_api/"
let pathsMap = {
    "std::string": "https://www.cplusplus.com/reference/string/string/",
    "void": "https://en.cppreference.com/w/cpp/language/types#Void_type",
    "float": "https://en.cppreference.com/w/cpp/language/types#Floating-point_types",
    "double": "https://en.cppreference.com/w/cpp/language/types#Floating-point_types",
    "long double": "https://en.cppreference.com/w/cpp/language/types#Floating-point_types",
    "bool": "https://en.cppreference.com/w/cpp/language/types#Boolean_type",
    "char": "https://en.cppreference.com/w/cpp/language/types#Character_types",
    "signed char": "https://en.cppreference.com/w/cpp/language/types#Character_types",
    "unsigned char": "https://en.cppreference.com/w/cpp/language/types#Character_types",
    "short": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "short int": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "signed short": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "signed short int": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "unsigned short": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "unsigned short int": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "int": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "signed": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "signed int": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "unsigned": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "unsigned int": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "long": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "long int": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "signed long": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "signed long int": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "unsigned long": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "unsigned long int": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "long long": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "long long int": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "signed long long": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "signed long long int": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "unsigned long long": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "unsigned long long int": "https://en.cppreference.com/w/cpp/language/types#Signed_and_unsigned_integer_types",
    "size_t": "https://en.cppreference.com/w/cpp/types/size_t",
    "std::unique_ptr< Impl >": "https://en.cppreference.com/w/cpp/memory/unique_ptr",
    "void *": "https://stackoverflow.com/a/31260836",
    "std::wstring": "https://www.cplusplus.com/reference/string/wstring/",
    "T": "https://www.cplusplus.com/doc/tutorial/functions2/#templates"
};
let foundDefs = {
    Enums: {},
    Constants: {},
    Classes: {},
    Structs: {},
};

let manualDescriptions = JSON.parse(fs.readFileSync("sdk-manual-descriptions.json", "utf8"));
let descriptionsAdded = 0;
function drillDescriptions(defs, manualDescLevel) {
    _.each(manualDescLevel, (v, k) => {
        if (k === "Description") {
            defs["Description"] = v;
            descriptionsAdded++;
            return;
        }
        if (_.isUndefined(defs[k])) {
            return;
        }
        if (!_.isString(v)) {
            return drillDescriptions(defs[k], v)
        }
        if (v.length > 0) {
            defs[k]["Description"] = v;
            descriptionsAdded++;
        }
    });
}

function GitHubLinkFromLocalPath(localPath) {
    let substrdPath = localPath.substring(localPath.indexOf("/")+1);
    return "https://github.com/bakkesmodorg/BakkesModSDK/blob/master/" + substrdPath;
}

function findXmlObjectById(obj, id) {
    let foundObject = false;

    _.each(obj, o => {
        if (foundObject) return;
        foundObject = o.$ ? (o.$.id === id ? o : false) : false;
        if (foundObject) return;

        if (_.isObjectLike(o)) {
            foundObject = findXmlObjectById(o, id);
        }
    });
    return foundObject;
}

function xml2jsPromiseWrapper(string) {
    return xml2js.parseStringPromise(string);
}

async function getXmlFromString(string) {
    return await xml2jsPromiseWrapper(string);
}

async function main() {
    if (refreshLocalSdk) {
        if (!cachedSdk) {
            if (fs.existsSync("_bakkesmod_sdk")) {
                fs.rmdirSync("_bakkesmod_sdk", {
                    recursive: true
                });
            }
            if (fs.existsSync("_doxygen")) {
                fs.rmdirSync("_doxygen", {
                    recursive: true
                });
            }
            child_process.execSync("git clone https://github.com/bakkesmodorg/BakkesModSDK.git ./_bakkesmod_sdk");
        }
        let doxyFile = fs.readFileSync("Doxyfile", "utf8");
        doxyFile = doxyFile.replace(/\{\{CURRENT_DIR\}\}/g, process.cwd());

        fs.writeFileSync("Doxyfile_2", doxyFile);
        if (process.platform === "win32") {
            child_process.execSync(`"C:\\Program Files\\doxygen\\bin\\doxygen.exe" Doxyfile_2`);
        } else {
            child_process.execSync(`./doxygen-1.9.2/bin/doxygen Doxyfile_2`);
        }
    }

    let doxygenIndex = await getXmlFromString(fs.readFileSync("_doxygen/xml/index.xml", "utf8"));
    let allPromises = [];
    _.each(doxygenIndex.doxygenindex.compound, item => {
        let disallowedFilenameCharsRe = /[<>:"/\\|?*]/; //https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file#naming-conventions
        if (!!item.name[0].match(disallowedFilenameCharsRe)) {
            return; // Soon-to-be File name contains illegal Windows path characters
        }

        allPromises.push(new Promise(async resolve => {
            let itemData = await getXmlFromString(fs.readFileSync(`_doxygen/xml/${item.$.refid}.xml`));
            let itemCompound = itemData.doxygen.compounddef[0];
            let sdkGithubLink = itemCompound.location[0].$.file.substring(itemCompound.location[0].$.file.indexOf("/")+1);
            let sdkLocation = sdkGithubLink.split("/").slice(2)
            sdkLocation.pop();
            _.each(sdkLocation, (name, i) => {
                sdkLocation[i] = _.upperFirst(name);
            })
            sdkGithubLink = "https://github.com/bakkesmodorg/BakkesModSDK/blob/master/" + sdkGithubLink;

            if (item.$.kind === "class") {
                let defObject = {
                    ClassName: item.name[0],
                    GitHubPath: sdkGithubLink,
                    BaseClass: undefined,
                }

                if (_.has(itemCompound, "basecompoundref")) {
                    defObject.BaseClass = itemCompound.basecompoundref[0]._;
                }

                defObject.Parents = ["Classes", ...sdkLocation],
                defObject.Fields = {};
                if (itemCompound.sectiondef) {
                    _.each(itemCompound.sectiondef, sectiondef => {
                        _.each(sectiondef.memberdef, member => {
                            let field = {
                                SpecialProperties: {
                                    Kind: member.$.kind,
                                    Protection: member.$.prot,
                                    isStatic: member.$.static === "yes",
                                    isConstan: member.$.const === "yes",
                                    isExplicit: member.$.explicit === "yes",
                                    isInline: member.$.inline === "yes",
                                    isVirtual: member.$.virt !== "non-virtual"
                                },
                                Type: _.isString(member.type[0]) ? member.type[0] : member.type[0].ref[0]._,
                                ArgsString: member.argsstring,
                                Name: member.name[0],
                                Params: [],
                                GitHubPath: GitHubLinkFromLocalPath(member.location[0].$.file) + `#L${member.location[0].$.line}`
                            };
                            _.each(member.param, param => {
                                let paramObj;
                                if (_.isString(param.type[0])) {
                                    paramObj = {
                                        Type: param.type[0],
                                        Name: _.isUndefined(param.declname) ? "" : param.declname[0]
                                    }
                                } else {
                                    paramObj = {
                                        Type: param.type[0].ref[0]._,
                                        TypeKeyword: _.has(param.type[0]._) && param.type[0]._ !== "&" ? param.type[0]._ : "",
                                        AmpersandAstrisk: _.has(param.type[0]._) && (param.type[0]._ === "&" || param.type[0]._ === "*") ? param.type[0]._ : "",
                                        Name: _.isUndefined(param.declname) ? "" : param.declname[0]
                                    }
                                }
                                field.Params.push(paramObj);
                            });
                            defObject.Fields[member.name[0]] = field;
                        });
                    })
                }
                foundDefs.Classes[item.name[0]] = defObject;
                pathsMap[item.name[0]] = pathMapLocalReferenceBase + [...foundDefs.Classes[item.name[0]].Parents, item.name[0]].join("/");
            } else if (item.$.kind === "struct") {
                let members = {};
                if (item.member) {
                    for (let i = 0; i < item.member.length; i++) {
                        let member = item.member[i];
                        if (member.$.kind === "variable") {
                            let memberXml = await getXmlFromString(fs.readFileSync(`_doxygen/xml/${item.$.refid}.xml`));
                            let foundObj = findXmlObjectById(memberXml, member.$.refid);
                            let memberObj = {
                                GitHubPath: GitHubLinkFromLocalPath(foundObj.location[0].$.file) + `#L${foundObj.location[0].$.line}`,
                                Kind: member.$.kind,
                                Type: _.isString(foundObj.type[0]) ? foundObj.type[0] : foundObj.type[0].ref[0]._,
                                Name: foundObj.name[0],
                                DefinitionString: foundObj.definition[0],
                                Value: foundObj.initializer ? foundObj.initializer[0].replace(/\s+?/g, " ") : "",
                            };
                            members[foundObj.name[0]] = memberObj;
                        } else if (member.$.kind === "enum") {
                            let memberXml = await getXmlFromString(fs.readFileSync(`_doxygen/xml/${item.$.refid}.xml`));
                            let foundObj = findXmlObjectById(memberXml, member.$.refid);
                            if (foundObj) { // Substring check due to some having no names https://github.com/bakkesmodorg/BakkesModSDK/blob/master/include/bakkesmod/plugin/bakkesmodsdk.h#L13
                                if (foundObj.name[0].substring(0, 1) !== "@") {
                                    let enumObj = {
                                        Name: foundObj.name[0],
                                        Kind: member.$.kind,
                                        GitHubPath: GitHubLinkFromLocalPath(foundObj.location[0].$.file) + `#L${foundObj.location[0].$.line}`,
                                        Values: {}
                                    }
                                    _.each(foundObj.enumvalue, ev => {
                                        enumObj.Values[ev.name[0]] = ev.initializer ? (ev.initializer ? ev.initializer[0].replace(/\s+/g, " ") : "") : "";
                                    });
                                    members[foundObj.name[0]] = enumObj;
                                } else {
                                    console.warn("Enum has no name!", member);
                                }
                            }
                        } else if (member.$.kind === "enumvalue") {
                            // Skip because this will be captured inside "enum" members
                        } else {
                            console.log(`  - Struct member type has no defined output "${member.$.kind}": ${member.$.refid}`);
                        }
                    }
                }
                if (Object.keys(members).length > 0) {
                    let structObj = {
                        StructName: item.name[0],
                        GitHubPath:  GitHubLinkFromLocalPath(itemCompound.location[0].$.file) + `#L${itemCompound.location[0].$.line}`,
                        Members: members
                    };
                    structObj.Parents = ["Structs", ...sdkLocation],
                    foundDefs.Structs[item.name[0]] = structObj;
                    pathsMap[item.name[0]] = pathMapLocalReferenceBase + [...foundDefs.Structs[item.name[0]].Parents, item.name[0]].join("/");
                }
            } else if (item.$.kind === "file") {
                if (item.member) {
                    for (let i = 0; i < item.member.length; i++) {
                        let member = item.member[i];
                        if (member.$.kind === "enum") {
                            let memberXml = await getXmlFromString(fs.readFileSync(`_doxygen/xml/${item.$.refid}.xml`));
                            let foundObj = findXmlObjectById(memberXml, member.$.refid);
                            if (foundObj) { // Substring check due to some having no names https://github.com/bakkesmodorg/BakkesModSDK/blob/master/include/bakkesmod/plugin/bakkesmodsdk.h#L13
                                if (foundObj.name[0].substring(0, 1) !== "@") {
                                    let enumObj = {
                                        EnumName: foundObj.name[0],
                                        GitHubPath: GitHubLinkFromLocalPath(foundObj.location[0].$.file) + `#L${foundObj.location[0].$.line}`,
                                        Parents: ["Enums"],
                                        Values: {}
                                    }
                                    _.each(foundObj.enumvalue, ev => {
                                        enumObj.Values[ev.name[0]] = ev.initializer[0];
                                    });
                                    foundDefs.Enums[foundObj.name[0]] = enumObj;
                                } else {
                                    console.warn("Enum has no name!", member);
                                }
                            }
                        } else if (member.$.kind === "define") {
                            let memberXml = await getXmlFromString(fs.readFileSync(`_doxygen/xml/${item.$.refid}.xml`));
                            let foundObj = findXmlObjectById(memberXml, member.$.refid);
                            if (foundObj) {
                                if (foundObj.initializer) {
                                    let constObj = {
                                        ConstantName: foundObj.name[0],
                                        GitHubPath: GitHubLinkFromLocalPath(foundObj.location[0].$.file) + `#L${foundObj.location[0].$.line}`,
                                        Parents: ["Constants"],
                                        Value: foundObj.initializer[0]
                                    }
                                    if (!excludeConstants.includes(foundObj.name[0])) {
                                        foundDefs.Constants[foundObj.name[0]] = constObj;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            resolve();
        }));
    });
    await Promise.all(allPromises);
    drillDescriptions(foundDefs, manualDescriptions);
    console.log(`  - Added ${descriptionsAdded} descriptions to the metadata`);
    fs.writeFileSync("_bakkesmod_sdk_parsed_output.json", JSON.stringify(foundDefs));

    createHugoPages();
    cleanup();
}

function createHugoPages() {
    _.each(foundDefs, (defTop, defTopName) => {
        if (fs.existsSync(hugoBaseSdkPath + defTopName)) {
            fs.rmdirSync(hugoBaseSdkPath + defTopName, { recursive: true });
        }
        _.each(defTop, (itemData, itemName) => {
            let parentPath = [];
            let fullPath = "";
            _.each(itemData.Parents, (parent, i) => {
                parentPath.push(parent);
                let currentPath = hugoBaseSdkPath + [...parentPath].join("/");
                if (!fs.existsSync(currentPath)) {
                    fs.mkdirSync(currentPath);
                }
                fs.writeFileSync(currentPath + "/_index.md", "---\ngeekdocCollapseSection: true\nweight: 1\ngeekdocProtected: true\n---");
                fullPath = currentPath;
            });

            let content = "";
            itemData.PathMap = pathsMap;
            if (defTopName === "Enums") {
                content = nunjucks.render("enum.md", itemData);
            } else if (defTopName === "Constants") {
                content = nunjucks.render("constant.md", itemData);
            } else if (defTopName === "Classes") {
                content = nunjucks.render("class.md", itemData);
            } else if (defTopName === "Structs") {
                content = nunjucks.render("struct.md", itemData);
            }
            content = content.replace(/\\{/g, "{").replace(/\\}/g, "}");
            fs.writeFileSync(fullPath + `/${itemName}.md`, content);
        });
    });
}

function cleanup() {
    fs.unlinkSync("Doxyfile_2");
    if (!cachedSdk) {
        if (fs.existsSync("_bakkesmod_sdk")) {
            fs.rmdirSync("_bakkesmod_sdk", {
                recursive: true
            });
        }
        console.log("  - Removed downloaded SDK");
        // if (fs.existsSync("_doxygen")) {
        //     fs.rmdirSync("_doxygen", {
        //         recursive: true
        //     });
        // }
        console.log("  - Removed generated SDK XML from Doxygen");
    } else {
        console.log("  - Skipped removing sdk");
    }

    console.log(`\n\nGeneration successful! Took ${((+(Date.now())) - timeStart) / 1000}s\n\n`);
}

main();