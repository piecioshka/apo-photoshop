// Buduje paczki aplikacji na macOS (Apple silicon i Intel), Windows i Linux
// przez nw-builder, a potem pakuje każdą do archiwum w `dist/`.
//
// Użycie: `npm run build` (wszystkie platformy) albo
// `npm run build -- osx-arm64` (wybrane cele, rozdzielone spacją).

import { execFileSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import nwbuild from "nw-builder";

const NW_VERSION = "0.117.0";
const APP_NAME = "APO Photoshop";
const ARTIFACT_NAME = "APO-Photoshop";

const TARGETS = [
  { id: "osx-arm64", platform: "osx", arch: "arm64", label: "mac-arm64" },
  { id: "osx-x64", platform: "osx", arch: "x64", label: "mac-x64" },
  { id: "win-x64", platform: "win", arch: "x64", label: "win-x64" },
  { id: "linux-x64", platform: "linux", arch: "x64", label: "linux-x64" },
];

const root = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(
  readFileSync(path.join(root, "package.json"), "utf8"),
);
const stageDir = path.join(root, "tmp", "stage");
const buildDir = path.join(root, "tmp", "build");
const distDir = path.join(root, "dist");
const cacheDir = path.join(root, "cache");

const requested = process.argv.slice(2);
const targets =
  requested.length > 0
    ? TARGETS.filter((target) => requested.includes(target.id))
    : TARGETS;

if (targets.length === 0) {
  console.error(
    `Nieznany cel. Dostępne: ${TARGETS.map((t) => t.id).join(", ")}`,
  );
  process.exit(1);
}

// Do paczki trafia tylko kod aplikacji i manifest NW.js (bez zależności
// deweloperskich i skryptów), żeby nie wozić `pictures/`, testów ani
// `node_modules/`.
function stage() {
  rmSync(stageDir, { recursive: true, force: true });
  mkdirSync(stageDir, { recursive: true });
  cpSync(path.join(root, "app"), path.join(stageDir, "app"), {
    recursive: true,
  });
  const { devDependencies, scripts, ...runtimeManifest } = manifest;
  writeFileSync(
    path.join(stageDir, "package.json"),
    `${JSON.stringify(runtimeManifest, null, 4)}\n`,
  );
}

function appOptions(target) {
  const common = { name: APP_NAME, version: manifest.version };
  if (target.platform === "osx") {
    return {
      ...common,
      icon: path.join(root, "icons", "app-icon.icns"),
      LSApplicationCategoryType: "public.app-category.graphics-design",
      CFBundleIdentifier: "pl.piecioshka.apo-photoshop",
      CFBundleName: APP_NAME,
      CFBundleDisplayName: APP_NAME,
      CFBundleSpokenName: APP_NAME,
      CFBundleShortVersionString: manifest.version,
      CFBundleVersion: manifest.version,
      NSHumanReadableCopyright:
        "Copyright © 2014 Piotr Kowalski, Krzysztof Snopkiewicz",
    };
  }
  if (target.platform === "win") {
    return {
      ...common,
      icon: path.join(root, "icons", "app-icon.ico"),
      company: "Piotr Kowalski",
      fileDescription: APP_NAME,
      fileVersion: manifest.version,
      internalName: manifest.name,
      originalFilename: `${APP_NAME}.exe`,
      productName: APP_NAME,
      productVersion: manifest.version,
      legalCopyright: "Copyright © 2014 Piotr Kowalski, Krzysztof Snopkiewicz",
    };
  }
  return {
    ...common,
    genericName: "Image processing",
    comment: "Algorytmy przetwarzania obrazów",
    icon: path.join(root, "icons", "app-icon.png"),
    categories: ["Graphics"],
  };
}

// Paczka NW.js po podmianie plików ma zepsuty podpis, a macOS na Apple
// silicon pokazuje wtedy „aplikacja jest uszkodzona”. Podpis ad hoc
// zostawia tylko zwykłe ostrzeżenie o niezweryfikowanym deweloperze.
function signMacApp(appPath) {
  execFileSync("codesign", ["--force", "--deep", "--sign", "-", appPath], {
    stdio: "inherit",
  });
  execFileSync(
    "codesign",
    ["--verify", "--deep", "--strict", "--verbose=2", appPath],
    {
      stdio: "inherit",
    },
  );
}

function archive(target, outDir) {
  const base = `${ARTIFACT_NAME}-${manifest.version}-${target.label}`;
  if (target.platform === "osx") {
    const appPath = path.join(outDir, `${APP_NAME}.app`);
    signMacApp(appPath);
    const zipPath = path.join(distDir, `${base}.zip`);
    execFileSync("ditto", [
      "-c",
      "-k",
      "--sequesterRsrc",
      "--keepParent",
      appPath,
      zipPath,
    ]);
    return zipPath;
  }
  const folder = path.join(buildDir, base);
  rmSync(folder, { recursive: true, force: true });
  cpSync(outDir, folder, { recursive: true, verbatimSymlinks: true });
  if (target.platform === "win") {
    const zipPath = path.join(distDir, `${base}.zip`);
    execFileSync("zip", ["-qry", zipPath, base], { cwd: buildDir });
    return zipPath;
  }
  // nw-builder zapisuje w pliku .desktop bezwzględne ścieżki z maszyny,
  // na której powstał build, więc u użytkownika i tak by nie zadziałał.
  rmSync(path.join(folder, `${APP_NAME}.desktop`), { force: true });
  const tarPath = path.join(distDir, `${base}.tar.gz`);
  execFileSync("tar", ["-czf", tarPath, base], { cwd: buildDir });
  return tarPath;
}

stage();
mkdirSync(distDir, { recursive: true });

for (const target of targets) {
  const outDir = path.join(buildDir, target.id);
  rmSync(outDir, { recursive: true, force: true });
  await nwbuild({
    mode: "build",
    version: NW_VERSION,
    flavor: "normal",
    platform: target.platform,
    arch: target.arch,
    srcDir: stageDir,
    glob: false,
    outDir,
    cacheDir,
    logLevel: "warn",
    app: appOptions(target),
  });
  console.log(`${target.id}: ${path.relative(root, archive(target, outDir))}`);
}
