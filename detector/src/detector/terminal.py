from sys import argv
from os.path import isfile
from typing import Callable
from datetime import datetime
from .config import Config
from .datatypes import Discrepancy
from .detection import detect_all_sync
from .discrepancy_logging import Log


def show(cfg: Config):
    def show_logs():
        for log in Log.logs():
            print(log)

    def show_discrepancies():
        for discrepancy in cfg.discrepancies:
            print(discrepancy)

    cmds: dict[str, Callable] = {
        'logs': show_logs,
        'discrepancies': show_discrepancies
    }

    for cmd in cmds.keys():
        if cmd in argv:
            cmds[cmd]()
            break
    else:
        print(f'No valid command found, valid are: {cmds.keys()}')


def detect(cfg: Config):
    discrepancies: list[Discrepancy] = cfg.discrepancies

    Log.out(Log(1, 'terminal:detect', 'Detetion started...'))
    new_discrepancies: list[Discrepancy] = detect_all_sync(cfg.wc_students, cfg.database_students, discrepancies)
    Log.out((1, 'terminal:detect', f'Detection finished. {len(new_discrepancies)} new discrepancies.'))
    discrepancies.extend(discrepancies)
    cfg.pgm_state['last_detect'] = datetime.now().isoformat()

    cfg.commit_discrepancies(discrepancies)


def main(cfg: Config):
    cfg.ensure_valid()
    cmds: dict[str, Callable[[Config]], None] = {
        'show': show,
        'detect': detect,
    }

    for cmd in cmds.keys():
        if cmd in argv:
            cmds[cmd](cfg)
            break
    else:
        print(f'No valid command found, valid are: {cmds.keys()}')
    cfg.save()

if __name__ == '__main__':
    main(Config.load_valid())
