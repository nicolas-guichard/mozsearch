{
  lib,
  runCommandLocal,
  cmake,
  which,
  wasm-pack,
  wasm-snip,
  llvmPackages,
  binaryen,
  protobuf,
  buildWasmBindgenCli,
  fetchCrate,
  rustPlatform,
  craneLib,
}: let
  wasm-bindgen-cli = buildWasmBindgenCli rec {
    src = fetchCrate {
      pname = "wasm-bindgen-cli";
      version = "0.2.129";
      hash = "sha256-pcecKQd7E8Opw6bkFoE569epUi7gh5qpQF1e5PJY6V8=";
    };

    cargoDeps = rustPlatform.fetchCargoVendor {
      inherit src;
      inherit (src) pname version;
      hash = "sha256-vmUrWVU7kPJJxO5qIVeAkwQyWDELO1Z4Z5gitz2kco8=";
    };
  };
  subdir = "scripts/web-analyze/wasm-css-analyzer";

  lalrpopFilter = path: _type: builtins.match ".*\\.lalrpop$" path != null;
  protobufFilter = path: _type: builtins.match ".*\\.proto$" path != null;
  buildShFilter = path: _type: builtins.match ".*build\\.sh$" path != null;
  srcFilter = path: type:
    (lalrpopFilter path type) || (protobufFilter path type) || (buildShFilter path type) || (craneLib.filterCargoSources path type);

  commonArgs =
    {
      src = lib.cleanSourceWith {
        src = ../..;
        filter = srcFilter;
        name = "source";
      };

      CARGO_BUILD_TARGET = "wasm32-unknown-unknown";

      nativeBuildInputs = [
        cmake
        which
        wasm-pack
        wasm-snip
        binaryen
        wasm-bindgen-cli
        llvmPackages.bintools
        protobuf
      ];
    }
    // craneLib.crateNameFromCargoToml {cargoToml = ../../${subdir}/Cargo.toml;};

  cargoArtifacts = craneLib.buildDepsOnly commonArgs;
in
  craneLib.buildPackage (commonArgs
    // {
      inherit cargoArtifacts;

      preBuild = "cd ${subdir}";
      cargoBuildCommand = "HOME=$(pwd) ./build.sh";

      installPhaseCommand = ''
        mkdir -p $out/share/wasm-css-analyzer
        install -Dm644 out/* $out/share/wasm-css-analyzer
      '';

      doCheck = false;
    })
