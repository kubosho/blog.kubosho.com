#!/bin/bash

set -euo pipefail

LOG_PREFIX="[gh-setup]"
GH_VERSION="2.83.2"
BIN_DIR="$HOME/.local/bin"

log() {
    echo "$LOG_PREFIX $*"
}

if [[ "${CLAUDE_CODE_REMOTE:-}" != "true" ]]; then
    log "Not running in remote environment, skipping gh setup"
    exit 0
fi

if command -v gh &>/dev/null; then
    log "gh command is already available ($(gh --version | head -n1))"
    exit 0
fi

log "CLAUDE_CODE_REMOTE is true, setting up GitHub CLI..."

mkdir -p "$BIN_DIR"

ARCH=$(uname -m)
case "$ARCH" in
    x86_64)
        GH_ARCH="amd64"
        ;;
    aarch64|arm64)
        GH_ARCH="arm64"
        ;;
    *)
        log "Unsupported architecture: $ARCH"
        exit 1
        ;;
esac

OS=$(uname -s | tr '[:upper:]' '[:lower:]')
GH_TARBALL="gh_${GH_VERSION}_${OS}_${GH_ARCH}.tar.gz"
GH_URL="https://github.com/cli/cli/releases/download/v${GH_VERSION}/${GH_TARBALL}"

TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

log "Downloading GitHub CLI v${GH_VERSION}..."
curl -sL "$GH_URL" -o "$TEMP_DIR/$GH_TARBALL"

log "Extracting GitHub CLI..."
tar -xzf "$TEMP_DIR/$GH_TARBALL" -C "$TEMP_DIR"

log "Installing gh to $BIN_DIR..."
cp "$TEMP_DIR/gh_${GH_VERSION}_${OS}_${GH_ARCH}/bin/gh" "$BIN_DIR/gh"
chmod +x "$BIN_DIR/gh"

if [[ -n "${CLAUDE_ENV_FILE:-}" ]]; then
    log "Persisting PATH to CLAUDE_ENV_FILE..."
    echo "PATH=$BIN_DIR:\$PATH" >> "$CLAUDE_ENV_FILE"
fi

log "GitHub CLI installed successfully!"
log "gh version: $("$BIN_DIR/gh" --version | head -n1)"
