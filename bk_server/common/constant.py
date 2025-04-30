import logging
class classMeta(type):
    def __setattr__(self, name, value):
        if name in self.__dict__:
            raise TypeError(f'定数を変更出来ません。 ({name})')

class clsConst(metaclass=classMeta):
    # True 本番用 False テスト用
    IS_PRODUCTION = False
    if IS_PRODUCTION:
        # 本番用設定
        LOG = logging.INFO
        ACCOUNT = None
    else:
        #テスト用設定 
        LOG = logging.DEBUG
        ACCOUNT = "medical-check-up-guide-cefec9f94d81.json"
    