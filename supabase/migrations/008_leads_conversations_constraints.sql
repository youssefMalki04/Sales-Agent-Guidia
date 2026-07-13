-- Migration additive complétant le schéma existant de leads et conversations
-- Ajout de la contrainte CHECK manquante sur la colonne 'urgency' de la table 'leads'

alter table public.leads
  add constraint leads_urgency_check
  check (urgency in ('faible', 'moyenne', 'forte'));
