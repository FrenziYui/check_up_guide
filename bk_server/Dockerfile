
From python:3.11-slim

USER root

# 環境変数
ENV DEBIAN_FRONTEND noninteractive
ENV DEBCONF_NOWARNINGS yes
ENV PORT=8080

COPY . ./

RUN apt-get update && \
    apt-get install -y apt-utils apt-transport-https curl gnupg

RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
RUN curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list

RUN apt-get update

# pyodbc動かすのに必要なライブラリ
RUN ACCEPT_EULA=Y apt-get install -y msodbcsql18
RUN ACCEPT_EULA=Y apt-get install -y mssql-tools
RUN ACCEPT_EULA=Y apt-get install -y unixodbc-dev

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app