from google.cloud import firestore
from google.cloud import secretmanager
from datetime import datetime
from flask import Flask, jsonify, request
from Functions.clsDbAccSqlServer import clsDbAccSqlServer
from Functions.clsFirestore import clsFirestore
from common.constant import clsConst as CONST
import logging
import pytz
import signal
import os
import json

app = Flask(__name__, static_folder='.', static_url_path='')
app.config['JSON_AS_ASCII'] = False

# DB接続情報。最終的にはsecretから取得
coninfo = {
    "server":"10.3.28.93",
    "username":"KenshinView",
    "password":"iseikai",
    "database":"KENSHINV5",
    }

# SQLserverアクセスオブジェクト作成
obj = clsDbAccSqlServer("DBTrn1",coninfo)

# Firestoreアクセスオブジェクト作成
db = clsFirestore("Firestore1",account=CONST.ACCOUNT)

logging.basicConfig(level=CONST.LOG)
jst = pytz.timezone('Asia/Tokyo')

# 設定ファイルの読み込み
with open('guidanceSetting.json', 'r', encoding="utf-8") as file:
    guidance_base = json.load(file)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
    return response

# 患者IDの存在&検診日チェック
@app.route('/check', methods=["POST"])
def patientcheck():
    data = request.get_json()
    retDt = {
        "name":"",
        "course":"",
        "status":-1,
        "message":"",
    }
    try:
        DETAIL_INFO = "0010:患者情報取得処理"
        PROCESS_INFO = "処理開始_患者データ取得"
        obj.connectionChk()

        dy_now = datetime.now(jst).strftime('%Y%m%d')

        sql = """
                SELECT  
                    JS.JS_NO
                    ,JS.JS_CD 
                    ,JS.NAME 
                    ,YY.J_DATE
                    ,YY.CANCEL_DATE
                    ,CS.CS_DSP_NM
                FROM JS 
                  INNER JOIN YY
                  ON  JS.JS_NO  = YY.JS_NO
                LEFT JOIN CS
                  ON YY.CS_NO = CS.CS_NO
                WHERE
                  JS_CD = ?
            """
        parameters = ["00" + data["patientNo"]]
        status,results = obj.sqlServerDataGet(sql, PROCESS_INFO, parameters)
        if status["STS"] < 0 or status["COUNT"] == 0:
            retDt["message"] = "患者IDが見つかりません"
            return
        for result in results:
            if result["J_DATE"] == dy_now and result["CANCEL_DATE"] is None:
                retDt["name"] = result["NAME"]
                retDt["course"] = result["CS_DSP_NM"]
                retDt["status"] = 0
                return
        retDt["message"] = "本日健診予定はありません"
    except Exception as e:
        retDt["message"] = "DBaccessエラー"
        logging.error(DETAIL_INFO + "にて例外発生" + str(e))
    finally:
        logging.info(
            PROCESS_INFO + "終了時間:" + datetime.now(jst).strftime('%Y-%m-%d %H:%M:%S'))
        return jsonify(retDt)

@app.route('/document', methods=["POST"])
def documentAdd():
    data = request.get_json()
    retDt = {
        "status":-1,
        "message":"",
    }
    try:
        DETAIL_INFO = "0010:処理"
        PROCESS_INFO = "患者情報登録処理"
        obj.connectionChk()
        sql = """
                SELECT  
                    JS.JS_NO
                    ,JS.JS_CD 
                    ,JS.NAME 
                    ,JS.KANA_NAME 
                    ,JS.SEX 
                    ,CASE 
                    WHEN JS.SEX = '1' THEN '男'
                    WHEN JS.SEX = '2' THEN '女'
                    ELSE '' 
                    END               AS  SEX
                    ,JS.BIRTH
			        ,DATEDIFF(YEAR, JS.BIRTH, YY.J_DATE) - 
			          CASE 
			          WHEN MONTH(YY.J_DATE) < MONTH(JS.BIRTH) 
			            OR (MONTH(YY.J_DATE) = MONTH(JS.BIRTH) AND DAY(YY.J_DATE) < DAY(JS.BIRTH)
			                )
			           THEN 1 
			           ELSE 0 
			        END AS AGE                    
                    ,YY.J_DATE
                    ,YY.CS_NO
                    ,CS.CS_DSP_NM
                    ,YY.UK_NO
                    ,YY.UK_DATETIME
                FROM JS 
                INNER JOIN YY
                ON  JS.JS_NO  = YY.JS_NO
                AND YY.J_DATE = ?
                AND YY.CANCEL_DATE IS NULL
                LEFT JOIN CS
                ON YY.CS_NO = CS.CS_NO
            """
        COLLECTION = datetime.now().strftime("%Y%m%d")
        parameters = [COLLECTION]
        # 患者ID指定の場合
        if data["patientNo"]:
            sql += """
                    WHERE
                    JS_CD =( ? )
                """
            parameters.append("00" + data["patientNo"])

        status,results = obj.sqlServerDataGet(sql, PROCESS_INFO, parameters)
        if status["STS"] < 0:
            retDt["message"] = "データが取得出来ませんでした"
            return
        wkinfo = ["妊娠の疑いあり"]
        wkinfo.append("アレルギー情報/じんましん、花粉症、化粧品、青魚")
        wkinfo.append("身体情報/インプラントあり（2024.3MRI対応可）眉毛アートメイクあり（2024.3MRI対応可）")
        for result in results:
            date_obj = datetime.strptime(result["BIRTH"], "%Y%m%d") 
            patient_no = result["JS_CD"][2:] 
            # 定数
            db.collection = COLLECTION
            db.updDocument= {
                'name': result["NAME"],
                'kana': result["KANA_NAME"],
                'kancd': patient_no,
                'email': data["email"],
                'birthDate':date_obj.strftime("%Y/%m/%d"),
                'age':result["AGE"],
                'sex':result["SEX"],
                'courseNm':result["CS_DSP_NM"],
                'data': guidance_base,
                'memo': "",
                'info': wkinfo,
                'suspend': ""
            }
            db.updateDocument(patient_no)
            retDt["message"] = "正常終了"
            retDt["status"] = 0
    except Exception as e:
        retDt["message"] = "例外発生"
        logging.error(DETAIL_INFO + "にて例外発生" + str(e))
    finally:
        logging.info(
            PROCESS_INFO + "終了時間:" + datetime.now(jst).strftime('%Y-%m-%d %H:%M:%S'))
        return jsonify(retDt), 200

@app.route('/', methods=["GET"])
def conchk():
    return "OK", 200

# シャットダウン時の処理
def shutdown_hook(signum, frame):
    del obj
    del db
    logging.debug("Shutting down gracefully...")

# シャットダウンイベントの検知
signal.signal(signal.SIGTERM, shutdown_hook)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
