# Super puper MEVN stack backend
```
------------------------------------------------




Everything you want is on the other side of fear.



------------------------------------------------
```
## Deploying that shit

1. Copy project to the server via ftp and cd to it
2. Add .env file and configure it

```bash
JWT_ACCESS_KEY = ""
JWT_REFRESH_KEY = ""
JWT_ACCESS_LIFE = "1h"
JWT_REFRESH_LIFE = "7d"
TZ = 'Asia/Tashkent'
DB_CLEANUP_INTERVAL = "46656000000"
BONUS_PERCENTAGE = 0.01

MONGO_URL="mongodb://your_user:your_pass@mongodb:27017,mongodb2:27018/HospitalDB?replicaSet=rs0&authSource=admin"
MONGO_MANAGER_KEY = 'your key'
```

3. Generate key.txt using `setup.sh` just type `bash setup.sh`
4. Create a file `parol.txt` and store there your password for mongodb 
  - *Docker-compose will use it as a secret*
  - *You may delete secret and just hard-type password in the docker-compose.yml*

5. Install docker/docker-compose if not installed

5.2. Install certbot for Let's encrypt
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

5.3. Configure certbot
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo systemctl status certbot.timer # checks if cron job to auto update certificate is running
```

6. run `sudo docker-compose up -d` 
   - *-d here to run in the background*
7. Enter inside of mongodb container

```bash
sudo docker exec -it main-mongodb bash
```

8. Login to mongosh console
```bash
mongosh -u root -p your_pass --host localhost --port 27017 
```
- *your_pass here is that pass from parol.txt* \
- *sometimes primary table might be in the another instance of mongo if you already created replica set*

9. Go to admin table and create user for node to use
```bash
use admin
db.createUser({
  user: "your_user",
  pwd: "your_pass", 
  roles: [ { role: "readWrite", db: "HospitalDB" } ] 
})
```

10. Create initiate replica set
```bash
rs.initiate(
  {
    _id: "rs0",
    version: 1,
    members: [
      { _id: 0, host: "mongodb:27017" },
      { _id: 1, host: "mongodb2:27018" }
    ]
  }
)
```

**Note that values in all steps are related to each other!!!**