/**
 * Created by pomy on 16/01/2017.
 * some utils function
 */

"use strict";

let fs = require("fs");
let path = require("path");
let exec = require("child_process").execSync;

let log = require("./log");

module.exports = {
    isExist(tplPath) {
        let p = path.normalize(tplPath);
        try {
            fs.accessSync(p, fs.R_OK & fs.W_OK, err => {
                if (err) {
                    log.tips();
                    log.error(`Permission Denied to access ${p}`);
                }
            });
            return true;
        } catch (e) {
            return false;
        }
    },

    isLocalTemplate(tpl) {
        let isLocal = tpl.startsWith(".") || tpl.startsWith("/") || /^\w:/.test(tpl);

        if (isLocal) {
            return isLocal;
        } else {
            return this.isExist(path.normalize(path.join(process.cwd(), tpl)));
        }
    },

    saraBinPath() {
        try {
            let binPath = exec("which sara");
            return binPath.toString();
        } catch (e) {
            log.error(`exec which sara error: ${e.message}`);
        }
    }
};
