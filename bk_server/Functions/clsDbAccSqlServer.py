# DBアクセスクラスSqlServer
# pip install pyodbc
import pyodbc
import logging
import pytz
from datetime import datetime
import time
class clsDbAccSqlServer: 
    connection = None
    pyodbc.pooling = True
    jst = pytz.timezone('Asia/Tokyo')

    # コネクションのリトライ回数
    # RETRY_CNT・・・コネクション/データ取得のリトライ回数
    # RETRY_CNT2・・・コネクションチェックのリトライ回数
    RETRY_CNT = 5
    RETRY_CNT2 = 3
    # 返り値
    STS_NORMAL = {"STS":0,"MES":"正常","COUNT":0}      
    STS_ERROR = {"STS":-1,"MES":"エラー"}      
    #コンストラクタ 
    def __init__(self,_lognm,_coninf):
        try:
            self.logger = logging.getLogger(_lognm)
            self.conectinf = _coninf
            self.sqlServerconnect()
        except Exception as e:
            raise Exception

    #デストラクタ
    def __del__(self):
        self.close() 

    #コネクションclose
    def close(self):
        if self.connection:
            try:
                self.connection.close()
                self.logger.info("コネクションを正常に閉じました")
            except Exception as e:
                self.logger.error("クローズエラー: %s", e)
        else:
            self.logger.debug("コネクション未Open")

    # コネクション
    def sqlServerconnect(self):
        for idx in range(1, self.RETRY_CNT):
            try:
                self.connection = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=' +
                    self.conectinf["server"]+';DATABASE='+self.conectinf["database"]+';ENCRYPT=no;UID='+self.conectinf["username"] +';PWD=' + self.conectinf["password"])
                self.logger.info(
                    f"コネクション{idx}回目で接続完了:" + datetime.now(self.jst).strftime('%Y-%m-%d %H:%M:%S'))
                break
            except Exception as e:
                self.logger.error(
                    f"コネクションエラー{idx}回目" + str(e))
                time.sleep(5)
                if idx == self.RETRY_CNT:
                    raise Exception


    # コネクションチェック
    def connectionChk(self):
        for idx in range(1, self.RETRY_CNT2):
            try:
                try:
                    with self.connection.cursor() as cursor:
                        cursor.execute(
                            "SELECT COUNT(JS_CD) FROM JS WHERE JS_CD = '99999999'")
                    self.logger.info(
                        f"コネクションチェックOK")
                    return True
                except Exception as e:
                    self.logger.error(
                        f"コネクションチェック{idx}回目でエラー発生" + str(e))
                    time.sleep(5)
                    self.sqlServerconnect()
            except Exception as e:
                return False

    def sqlServerDataGet(self, _sql, _info,_parm=None):
        # エラー時にはretry回数だけ再度処理を行う
        for idx in range(1, self.RETRY_CNT):
            try:
                self.logger.info(_info + "_Start:" +
                            datetime.now(self.jst).strftime('%Y-%m-%d %H:%M:%S'))
                self.logger.debug(_sql)
                self.logger.debug(_parm)
                with self.connection.cursor() as cursor:
                    if _parm:
                        cursor.execute(_sql,_parm)
                    else:
                        cursor.execute(_sql)

                    self.logger.info(_info + "_End:" +
                                datetime.now(self.jst).strftime('%Y-%m-%d %H:%M:%S'))
                    columns = [column[0] for column in cursor.description]
                    rows = cursor.fetchall()
                # データを辞書形式に変換
                results = []
                for row in rows:
                    result = {}
                    for i in range(len(columns)):
                        result[columns[i]] = row[i]
                    results.append(result)
                self.STS_NORMAL["COUNT"] = len(results)

                return self.STS_NORMAL,results
            except Exception as e:
                self.logger.error("SELECTエラー: %s", e)
                self.logger.error("SQL: %s  PARM:%s", _sql,_parm)
                self.logger.error(
                    f"{_info}のSQLserverデータ取得でエラー発生{idx}回目" + str(e))
                time.sleep(5)
        return self.STS_ERROR,[]
