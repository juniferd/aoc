import sys
import time
import logging
import runpy
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

LINES = []
GLOBALS = {}

def parse_lines(filepath):
    LINES.clear()

    with open(filepath, "r") as file:
        lines = file.read().split("\n")
        for line in lines:
            LINES.append(line.strip())

def run_puzzle(filepath):
    parse_lines(filepath)
    GLOBALS["LINES"] = LINES
    runpy.run_path(path_name=sys.argv[1], init_globals=GLOBALS, run_name="__main__")

class MyHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        run_puzzle(sys.argv[2])

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s - %(message)s',
                        datefmt='%Y-%m-%d %H:%M:%S')
    path = sys.argv[1] if len(sys.argv) > 1 else '.'
    print(f"path: {sys.argv}")

    run_puzzle(sys.argv[2])
    event_handler = MyHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
