{
  inputs = {
    nixpkgs.url = github:NixOS/nixpkgs/nixpkgs-unstable;
    flake-utils.url = github:numtide/flake-utils;
    fenix = {
      url = "github:nix-community/fenix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  nixConfig = {
    extra-substituters = ["https://nix-community.cachix.org"];
    extra-trusted-public-keys = ["nix-community.cachix.org-1:mB9FSh9qf2dCimDSUo8Zy7bkq5CX+/rkCWyvRCYg3Fs="];
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    fenix,
  }: (
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = nixpkgs.legacyPackages.${system}.extend fenix.overlays.default;

        rustToolchain = pkgs.fenix.stable.toolchain;


        pythonPackages = p:
          with p; [
            boto3
            rich
          ];
      in {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            jq

            (python3.withPackages pythonPackages)
            awscli2

            # Dependencies required to build tools
            rustToolchain
            openssl
            cmake
            pkg-config

            # Must be before (unwrapped) clang in path
            clang-tools_19

            # Dependencies required to build clang-plugin
            clang_19
            llvmPackages_19.libllvm
            llvmPackages_19.libclang

            gdb

            scip
            protobuf

            pre-commit
          ];

          PODMAN_USERNS = "keep-id";

          AWS_PROFILE = "searchfox";
        };

        formatter = pkgs.alejandra;
      }
    )
  );
}
