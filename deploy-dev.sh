cd webserver 
cd teasy-server0
sudo git pull origin dev
pm2 stop 0 1
pm2 restart 0 1