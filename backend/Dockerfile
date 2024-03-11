FROM python:3.12
WORKDIR /home/account
COPY backend/requirements.txt backend/
RUN pip install --upgrade pip
RUN pip install -r backend/requirements.txt
COPY . .
EXPOSE 8000
WORKDIR /home/account/backend/
ENTRYPOINT ["/bin/bash","/home/account/backend/entrypoint.sh"]
