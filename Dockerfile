FROM grafana/grafana

ADD ./ /var/lib/grafana/plugins/ovh-warp10-datasource
