FROM python:3.14.4

# 1. Set working directory inside container
WORKDIR /app

# 2. Copy dependencies first (for caching speed)
COPY requirements.txt .

# 3. Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy your full project into container
COPY . .

# 5. Open Streamlit port
EXPOSE 8501

# 6. Run Streamlit app
CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]