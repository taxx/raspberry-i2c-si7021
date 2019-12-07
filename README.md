# Reading a SI7021 sensor via I2C on pi.
Use node 8.x.
Never got it working with later node due to issues with "si7021-sensor" package.
Tested on a Raspberry PI 3B using raspbian buster.

## Configure the raspberry
Enable I2C in raspi-config tool.

Install node:
Details: https://github.com/nodesource/distributions
```bash
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt install -y nodejs npm
```

## How to run it:
Connect sensor to raspberry pi as follows:
  SDA on sensor to physical pin 3 on PI (SDA)
  SCL on sensor to physical pin 5 on PI (SCL)
  VCC on sensor to physical pin 1 on PI (3v3 power)
  GND on sensor to physical pin 6 on PI (Ground)


Create .env file with settings according to .env.sample.

Install the prerequisites:
```bash
# Run once
npm install
```

Start the solution:
```bash
node app.js
```

This is one way to launch it every boot using rc.local:
```bash
sudo nano /etc/rc.local
# Add this before the exit 0 statement.
# and replace [app-folder] with the folder you are using
su pi -c 'node /home/pi/[app-folder]/app.js   < /dev/null &'
```