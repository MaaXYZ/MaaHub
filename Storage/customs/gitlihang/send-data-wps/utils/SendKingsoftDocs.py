import requests
import json

class SendJinSan:
    """
    发送数据到金山文档
    数据格式：["姓名", "年龄","123"]
    return: 成功返回True，失败返回False
    """
    # ==================== 需要你替换的配置信息 ====================
    # 1. 你的文件ID
    FILE_ID = ""  
    # 2. 你的脚本ID
    SCRIPT_ID = "" 
    # 3. 你的脚本令牌 (APIToken)
    AIRSCRIPT_TOKEN = "" 
    # 4. 目标工作表名
    TARGET_SHEET_NAME = ""   
    # ===========================================================
    # 构建API请求的URL (格式是固定的) [citation:3][citation:5]
    url = f"https://www.kdocs.cn/api/v3/ide/file/{FILE_ID}/script/{SCRIPT_ID}/sync_task"
    @classmethod
    def send(cls, data_to_send: list):
        # 设置请求头 (关键：Content-Type 和 AirScript-Token) [citation:3]
        headers = {
            "Content-Type": "application/json",
            "AirScript-Token": cls.AIRSCRIPT_TOKEN
        }
        # 准备要发送的数据 (必须是一个二维数组)
        # 这里的第一行是表头，后面是数据行。你可以根据自己的需求拼接这个数组。
        # ["姓名", "年龄","123"]  
        

        # 构建请求体 (必须严格按照这个嵌套结构，将数据放在 Context.argv 下) [citation:3][citation:5]
        payload = {
            "Context": {
                "argv": {
                    "sheetName": cls.TARGET_SHEET_NAME,  # 传给AirScript的参数1
                    "rowData": data_to_send           # 传给AirScript的参数2
                }
            }
        }

        # 发送POST请求
        try:
            print("正在向金山文档发送数据...")
            response = requests.post(cls.url, headers=headers, data=json.dumps(payload))
            
            # 检查HTTP状态码
            if response.status_code == 200:
                print("请求发送成功！")
                # 打印金山脚本返回的结果 (就是AirScript里 return 的内容)
                result = response.json()
                print("金山脚本返回信息：", result)
                return True
            else:
                print(f"请求失败，HTTP状态码：{response.status_code}")
                print("错误详情：", response.text)
                return False

        except requests.exceptions.RequestException as e:
            print(f"网络请求发生异常：{e}")
            return False
        except json.JSONDecodeError:
            print("响应内容不是有效的JSON格式：", response.text)
            return False

# if __name__ == "__main__":
#     SendJinSan.send(["姓", "年","13"])
