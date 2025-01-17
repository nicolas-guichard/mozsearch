{fetchurl}: let
  hashes = import ./hashes.nix;
in
  {
    buildPythonPackage,
    ply,
    python,
    ...
  }:
    buildPythonPackage {
      pname = "webidl";
      version = "unstable";

      src = fetchurl {
        url = "https://hg.mozilla.org/mozilla-central/raw-file/${hashes.mozilla-central}/dom/bindings/parser/WebIDL.py";
        hash = hashes.webidl;
      };

      format = "other";

      dependencies = [
        ply
      ];

      dontUnpack = true;

      installPhase = ''
        runHook preInstall

        mkdir -p "$out/lib/python${python.pythonVersion}/site-packages"
        cp $src "$out/lib/python${python.pythonVersion}/site-packages/WebIDL.py"

        runHook postInstall
      '';
    }
