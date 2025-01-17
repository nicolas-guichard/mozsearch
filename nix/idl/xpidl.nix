{fetchurl}: let
  hashes = import ./hashes.nix;
in
  {
    buildPythonPackage,
    ply,
    six,
    python,
    ...
  }:
    buildPythonPackage {
      pname = "xpidl";
      version = "unstable";

      src = fetchurl {
        url = "https://hg.mozilla.org/mozilla-central/raw-file/${hashes.mozilla-central}/xpcom/idl-parser/xpidl/xpidl.py";
        hash = hashes.xpidl;
      };

      format = "other";

      dependencies = [
        ply
        six
      ];

      dontUnpack = true;

      installPhase = ''
        runHook preInstall

        mkdir -p "$out/lib/python${python.pythonVersion}/site-packages"
        cp $src "$out/lib/python${python.pythonVersion}/site-packages/xpidl.py"

        runHook postInstall
      '';
    }
