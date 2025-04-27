FROM golang:1.20

WORKDIR /app

COPY go.mod ./
COPY . ./

RUN go mod download

RUN go build -o main .

EXPOSE 8000

CMD ["./main"]
