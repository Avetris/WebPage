# WebPage
WebPage done with DJango and MongoDB

Commando to renew CA:

docker run -it --rm -p 80:80 --name certbot \
         -v "/etc/letsencrypt:/etc/letsencrypt" \
         -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
         certbot/certbot certonly --standalone -d avtdev.tk -d www.avtdev.tk