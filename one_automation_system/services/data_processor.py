#!/usr/bin/env python3
"""
Data Processor Service - Wrapper for src.modules.data_processor
"""

import sys
from pathlib import Path

# Add src to path to import from src/modules/data_processor
src_path = Path(__file__).parent.parent / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from modules.data_processor import DataProcessor as BaseDataProcessor
from typing import List, Dict, Any

class DataProcessor(BaseDataProcessor):
    """Data Processor Service with async support"""

    async def initialize(self):
        """Async initialize data processor"""
        return super().initialize()

    async def analyze(self, data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze data"""
        if not data:
            return {
                "total_records": 0,
                "summary": "No data to analyze"
            }

        try:
            processed_data = self.process_sheet_data(
                [[k for k in data[0].keys()]] +
                [[str(v) for v in row.values()] for row in data]
            ) if data else []

            return {
                "total_records": len(processed_data),
                "fields": list(data[0].keys()) if data else [],
                "summary": f"Analyzed {len(processed_data)} records"
            }
        except Exception as e:
            self.logger.error(f"Analysis error: {e}")
            raise

