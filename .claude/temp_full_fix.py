# -*- coding: utf-8 -*-
import openpyxl

wb = openpyxl.load_workbook(r'C:\Users\admin\Desktop\高能级\港口数智物流高价值数据目录清单.xlsx')
ws = wb['字段级数据项']

# 收集当前所有F开头的值及行号
current_data = {}
for row in range(2, 900):
    val = ws.cell(row, 1).value
    if val and str(val).startswith('F'):
        f_id = str(val)
        current_data[f_id] = row

print(f"当前有 {len(current_data)} 条数据")
print(f"第一条: {min(current_data.keys(), key=lambda x: int(x[1:]))}, 最后一条: {max(current_data.keys(), key=lambda x: int(x[1:]))}")

# 找出缺失的
all_ids = [f'F{i}' for i in range(1, 752)]
missing_ids = [fid for fid in all_ids if fid not in current_data]
print(f"缺失的字段: {missing_ids[:10]}..." if len(missing_ids) > 10 else f"缺失的字段: {missing_ids}")

# F227-F258 缺失，需要插入
# 找到F226的位置，在其后插入缺失数据
f226_row = current_data.get('F226')
f259_row = current_data.get('F259')

if f226_row and f259_row:
    print(f"F226在行{f226_row}, F259在行{f259_row}")
    print(f"需要在行{f226_row+1}插入{len(missing_ids)}条数据")
