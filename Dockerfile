FROM grafana/grafana

ADD ./ /var/lib/grafana/plugins/grafana-warp10
