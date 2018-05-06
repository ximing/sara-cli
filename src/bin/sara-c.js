#!/usr/bin/env node

let program = require("commander");
let chalk = require("chalk");
let inquirer = require("inquirer");
let path = require("path");
let fs = require("fs");
let fse = require("fs-extra");
let request = require("request");

let log = require("../log");
let utils = require("../utils");
/**
 * Usage.
 */

program
    .usage("[template-path] -p [页面名称] -c [组件名称]")
    .option("-c, --component [value]", "组件名称", null)
    .option("-p, --page [value]", "页面名称", null);

program.on("--help", function() {
    log.tips("  Examples:");
    log.tips();
    log.tips(chalk.gray("    # 创建组件"));
    log.tips("    $ sara c ./ -c component1");
    log.tips(chalk.gray("    # 创建页面"));
    log.tips("    $ sara c ./ -p page1");
    log.tips();
});

program.parse(process.argv);

if (!program.page && !program.component) {
    log.error("need page or component");
    program.help();
    process.exit(1);
}

/**
 * Padding.
 */

log.tips();
process.on("exit", () => log.tips());

let templateDirName = program.args[0];
let page = program.page;
let component = program.component;

function getTemplateDirName(type) {
    if (!templateDirName) {
        let parentDirName = process
            .cwd()
            .split("/")
            .pop();
        if (type) {
            if (parentDirName === "src") return `./${type}s`;
            else if (fs.existsSync(path.join(process.cwd(), "src"))) {
                //在根目录
                return `./src/${type}s`;
            }
        }
        return ".";
    }
    return templateDirName;
}

runTask();

function runTask() {
    if (page) {
        let pagePath = path.join(__dirname, "../tpl/page");
        let templateDestDirPath = path.join(process.cwd(), getTemplateDirName("page"), page);
        copyFiles(pagePath, templateDestDirPath, page);
    }
    if (component) {
        let componentPage = path.join(__dirname, "../tpl/component");
        let templateDestDirPath = path.join(
            process.cwd(),
            getTemplateDirName("component"),
            component
        );
        copyFiles(componentPage, templateDestDirPath, component);
    }
}
function copyFiles(tplPath, destPath, name) {
    if (utils.isExist(destPath)) {
        inquirer
            .prompt([
                {
                    type: "confirm",
                    message:
                        templateDirName === "."
                            ? "Generate template in current directory?"
                            : "Target directory exists. Continue?",
                    name: "ok"
                }
            ])
            .then(answers => {
                if (answers.ok) {
                    log.tips();
                    doCopy(tplPath, destPath, name);
                }
            });
    } else {
        doCopy(tplPath, destPath, name);
    }
}
function doCopy(tplPath, destPath, name) {
    fse.ensureDirSync(destPath);
    fs.readdirSync(tplPath).forEach(file => {
        let targetFilePath = path.join(tplPath, file);
        let destFilePath = path.join(destPath, `${name}${path.extname(targetFilePath)}`);
        log.tips(`创建: ${destFilePath}`);
        fs.copyFileSync(targetFilePath, destFilePath);
    });
}
