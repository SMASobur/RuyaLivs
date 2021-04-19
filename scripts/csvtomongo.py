# from pymongo import MongoClient
# import datetime
# cluster= MongoClient("mongodb+srv://tanim:abbatanim@clouddb.kzvmd.mongodb.net/abbatanim?retryWrites=true&w=majority")
# db= cluster["abbatanim"]
# collections=db["testdata"]
# post={"name":"Abba Tanim", "age":90, "profession":"Fullstack Developer Python and Javascript", "date": datetime.datetime.utcnow()}
# collections.insert_one(post)

from pymongo import MongoClient
import datetime
cluster= MongoClient("mongodb+srv://tanim:abbatanim@clouddb.kzvmd.mongodb.net/abbatanim?retryWrites=true&w=majority")
db= cluster["abbatanim"]
collections=db["testdata"]
post=[{"name":"Abba Tanim", "age":90, "profession":"Fullstack Developer Python and Javascript", "date": datetime.datetime.utcnow()},
        {"name":"Sobur", "age":15, "profession":"Fullstack Developer Python and Javascript", "date": datetime.datetime.utcnow()}
        ]
collections.insert_many(post)

