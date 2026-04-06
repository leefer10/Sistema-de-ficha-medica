#!/usr/bin/env python
"""Run the onboarding migration"""
import os
import sys

# Add the current directory to the path
sys.path.insert(0, os.path.dirname(__file__))

# Now import and run the migration
from add_onboarding_columns import add_onboarding_columns_sql

if __name__ == "__main__":
    add_onboarding_columns_sql()
