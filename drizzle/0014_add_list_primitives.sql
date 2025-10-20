-- Add Post List primitive
INSERT INTO "primitive" ("id", "name", "description", "tags", "created_at", "updated_at")
VALUES (
  gen_random_uuid(),
  'Post List',
  'Displays a list of all posts in a publication. Each publication can style this differently.',
  'list,posts,publication',
  now(),
  now()
) ON CONFLICT DO NOTHING;

-- Add Piece List primitive
INSERT INTO "primitive" ("id", "name", "description", "tags", "created_at", "updated_at")
VALUES (
  gen_random_uuid(),
  'Piece List',
  'Displays a list of all pieces in a packet. Each packet can style this differently.',
  'list,pieces,packet',
  now(),
  now()
) ON CONFLICT DO NOTHING;
