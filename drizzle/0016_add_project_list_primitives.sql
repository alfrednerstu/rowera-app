-- Add Publication List primitive
INSERT INTO "primitive" ("id", "name", "description", "tags", "created_at", "updated_at")
VALUES (
  gen_random_uuid(),
  'Publication List',
  'Displays a list of all publications in a project. Each project can style this differently.',
  'list,publications,project',
  now(),
  now()
) ON CONFLICT DO NOTHING;

-- Add Packet List primitive
INSERT INTO "primitive" ("id", "name", "description", "tags", "created_at", "updated_at")
VALUES (
  gen_random_uuid(),
  'Packet List',
  'Displays a list of all packets in a project. Each project can style this differently.',
  'list,packets,project',
  now(),
  now()
) ON CONFLICT DO NOTHING;
