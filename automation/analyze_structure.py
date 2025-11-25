#!/usr/bin/env python3
"""Analyze automation structure and show issues"""
import os
from pathlib import Path
from collections import defaultdict

def analyze_structure():
    root = Path('.')
    issues = []
    duplicates = defaultdict(list)
    files_by_type = defaultdict(list)

    # Find all Python files
    for py_file in root.rglob('*.py'):
        if 'venv' in str(py_file) or '__pycache__' in str(py_file):
            continue

        rel_path = py_file.relative_to(root)
        name = py_file.name

        # Check for duplicates
        duplicates[name].append(str(rel_path))

        # Categorize
        if 'automation_new' in str(rel_path):
            files_by_type['automation_new'].append(str(rel_path))
        elif 'scripts' in str(rel_path):
            files_by_type['scripts'].append(str(rel_path))
        elif rel_path.parent == root:
            files_by_type['root'].append(str(rel_path))
        else:
            files_by_type['other'].append(str(rel_path))

    print("=" * 60)
    print("📊 AUTOMATION STRUCTURE ANALYSIS")
    print("=" * 60)

    print("\n🔴 ISSUES FOUND:")
    print("-" * 60)

    # Duplicate files
    dup_count = 0
    for name, paths in duplicates.items():
        if len(paths) > 1:
            dup_count += 1
            if dup_count <= 5:  # Show first 5
                print(f"\n⚠️  Duplicate: {name}")
                for p in paths:
                    print(f"   - {p}")

    if dup_count > 5:
        print(f"\n   ... and {dup_count - 5} more duplicates")

    print(f"\n📈 Total duplicate files: {dup_count}")

    # Structure issues
    print("\n📁 STRUCTURE BREAKDOWN:")
    print("-" * 60)
    print(f"Root level files: {len(files_by_type['root'])}")
    print(f"automation_new files: {len(files_by_type['automation_new'])}")
    print(f"scripts files: {len(files_by_type['scripts'])}")
    print(f"Other files: {len(files_by_type['other'])}")

    print("\n📋 ROOT LEVEL FILES:")
    print("-" * 60)
    for f in sorted(files_by_type['root'])[:10]:
        print(f"  - {f}")
    if len(files_by_type['root']) > 10:
        print(f"  ... and {len(files_by_type['root']) - 10} more")

    print("\n💡 RECOMMENDATION:")
    print("-" * 60)
    print("See STRUCTURE_PROPOSAL.md for detailed refactoring plan")
    print("Main issues:")
    print("  1. Too many files at root level")
    print("  2. Duplicate files in automation_new/")
    print("  3. Unclear organization")

if __name__ == '__main__':
    analyze_structure()
    print("Analysis complete")
