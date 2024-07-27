from os import system, name
from sys import argv
from . import terminal
from . import server
from .config import Config

def cls():
    system('cls' if name == 'nt' else 'clear')

def main():
    if 'serve' in argv:
        server.main(Config.load_valid())
    elif 'terminal' in argv:
        terminal.main(Config.load_valid())
    else:
        print(f'Error: Must specify either `serve` or `terminal`')

if __name__ == '__main__':
    main()
