from google.cloud import firestore
from google.oauth2 import service_account
from common.constant import clsConst as CONST
import logging

class clsFirestore: 
    def __init__(self,lognm,account=None):
        try:
            self._collection = ""
            self._docList = ""
            self._document = ""
            self._updDocument = ""
            self.logger = logging.getLogger(lognm)

            #接続設定
            if account == None:
                self.db = firestore.Client()
            else:        
                credentials = service_account.Credentials.from_service_account_file(account)
                self.db = firestore.Client(credentials=credentials)

            self.logger.debug("Firestore接続")

        except Exception as e:
            self.logger.error("Firestore接続エラー: %s", e)
            raise e

    #コレクションからドキュメントの一覧を取得する
    def getDocumentList(self):
        self._docList =  self.db.collection(self._collection).stream()

    #コレクションにdocumentが存在するかチェック
    def checkDocumentExists(self, document_id):

        doc = self.getDocument(document_id)

        # ドキュメントが存在するかチェック
        if doc.exists:
            self.logger.debug(f"ドキュメント有({document_id})")
            return True
        else:
            self.logger.debug(f"ドキュメント無({document_id})")
            return False

    #documentを取得
    def getDocument(self, document_id):

        doc_ref = self.db.collection(self._collection).document(document_id)
        doc = doc_ref.get()
        self._document = doc.to_dict()
        return  doc

    #全てのdocumentを取得
    def getAllDocument(self):
        docs = self.db.collection(self._collection).stream()
        result = [{"id": doc.id, "data": doc.to_dict()} for doc in docs]        
        return  result

    #documentを追加or更新
    def updateDocument(self, document_id):
        if document_id == "":
            self.db.collection(self._collection).add(self._updDocument)
        else:
            self.db.collection(self._collection).document(document_id).set(self._updDocument, merge=True)

    #コレクション(プロパティ) 
    @property
    def collection(self):
        return self._collection
    @collection.setter
    def collection(self, new_value):
        self._collection = new_value

    #ドキュメントリスト(プロパティ) 
    @property
    def docList(self):
        return self._docList

    #ドキュメント(プロパティ) 
    @property
    def document(self):
        return self._document

    #更新データ(プロパティ) 
    @property
    def updDocument(self):
        return self._updDocument
    @updDocument.setter
    def updDocument(self, new_value):
        self._updDocument = new_value


    