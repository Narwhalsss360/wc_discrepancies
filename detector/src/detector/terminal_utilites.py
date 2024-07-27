import os

def cls():
    os.system('cls' if os.name == 'nt' else 'clear')

def print_overwrite(line, end=None) -> None:
    print(f'\r{" " * os.get_terminal_size().columns}\r{line}', end=end or '')
