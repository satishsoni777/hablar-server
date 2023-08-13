cd webserver 
cd hablar-server
sudo git pull origin dev
pm2 stop 0 1
pm2 start server
pm2 restart 0 1