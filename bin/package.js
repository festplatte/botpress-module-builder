"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _child_process = require("child_process");

var _glob = _interopRequireDefault(require("glob"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _rimraf = _interopRequireDefault(require("rimraf"));

var _util = require("util");

var _log = require("./log");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const tar = require("tar");

const execAsync = (0, _util.promisify)(_child_process.exec);
let packageJson;

var _default = async argv => {
  const modulePath = _path.default.resolve(argv.path || process.cwd());

  const out = argv.out;
  packageJson = require(_path.default.join(modulePath, "package.json"));

  try {
    await installProductionDeps(modulePath);
    await zipFiles(modulePath, out);
  } catch (err) {
    return (0, _log.error)(`Error packaging module: ${err.message || ""} ${err.cmd || ""} ${err.stderr || ""}`);
  } finally {
    await cleanup(modulePath);
  }

  (0, _log.normal)("Package completed");
};

exports.default = _default;

const getTargetOSConfig = () => {
  if (process.argv.find(x => x.toLowerCase() === "--win32")) {
    return "win32";
  } else if (process.argv.find(x => x.toLowerCase() === "--linux")) {
    return "linux";
  } else {
    return "darwin";
  }
};

async function installProductionDeps(modulePath) {
  if (packageJson.dependencies) {
    (0, _log.debug)("Installing production modules...");
    const {
      stdout
    } = await execAsync(`cross-env npm_config_target_platform=${getTargetOSConfig()} && mv node_modules node_modules_temp && npm ci --production && mv node_modules node_production_modules && mv node_modules_temp node_modules`, {
      cwd: modulePath
    });
    (0, _log.debug)(stdout);
  } else {
    (0, _log.debug)("No production modules found, creating empty node_production_modules folder...");

    _fs.default.mkdirSync(_path.default.join(modulePath, "node_production_modules"));
  }
}

async function cleanup(modulePath) {
  (0, _log.debug)("Cleaning up temporary files...");

  _rimraf.default.sync(_path.default.join(modulePath, "node_production_modules"));
}

async function zipFiles(modulePath, outPath) {
  outPath = outPath.replace(/%name%/gi, packageJson.name.replace(/[^\w-]/gi, "_"));
  outPath = outPath.replace(/%version%/gi, packageJson.version.replace(/[^\w-]/gi, "_"));

  if (!_path.default.isAbsolute(outPath)) {
    outPath = _path.default.join(modulePath, outPath);
  }

  (0, _log.debug)(`Writing to "${outPath}"`);

  const files = _glob.default.sync("**/*", {
    cwd: modulePath,
    nodir: true,
    dot: true,
    ignore: ["node_modules/**", "src/**"]
  });

  (0, _log.debug)(`Zipping ${files.length} file${files.length === 1 ? "" : "s"}...`);
  await tar.create({
    gzip: true,
    follow: true,
    file: outPath,
    portable: true
  }, files);
}