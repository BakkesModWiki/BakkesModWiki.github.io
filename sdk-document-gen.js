const refreshLocalSdk = false;
//------

const fs = require('fs');
const _ = require('lodash');
const yaml = require('yaml');
const glob = require('glob');
const child_process = require('child_process');
const nunjucks = require('nunjucks');

let timeStart = +(Date.now());
nunjucks.configure("sdk_content");

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
function getLinenumberHash(input, index, additionalLineOffset) {
    additionalLineOffset = additionalLineOffset || 0;

    let lookAt = input.substring(0, index);
    lookAt = lookAt.replace(/\r?\n/g, "\n");
    return `#L${lookAt.split("\n").length+additionalLineOffset}`
}

if (refreshLocalSdk) {
    if (fs.existsSync("_bakkesmod_sdk")) {
        fs.rmdirSync("_bakkesmod_sdk", {
            recursive: true
        });
    }
    child_process.execSync("git clone https://github.com/bakkesmodorg/BakkesModSDK.git ./_bakkesmod_sdk");
}

let TagsToCreate = {};
let foundDefs = {
    Enums: {},
    Constants: {},
    Functions: {},
    Classes: {},
    Types: {},
};
const hugoBaseSdkPath = "content/bakkesmod_api/"
let docsSidebarArray = [];

let skipFiles = [
    "_bakkesmod_sdk/include/bakkesmod/wrappers/arraywrapper.h"
];

let files = glob.sync("_bakkesmod_sdk/include/bakkesmod/**/*.h");
_.each(files, file => {
    if (skipFiles.some(x => x === file)) {
        return;
    }
    console.log(file);

    let sdkGithubLink = file.substring(file.indexOf("/")+1);
    let sdkLocation = sdkGithubLink.split("/").slice(2) //For tags
    sdkLocation.pop();
    _.each(sdkLocation, (name, i) => {
        sdkLocation[i] = _.upperFirst(name);
    })
    sdkGithubLink = "https://github.com/bakkesmodorg/BakkesModSDK/blob/master/" + sdkGithubLink;

    const tokenRegexes = {
        defineConstants: {Rgx: /#define\s+(?<ConstName>\w+?)\s+?(?<ConstValue>[^\s].+?)\s*$/gm},
        enumOutter: {Rgx: /enum\s+(?<EnumName>\w+?)[\s\n]+{(?<EnumInner>[\s\S]+?)}/gm},
        enumInner: {Rgx: /^\s*?(?<EnumKey>\w+?)(?:\s*?=\s*?(?<EnumValue>(-)?\d+?))?\s*?(?:,)?\s*?$/gm},
        comments: {Rgx: /\/\/.+/gm},
        fieldParams: {Rgx: /^((?:(?<Keyword>\w+?)\s+?)?(?<Type>\w+?)\s+?(?<Variable>\w+?))$/gm},
        fieldDefinition: {Rgx: /^\s+(?<FieldType>.+)\s+(?<FieldName>\w+)\((?<FieldParams>.*)\);(?:\s+\/\/.*)?$/gm},
        wrapperClass: {Rgx: /class BAKKESMOD_PLUGIN_IMPORT (?<WrapperClass>\w+)(\s+:\s+public\s+(?<WrapperSuperClass>\S+))?[\s]+{/gm}
    };

    let r = fs.readFileSync(file, "utf8");
    r = r.replace(tokenRegexes.comments.Rgx, ""); //Comments don't matter for our generation purposes

    //-- Enums
    let enumMatches = [...r.matchAll(tokenRegexes.enumOutter.Rgx)];
    if (enumMatches.length > 0) {
        _.each(enumMatches, em => {
            let enumValues = [...em.groups.EnumInner.matchAll(tokenRegexes.enumInner.Rgx)];
            let enumValuesMap = {};
            _.each(enumValues, enumValue => {
                enumValuesMap[enumValue.groups.EnumKey] = _.isUndefined(enumValue.groups.EnumValue) ? "" : enumValue.groups.EnumValue;
            });
            foundDefs.Enums[em.groups.EnumName] = {
                EnumName: em.groups.EnumName,
                GitHubPath: sdkGithubLink + getLinenumberHash(r, em.index),
                Parents: ["Enums"],
                Values: enumValuesMap
            };
        });
    }

    //-- Constants
    let constantMatches = [...r.matchAll(tokenRegexes.defineConstants.Rgx)]
    if (constantMatches.length > 0) {
        _.each(constantMatches, cm => {
            foundDefs.Constants[cm.groups.ConstName] = {
                ConstantName: cm.groups.ConstName,
                GitHubPath: sdkGithubLink + getLinenumberHash(r, cm.index),
                Parents: ["Constants"],
                Value: cm.groups.ConstValue
            };
        });
    }

    //-- Classes
    let classMatches = [...r.matchAll(tokenRegexes.wrapperClass.Rgx)]
    if (classMatches.length > 0) {
        if (classMatches.length > 1) {
            throw new Error(`Found multiple classes defined in the same file: ${file}`);
        }

        let classDefinition = {
            ClassName: classMatches[0].groups.WrapperClass,
            GitHubPath: sdkGithubLink + getLinenumberHash(r, classMatches[0].index),
            SuperClass: classMatches[0].groups.WrapperSuperClass,
            Parents: ["Classes", ...sdkLocation],
            Fields: {}
        }

        let classFieldDefinitions = [...r.matchAll(tokenRegexes.fieldDefinition.Rgx)]
        _.each(classFieldDefinitions, cfd => {
            let fieldDefinition = {
                GitHubPath: sdkGithubLink + getLinenumberHash(r, cfd.index, 1),
                Type: cfd.groups.FieldType,
                Parameters: []
            };
            if (cfd.groups.FieldParams.length > 0) {
                let paramterMatches = [...cfd.groups.FieldParams.matchAll(tokenRegexes.fieldParams.Rgx)]
                _.each(paramterMatches, pm => {
                    fieldDefinition.Parameters.push({
                        Keyword: pm.groups.Keyword,
                        Type: pm.groups.Type,
                        Name: pm.groups.Variable
                    });
                });
            }
            classDefinition.Fields[cfd.groups.FieldName] = fieldDefinition;
        });

        foundDefs.Classes[classMatches[0].groups.WrapperClass] = classDefinition;
    }

    //-- Sidebar
    _.each(docsSidebarArray, arr => {
        let parentPath = []
        _.each(arr.parents, (parent, i) => {
            let currentPath = hugoBaseSdkPath + [...parentPath, parent].join("/");
            if (!fs.existsSync(currentPath)) {
                fs.mkdirSync(currentPath);
                fs.writeFileSync(currentPath + "/_index.md", "---\ngeekdocCollapseSection: true\nweight: 2\n---");
            }
            parentPath.push(parent);
        });
    });

});
drillDescriptions(foundDefs, manualDescriptions);
fs.writeFileSync("_bakkesmod_sdk_parsed_output.json", JSON.stringify(foundDefs));

//-- Generate pages
_.each(foundDefs, (defTop, defTopName) => {
    _.each(defTop, (itemData, itemName) => {
        let parentPath = [];
        let fullPath = "";
        _.each(itemData.Parents, (parent, i) => {
            parentPath.push(parent);
            let currentPath = hugoBaseSdkPath + [...parentPath].join("/");
            if (!fs.existsSync(currentPath)) {
                fs.mkdirSync(currentPath);
                fs.writeFileSync(currentPath + "/_index.md", "---\ngeekdocCollapseSection: true\nweight: 1\n---");
            }
            fullPath = currentPath;
        });

        let content = "";
        if (defTopName === "Enums") {
            content = nunjucks.render("enum.md", itemData);
        } else if (defTopName === "Constants") {
            content = nunjucks.render("constant.md", itemData);
        } else if (defTopName === "Classes") {
            console.log(JSON.stringify(itemData));
            content = nunjucks.render("class.md", itemData);
        }
        content = content.replace(/\\{/g, "{").replace(/\\}/g, "}");
        fs.writeFileSync(fullPath + `/${itemName}.md`, content);
    });
});

console.log(`Generation successful! Took ${((+(Date.now())) - timeStart) / 1000}s`);