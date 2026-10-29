{
  lib,
  runCommandLocal,
  pkgconf,
  openssl,
  protobuf,
  craneLib,
  makeBinaryWrapper,
  graphviz,
}: let
  lalrpopFilter = path: _type: builtins.match ".*\\.lalrpop$" path != null;
  protobufFilter = path: _type: builtins.match ".*\\.proto$" path != null;
  scmFilter = path: _type: builtins.match ".*\\.scm$" path != null;
  liquidFilter = path: _type: builtins.match ".*\\.liquid$" path != null;
  srcFilter = path: type:
    (lalrpopFilter path type)
    || (protobufFilter path type)
    || (scmFilter path type)
    || (liquidFilter path type)
    || (craneLib.filterCargoSources path type);

  commonArgs =
    {
      src = lib.cleanSourceWith {
        src = ../..;
        filter = srcFilter;
        name = "source";
      };

      nativeBuildInputs = [
        pkgconf
        protobuf
        makeBinaryWrapper
      ];

      buildInputs = [
        openssl
      ];

      cargoExtraArgs = "-p tools";
    }
    // craneLib.crateNameFromCargoToml {cargoToml = ../../tools/Cargo.toml;};
  cargoArtifacts = craneLib.buildDepsOnly commonArgs;
in
  craneLib.buildPackage (commonArgs
    // {
      inherit cargoArtifacts;

      postFixup = ''
        wrapProgram $out/bin/pipeline-server \
          --prefix PATH : ${lib.makeBinPath [graphviz]}
      '';
    })
