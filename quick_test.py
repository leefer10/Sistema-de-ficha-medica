#!/usr/bin/env python
"""Simple test runner for Phase 1 & 2"""
import sys
import os

# Add current dir to path
sys.path.insert(0, os.getcwd())

# Just run the test script directly
exec(open("test_phase2.py").read())
