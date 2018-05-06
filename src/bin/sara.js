#!/usr/bin/env node

let pkg = require("../../package.json");
require("commander")
    .version(pkg.version)
    .usage("<command> [options]")
    .command("c", "创建一个空组件/页面")
    .parse(process.argv);
