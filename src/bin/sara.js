#!/usr/bin/env node

let pkg = require("../../package.json");
require("commander")
    .version(pkg.version)
    .usage("<command> [options]")
    .command("c", "创建一个空组件/页面")
    .command("i", "从npm registry安装相应包到本地")
    .parse(process.argv);
