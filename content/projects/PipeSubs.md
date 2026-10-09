---
title: "PipeSubs - aplikacja Python"
client: "Self"
date: "2022-03-20"
img: "/assets/PipeSubs.png"
description: "Feed group manager for NewPipe."
tags:
  - "Python"
  - "dearPyGui"
  - "sqlite3"
---

# PipeSubs

Feed group manager for NewPipe.
![Subs](/assets/PipeSubs.png)

### binaries can be found [here](https://github.com/mateusz-kifner/PipeSubs/releases)

### manual installation

- Make venv with python `python3 -m venv env`
- Activate venv `source env/bin/activate`
- Install dependencies `pip install -r requirements.txt`
- Run app `python3 main.py`

### Full manual

- Open NewPipe app, import subscriptions
- Export database (Settings > Content > Export database)
- Send it to PC
- Extract files, you should have newpipe.db and newpipe.settings files
- Open PipeSubs and load newpipe.db
- In feed groups you can add/update/remove your groups
- In feed groups sub join you can remove subscription from group or start serting with button in right top corner
- When you are done repack your database as zip(make sure that files are at root of zip)
- Send it to Phone
- Import database (Settings > Content > Import database)

![Subs](/assets/PipeSubs2.png)
![Subs](/assets/PipeSubs3.png)
