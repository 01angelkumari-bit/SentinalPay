from fastapi import FastAPI

app = FastAPI(title="SentinalPay API")

@app.get("/")
def root():
    return {
        "message": "SentinalPay Backend Running"
    }