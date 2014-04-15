Just git clone to a directory, `npm install` and make sure you have mongodb installed. To make this work on Windows, delete the `bcrypt` dependency from `package.json` and  
```
npm install bcrypt-nodejs --save
```
from the command line. Make sure you change the bcrypt require statement in `models/user` and it will run fine.
