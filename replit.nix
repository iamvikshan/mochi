{ pkgs }: {
	deps = [
		pkgs.ffmpeg.bin
		pkgs.bun
        pkgs.nodePackages.typescript-language-server
        pkgs.replitPackages.jest
	];
}