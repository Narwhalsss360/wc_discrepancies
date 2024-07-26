from os.path import isfile
from config import Config


def mkcfg():
    if isfile('config.json'):
        print('Configuration already exists.')
        return
    Config.generate_default().save()


if __name__ == '__main__':
    mkcfg()
