from datetime import datetime
from Functions.clsFirestore import clsFirestore
from common.constant import clsConst as CONST
import logging
import pytz
import os
import json

# Firestoreアクセスオブジェクト作成
db = clsFirestore("Firestore1",account=CONST.ACCOUNT)

logging.basicConfig(level=CONST.LOG)
jst = pytz.timezone('Asia/Tokyo')

# 設定ファイルの読み込み
with open('SettingData.json', 'r', encoding="utf-8") as file:
    setting_base = json.load(file)


def main():
    try:
        COLLECTION = "setting"
        db.collection = COLLECTION
        # for result in setting_base:
        db.updDocument= {"values":setting_base}
        db.updateDocument("data")
    except Exception as e:
        logging.error("例外発生" + str(e))
    finally:
        logging.info(
            "終了時間:" + datetime.now(jst).strftime('%Y-%m-%d %H:%M:%S'))


def test():
    data = [
        {"id": 1, "value": 3, "item": 24},
        {"id": 1, "value": 5, "item": 9910000010},
        {"id": 1, "value": 6, "item": 9910000012},
        {"id": 1, "value": 7, "item": 112},
        {"id": 1, "value": 8, "item": 999},
        {"id": 2, "value": 13, "item": 24},
        {"id": 2, "value": 15, "item": 9910000010},
        {"id": 2, "value": 16, "item": 9910000012},
        {"id": 2, "value": 17, "item": 112},
        {"id": 2, "value": 18, "item": 999},
    ]

    # 検索キー
    search_keys = {102, 300013, 19, 9910000010, 9910000011, 108, 24, 27, 112}

    # id=1 かつ 検索キーに含まれる item の value を順番に取得
    matching_values = [entry["value"] for entry in data if entry["id"] == 2 and entry["item"] in search_keys]

    print(matching_values) 
main()