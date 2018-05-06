#!/usr/bin/env node

let chalk = require("chalk");
let ora = require("ora");
let program = require("commander");
let downloadNpmPackage = require("download-npm-package");
let path = require("path");

let log = require("../log");

program.usage("<package-name> [target-path]");

/**
 * Help.
 */

program.on("--help", function() {
    log.tips("  Examples:");
    log.tips();
    log.tips(chalk.gray("    # 从npm registry安装相应包到本地"));
    log.tips("    $ sara i sarax ./");
    log.tips();
});
program.parse(process.argv);

/**
 * Padding
 */
log.tips();

let spinner = ora({
    text: "fetching package ...",
    color: "blue"
}).start();

process.on("exit", () => log.tips());

let targetPath = path.join(process.cwd(), program.args[1] || "./lib/npm") || process.cwd();
/**
 * List repos.
 */
downloadNpmPackage({
    arg: `${program.args[0]}@latest`,
    dir: targetPath
}).then(
    res => {
        spinner.text = chalk.green("fetching package success");
        spinner.succeed();
        log.tips();
    },
    err => {
        spinner.text = chalk.white(
            "waka cli:fetching templates list failed, error message as follows:"
        );
        spinner.fail();
        log.tips();
        log.error(err);
    }
);
