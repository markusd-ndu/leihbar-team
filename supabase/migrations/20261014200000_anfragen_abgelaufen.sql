-- Vorbereitung für LEI-6: Eine Anfrage darf auch „abgelaufen“ sein.
-- Den täglichen Zeitplan, der unbeantwortete Anfragen darauf setzt, baut LEI-6.
alter table public.requests drop constraint requests_status_check;
alter table public.requests add constraint requests_status_check
  check (status in ('offen', 'angenommen', 'abgelehnt', 'abgelaufen'));
