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

isolateData = {}

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


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/document', methods=["GET"])
def documentAdd():
    # data = request.get_json()
    retDt = {
        "status":-1,
        "message":"",
    }
    try:
        DETAIL_INFO = "0010:処理"
        PROCESS_INFO = "患者情報登録処理"
        obj.connectionChk()
        sql = """
            SELECT DISTINCT
            YY.YY_NO 
            ,KNS.KNS_SBT_NO 
            ,'' AS  KNS_SSAI_WK_NM
            ,YY_KNS.KNS_STATE_KBN
            ,IsNull(KKA.KNS_STATUS,'0') AS KNS_STATUS
            ,KKA.CHK_DATETIME  
            ,'' AS   LAST_UPD_DATETIME
            ,KNS.KNS_SBT_DSP_NM 
            FROM YY
            INNER JOIN YY_KNS
            ON  YY.YY_NO  = YY_KNS.YY_NO
            INNER JOIN 
            (
                SELECT
                kns.KNS_CD 
                ,kns.KNS_DSP_NM  
                ,smei.KNS_NO
                ,sbt.KNS_SBT_NO 
                ,sbt.KNS_SBT_CD 
                ,sbt.KNS_SBT_DSP_NM 
                FROM  M_KNS kns
                INNER JOIN  M_KNS_SBT_MSAI smei
                ON  kns.KNS_NO = smei.KNS_NO
                INNER JOIN  M_KNS_SBT sbt
                ON  sbt.KNS_SBT_NO = smei.KNS_SBT_NO
            ) AS KNS
            ON  YY_KNS.KNS_NO  = KNS.KNS_NO
            LEFT OUTER JOIN 
            (
                SELECT 
                KNR.YY_NO
                ,KNR.KNS_DATE 
                ,MST.KNS_SBT_NO
                ,MST.KNS_SBT_CD 
                ,MST.KNS_SBT_DSP_NM 
                ,MST.KNS_PRG_KBN_NO 
                ,KNR_KBN.CHK_DATETIME
                ,KNR_KBN.KNS_STATUS 
                FROM PR_KNS_PRG AS KNR
                INNER JOIN PR_KNS_PRG_KBN AS KNR_KBN
                ON  KNR.YY_NO           = KNR_KBN.YY_NO
                AND KNR.KNS_DATE        = KNR_KBN.KNS_DATE 
                INNER JOIN 
                (
                    SELECT 
                    SBT.KNS_SBT_NO
                    ,SBT.KNS_SBT_CD 
                    ,SBT.KNS_SBT_DSP_NM 
                    ,KBN.KNS_PRG_KBN_NO 
                    ,KBN.KNS_PRG_KBN
                    ,KBN.KNS_PRG_KBN_CD
                    ,KBN.KNS_PRG_KBN_NM
                    FROM M_KNS_PRG_KBN AS KBN
                    LEFT OUTER JOIN M_KNS_SBT AS SBT
                    ON KBN.KNS_SBT_NO = SBT.KNS_SBT_NO  
                ) AS MST
                ON KNR_KBN.KNS_PRG_KBN_NO = MST.KNS_PRG_KBN_NO
            ) KKA
            ON  YY.YY_NO        = KKA.YY_NO 
            AND KNS.KNS_SBT_CD  = KKA.KNS_SBT_CD
            """
        COLLECTION = datetime.now().strftime("%Y%m%d")
        # 患者ID指定の場合
        if 1:
            sql += """
                    WHERE
                    YY.YY_NO =( ? )
                """
            parameters = [57393]

        status,results = obj.sqlServerDataGet(sql, PROCESS_INFO, parameters)
        if status["STS"] < 0:
            retDt["message"] = "データが取得出来ませんでした"
            return
        for target in isolateData: 
            logging.info("-----------------------------------------")    
            logging.info(target["key"])    
            matching_values = [{"status":entry["KNS_STATUS"],"NM":entry["KNS_SBT_DSP_NM"]} for entry in results if entry["YY_NO"] == 57393 and entry["KNS_SBT_NO"] in target["items"]]
            logging.info(matching_values)    


    except Exception as e:
        retDt["message"] = "例外発生"
        logging.error(DETAIL_INFO + "にて例外発生" + str(e))
    finally:
        logging.info(
            PROCESS_INFO + "終了時間:" + datetime.now(jst).strftime('%Y-%m-%d %H:%M:%S'))
        return jsonify(retDt), 200

# 基本情報更新
@app.route('/base', methods=["GET"])
def documentBase():
    retDt = {
        "status":-1,
        "message":"",
    }
    try:
        DETAIL_INFO = "0010:基本情報登録処理"
        PROCESS_INFO = "患者基本情報取得"
        obj.connectionChk()
        sql = """
            SELECT  
                JS.JS_CD 
                ,JS.NAME 
                ,JS.KANA_NAME 
                ,JS.SEX 
                ,JS.BIRTH
                ,JS.POST
                ,JS.ADRS1 + JS.ADRS2  AS ADRS 
                ,JS.TEL 
                ,JS.RENRAKU_TEL
                ,NULL                 AS HOKENSHA_NM
                ,NULL                 AS HOKENSHA_NO
                ,NULL                 AS HOKEN_KIGOU_NO
                ,NULL                 AS HOKEN_EDABAN
                ,MEMO1.JS_MEMO        AS JS_MEMO_ALI
                ,MEMO2.JS_MEMO        AS JS_MEMO_BI
                ,YY.YY_NO
                ,YY.UK_NO
                ,YY.J_DATE
                ,NULL                 AS MOU_DAN_NM
                ,CS.CS_DSP_NM         AS CS_NM
                ,NULL                 AS PLACE_NM
                ,NULL                 AS JS_LAST_UPD_DATETIME
                ,NULL                 AS KM_LAST_UPD_DATETIME
            FROM JS 
            INNER JOIN YY
            ON  JS.JS_NO  = YY.JS_NO
            AND YY.CANCEL_DATE IS NULL
            AND YY.J_DATE IN (
                CONVERT(VARCHAR(8), GETDATE(), 112),
                CONVERT(VARCHAR(8), DATEADD(DAY, 1, GETDATE()), 112),
                CONVERT(VARCHAR(8), DATEADD(DAY, 2, GETDATE()), 112)
            )  
            LEFT JOIN CS
            ON  YY.CS_NO = CS.CS_NO
            LEFT JOIN JS_MEMO AS MEMO1
            ON  JS.JS_NO    = MEMO1.JS_NO 
            AND MEMO1.MEMO_KBN_NO  = 300002
            LEFT JOIN JS_MEMO AS MEMO2
            ON  JS.JS_NO    = MEMO2.JS_NO 
            AND MEMO2.MEMO_KBN_NO  = 101
            """
        status,results = obj.sqlServerDataGet(sql, PROCESS_INFO)
        if status["STS"] < 0:
            retDt["message"] = "患者基本情報が取得出来ませんでした"
            return
        for result in results:
            wrtData = {
                "js_cd":result["JS_CD"],
                "patientId":result["JS_CD"][2:],
                "yy_no":int(result["YY_NO"]),
                "sex":result["SEX"],
                "name":result["NAME"],
                "kana":result["KANA_NAME"],
                "birthDate":result["BIRTH"],
                "courseNm":result["CS_NM"],
                "physical":result["JS_MEMO_ALI"],
                "pregnant":result["JS_MEMO_BI"],
                "upd_ymd_hms": datetime.now(jst).strftime('%Y-%m-%d %H:%M:%S'),
            }
            db.collection = result["J_DATE"]
            db.updDocument= wrtData
            db.updateDocument(result["JS_CD"])

        komoku(results)
        retDt["status"] = 0
    except Exception as e:
        retDt["message"] = DETAIL_INFO + "にて例外発生"
        logging.error(retDt["message"] + str(e))
    finally:
        logging.info(
            PROCESS_INFO + "終了時間:" + datetime.now(jst).strftime('%Y-%m-%d %H:%M:%S'))
        return jsonify(retDt), 200

def komoku(values):
    retDt = {
        "status":-1,
        "message":"",
    }
    try:
        DETAIL_INFO = "0020:検査情報更新処理"
        PROCESS_INFO = "患者検査情報取得"
        placeholders = ",".join(["?"] * len(values))
        sql = f"""
            SELECT DISTINCT
            YY.YY_NO 
            ,KNS.KNS_SBT_NO 
            ,'' AS  KNS_SSAI_WK_NM
            ,YY_KNS.KNS_STATE_KBN
            ,IsNull(KKA.KNS_STATUS,'0') AS KNS_STATUS
            ,KKA.CHK_DATETIME  
            ,'' AS   LAST_UPD_DATETIME
            ,KNS.KNS_SBT_DSP_NM 
            FROM YY
            INNER JOIN YY_KNS
            ON  YY.YY_NO  = YY_KNS.YY_NO
            INNER JOIN 
            (
                SELECT
                kns.KNS_CD 
                ,kns.KNS_DSP_NM  
                ,smei.KNS_NO
                ,sbt.KNS_SBT_NO 
                ,sbt.KNS_SBT_CD 
                ,sbt.KNS_SBT_DSP_NM 
                FROM  M_KNS kns
                INNER JOIN  M_KNS_SBT_MSAI smei
                ON  kns.KNS_NO = smei.KNS_NO
                INNER JOIN  M_KNS_SBT sbt
                ON  sbt.KNS_SBT_NO = smei.KNS_SBT_NO
            ) AS KNS
            ON  YY_KNS.KNS_NO  = KNS.KNS_NO
            LEFT OUTER JOIN 
            (
                SELECT 
                KNR.YY_NO
                ,KNR.KNS_DATE 
                ,MST.KNS_SBT_NO
                ,MST.KNS_SBT_CD 
                ,MST.KNS_SBT_DSP_NM 
                ,MST.KNS_PRG_KBN_NO 
                ,KNR_KBN.CHK_DATETIME
                ,KNR_KBN.KNS_STATUS 
                FROM PR_KNS_PRG AS KNR
                INNER JOIN PR_KNS_PRG_KBN AS KNR_KBN
                ON  KNR.YY_NO           = KNR_KBN.YY_NO
                AND KNR.KNS_DATE        = KNR_KBN.KNS_DATE 
                INNER JOIN 
                (
                    SELECT 
                    SBT.KNS_SBT_NO
                    ,SBT.KNS_SBT_CD 
                    ,SBT.KNS_SBT_DSP_NM 
                    ,KBN.KNS_PRG_KBN_NO 
                    ,KBN.KNS_PRG_KBN
                    ,KBN.KNS_PRG_KBN_CD
                    ,KBN.KNS_PRG_KBN_NM
                    FROM M_KNS_PRG_KBN AS KBN
                    LEFT OUTER JOIN M_KNS_SBT AS SBT
                    ON KBN.KNS_SBT_NO = SBT.KNS_SBT_NO  
                ) AS MST
                ON KNR_KBN.KNS_PRG_KBN_NO = MST.KNS_PRG_KBN_NO
            ) KKA
            ON  YY.YY_NO        = KKA.YY_NO 
            AND KNS.KNS_SBT_CD  = KKA.KNS_SBT_CD
            WHERE YY.YY_NO IN({placeholders})
            ORDER BY  YY.YY_NO,KNS.KNS_SBT_NO 
            """
        params = [item["YY_NO"] for item in values]
        status,results = obj.sqlServerDataGet(sql, PROCESS_INFO,params)
        if status["STS"] < 0:
            retDt["message"] = "患者検査情報が取得出来ませんでした"
            return
        for value in values:
            wrtData = []
            for search_table in isolateData:
                matching_values = [{"KNS_STATE_KBN":entry["KNS_STATE_KBN"],"KNS_STATUS":entry["KNS_STATUS"]} for entry in results if entry["YY_NO"] == value["YY_NO"] and entry["KNS_SBT_NO"] in search_table["items"]]
                status = "X"
                for matching_value in matching_values:
                    if matching_value["KNS_STATE_KBN"] == "1":
                        if  matching_value["KNS_STATUS"] == "1":
                            if status == "X":
                                status = matching_value["KNS_STATUS"]
                        else:
                            status = matching_value["KNS_STATUS"]
                wrtData.append(
                    {"inpCd":search_table["inpCd"]
                    ,"name":search_table["name"]
                    ,"type":search_table["type"]
                    ,"dspOrder":search_table["dspOrder"]
                    ,"status":status
                    })
            db.collection = value["J_DATE"]
            db.updDocument= {"data":wrtData}
            db.updateDocument(value["JS_CD"])
            
    except Exception as e:
        retDt["message"] = DETAIL_INFO + "にて例外発生"
        logging.error(retDt["message"] + str(e))
    finally:
        logging.info(
            PROCESS_INFO + "終了時間:" + datetime.now(jst).strftime('%Y-%m-%d %H:%M:%S'))


# 初期データの読込直し
@app.route('/init', methods=["GET"])
def init():
    try:
        initialize()
    except Exception as e:
        logging.error("にて例外発生" + str(e))
    finally:
        return jsonify("OK"), 200

def initialize():
    try:
        global isolateData
        initdb = clsFirestore("Firestore1",account=CONST.ACCOUNT)
        initdb.collection = "setting"
        initdb.getDocument("data")
        isolateData = initdb.document["values"]
    except Exception as e:
        logging.error("にて例外発生" + str(e))
    finally:
        if initdb:
            del initdb

@app.route('/', methods=["GET"])
def conchk():
    return "OK", 200

# シャットダウン時の処理
def shutdown_hook(signum, frame):
    if obj:
        del obj
    if db:
        del db
    logging.debug("シャットダウン")

# シャットダウンイベントの検知
signal.signal(signal.SIGTERM, shutdown_hook)

# 初期データ取得
initialize()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
