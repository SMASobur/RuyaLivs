import requests
import time
import json
from pymongo import MongoClient
import datetime
cluster = MongoClient("mongodb+srv://tanim:abbatanim1@clouddb.kzvmd.mongodb.net/abbatanim?retryWrites=true&w=majority",
                      ssl=True, ssl_cert_reqs='CERT_NONE')
db = cluster["abbatanim"]
collections = db["testdata"]


def send_request():
    # Articles (GET https://api.fortnox.se/3/articles)

    try:
        r = requests.get(
            url="https://api.fortnox.se/3/articles?limit=500&filter=active",
            headers={
                "Access-Token": "873fb692-e1ba-48f7-8b83-4926f0adad98",
                "Client-Secret": "BJlw5IuY1p",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        )

        return r.content
    except requests.exceptions.RequestException as e:
        print('HTTP Request failed')


json_data = send_request()
json_object = json.loads(json_data)
json_formatted_str = json.dumps(json_object, indent=2)
encodeddata = json_formatted_str.replace(r"\u00e4", "ä").replace(
    r"\u00f6", "ö").replace(r"\u00e5", "å")
y = json.loads(encodeddata)

for i in y["Articles"]:
    print("Article:", i['ArticleNumber'])
    print('Description: ', i['Description'])
    print("Being inserted to DB...")
    post = {"Article": i['ArticleNumber'],
            "Description": i['Description'], "SalesPrice": i['SalesPrice']}
    collections.insert_one(post)
    print("done.............")
    time.sleep(1)
