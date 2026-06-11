# Deploy portfolio fixes to OVH hosting
# Usage: ./deploy-portfolio.sh [username] [password]
# Or set env vars: SFTP_USER, SFTP_PASS

#!/bin/bash
set -e

SRC_DIR="${1:-.}"
SFTP_HOST="ftp.cluster129.hosting.ovh.net"
SFTP_USER="${2:-$SFTP_USER}"
SFTP_PASS="${3:-$SFTP_PASS}"

if [ -z "$SFTP_USER" ] || [ -z "$SFTP_PASS" ]; then
    echo "Usage: $0 [src_dir] [username] [password]"
    echo "Or set SFTP_USER and SFTP_PASS environment variables"
    exit 1
fi

echo "=== Deploying portfolio fixes to OVH ==="
echo "Host: $SFTP_HOST"
echo "User: $SFTP_USER"

# Create SFTP batch script
BATCH=$(mktemp)
cat > "$BATCH" << EOF
cd www/
lcd $SRC_DIR
put index.html
put i18n.js
put sitemap.xml
put .htaccess
bye
EOF

# Deploy using sshpass (install if needed)
if command -v sshpass &> /dev/null; then
    echo "$SFTP_PASS" | sshpass -p "$SFTP_PASS" sftp -b "$BATCH" "$SFTP_USER@$SFTP_HOST"
else
    echo "sshpass not found. Installing..."
    sudo apt-get install -y sshpass
    echo "$SFTP_PASS" | sshpass -p "$SFTP_PASS" sftp -b "$BATCH" "$SFTP_USER@$SFTP_HOST"
fi

rm -f "$BATCH"
echo "=== Deployment complete ==="
