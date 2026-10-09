update public.notification_preferences
set enabled_events = enabled_events || '["note-mention"]'::jsonb
where id = 'default'
  and not enabled_events @> '["note-mention"]'::jsonb;
