openssl rand -base64 756 > ${PWD}/key.txt
chmod 0400 ${PWD}/key.txt
chown 999:999 ${PWD}/key.txt