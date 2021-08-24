const refreshLocalSdk = true;
const hugoBaseSdkPath = "content/bakkesmod_api/"
//------

const fs = require('fs');
const _ = require('lodash');
const child_process = require('child_process');
const nunjucks = require('nunjucks');
const xml2js = require('xml2js');

let timeStart = +(Date.now());
nunjucks.configure("sdk_content");

let pathsMap = {};
let foundDefs = {
    Enums: {},
    Constants: {},
    Classes: {},
    Structs: {},
};

let manualDescriptions = JSON.parse(fs.readFileSync("sdk-manual-descriptions.json", "utf8"));
function drillDescriptions(defs, manualDescLevel) {
    _.each(manualDescLevel, (v, k) => {
        if (_.isUndefined(defs[k])) {
            return
        }
        if (!_.isString(v)) {
            return drillDescriptions(defs[k], v)
        }
        if (v.length > 0) {
            defs[k]["Description"] = v;
        }
    });
}

function GitHubLinkFromLocalPath(localPath) {
    let substrdPath = localPath.substring(localPath.indexOf("/")+1);
    return "https://github.com/bakkesmodorg/BakkesModSDK/blob/master/" + substrdPath;
}

function xml2jsPromiseWrapper(string) {
    return xml2js.parseStringPromise(string);
}

async function getXmlFromString(string) {
    return await xml2jsPromiseWrapper(string);
}

async function main() {
    if (refreshLocalSdk) {
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

            let defObject = {
                ClassName: item.name[0],
                GitHubPath: sdkGithubLink,
                BaseClass: undefined,
            }

            if (item.$.kind === "class") {
                if (_.has(itemCompound, "basecompoundref")) {
                    defObject.BaseClass = itemCompound.basecompoundref[0]._;
                }

                defObject.Parents = ["Classes", ...sdkLocation],
                defObject.Fields = {};
                if (itemCompound.sectiondef) {
                    _.each(itemCompound.sectiondef[0].memberdef, member => {
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
                }
                foundDefs.Classes[item.name[0]] = defObject;
                pathsMap[item.name[0]] = [...foundDefs.Classes[item.name[0]].Parents, item.name[0]].join("/")
            } else if (item.$.kind === "struct") {

                defObject.Parents = ["Structs", ...sdkLocation],
                foundDefs.Structs[item.name[0]] = defObject;
                pathsMap[item.name[0]] = [...foundDefs.Structs[item.name[0]].Parents, item.name[0]].join("/")
            }
            resolve();
        }));
    });
    await Promise.all(allPromises);
    drillDescriptions(foundDefs, manualDescriptions);
    fs.writeFileSync("_bakkesmod_sdk_parsed_output.json", JSON.stringify(foundDefs));

    createHugoPages();
    cleanup();
}

function createHugoPages() {
    _.each(foundDefs, (defTop, defTopName) => {
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
            }
            content = content.replace(/\\{/g, "{").replace(/\\}/g, "}");
            fs.writeFileSync(fullPath + `/${itemName}.md`, content);
        });
    });
}

function cleanup() {
    fs.unlinkSync("Doxyfile_2");

    console.log(`\n\nGeneration successful! Took ${((+(Date.now())) - timeStart) / 1000}s\n\n`);
}

main();