FROM alpine:3.19.1

WORKDIR /scripts

COPY scripts/init.sh .

RUN apk add --no-cache dos2unix curl jq \
  && dos2unix ./init.sh \
  && chmod +x ./init.sh

ENTRYPOINT ["./init.sh"]
