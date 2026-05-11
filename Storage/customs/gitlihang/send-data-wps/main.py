from utils import SendJinSan

if __name__ == "__main__":
    data_to_send = {
        "user_id": 123456,
        "user_name": "张三",
        "user_gender": "男"
    }
    SendJinSan.send(data_to_send)