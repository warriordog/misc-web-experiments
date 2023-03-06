# Draggable Windows

Prototype (not production-ready) implementation of HTML windows.
Supports drag, resize, and scroll operations.
Windows are z-sorted and background windows are hidden from screen readers.

Open/close operations are not (currently) implemented, but would be trivial to add.
Scrolling is untested but should work.
Before using, make sure to replace the monkey-patched functions with regular implementations.