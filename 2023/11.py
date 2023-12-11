import sys
from pprint import pprint

def answer(lines):
    pprint(lines)
    for line, index in enumerate(lines):
        print(f"{index}: {line}")
        print("----")

if __name__ == "__main__":
    print("running submodule")
    args = sys.argv if len(sys.argv) > 1 else '.'
    answer(globals()["LINES"])
