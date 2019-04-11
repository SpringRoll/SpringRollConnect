export default `-- -------------------------------------------------------------
-- TablePlus 2.2(212)
--
-- https://tableplus.com/
--
-- Database: backup
-- Generation Time: 2019-04-05 13:36:35.5400
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."config";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS config_id_seq;

-- Table Definition
CREATE TABLE "public"."config" (
    "id" int4 NOT NULL DEFAULT nextval('config_id_seq'::regclass),
    "devExpireDays" int4 NOT NULL DEFAULT 90,
    "maxDevReleases" int4 NOT NULL DEFAULT 20,
    "embedScriptPlugin" text,
    "embedCssPlugin" text,
    "embedDebugScriptPlugin" text,
    "embedDebugCssPlugin" text,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."game";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."game" (
    "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "title" text NOT NULL,
    "slug" text NOT NULL,
    "repository" text NOT NULL,
    "location" text NOT NULL,
    "isArchived" bool NOT NULL DEFAULT false,
    "bundleId" text NOT NULL DEFAULT uuid_generate_v4(),
    "description" text NOT NULL DEFAULT ''::text,
    "created" timestamptz NOT NULL DEFAULT now(),
    "updated" timestamptz NOT NULL DEFAULT now(),
    "capabilities" jsonb NOT NULL,
    "thumbnail" bytea,
    PRIMARY KEY ("uuid")
);

DROP TABLE IF EXISTS "public"."group";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS group_id_seq;

-- Table Definition
CREATE TABLE "public"."group" (
    "id" int4 NOT NULL DEFAULT nextval('group_id_seq'::regclass),
    "name" text,
    "isUserGroup" bool NOT NULL DEFAULT false,
    "slug" text,
    "token" text,
    "tokenExpires" date,
    "privilege" int2 NOT NULL DEFAULT 0,
    "logo" bytea DEFAULT '\x6e756c6c'::bytea,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."group_permission";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS group_permission_id_seq;

-- Table Definition
CREATE TABLE "public"."group_permission" (
    "id" int4 NOT NULL DEFAULT nextval('group_permission_id_seq'::regclass),
    "permission" int2 NOT NULL DEFAULT 0,
    "groupID" int4 NOT NULL,
    "gameID" uuid NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."release";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS release_id_seq;

-- Table Definition
CREATE TABLE "public"."release" (
    "id" int4 NOT NULL DEFAULT nextval('release_id_seq'::regclass),
    "gameUuid" uuid NOT NULL,
    "version" text,
    "status" text NOT NULL,
    "commitId" text NOT NULL,
    "branch" text,
    "created" timestamptz NOT NULL DEFAULT now(),
    "updated" timestamptz NOT NULL DEFAULT now(),
    "updatedById" int4,
    "notes" text NOT NULL,
    "url" text,
    "debugUncompressedSize" int8 NOT NULL DEFAULT 0,
    "debugCompressedSize" int8 NOT NULL DEFAULT 0,
    "releaseCompressedSize" int8 NOT NULL DEFAULT 0,
    "releaseUncompressedSize" int8 NOT NULL DEFAULT 0,
    "capabilities" jsonb NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."user";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS user_id_seq;

-- Table Definition
CREATE TABLE "public"."user" (
    "id" int4 NOT NULL DEFAULT nextval('user_id_seq'::regclass),
    "username" text NOT NULL,
    "password" text NOT NULL,
    "email" text NOT NULL,
    "active" bool NOT NULL DEFAULT true,
    "name" text NOT NULL,
    "resetPasswordToken" text,
    "resetPasswordExpires" date,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."user_groups";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."user_groups" (
    "userId" int4 NOT NULL,
    "groupId" int4 NOT NULL,
    PRIMARY KEY ("userId","groupId")
);

INSERT INTO "public"."game" ("uuid", "title", "slug", "repository", "location", "isArchived", "bundleId", "description", "created", "updated", "capabilities", "thumbnail") VALUES ('390fb2bc-7b21-4ebf-b1e0-6a56a6727940', 'Empty Game 2', 'empty-game-2', 'https://projects.pbs.org/bitbucket/projects/PKK/repos/empty-game/browse', 'https://springroll-tc.pbskids.org/empty-game', 'f', '108364cf-c3bb-4efc-a5bc-3eff111abc4b', '', '2019-04-02 18:27:44.452743+00', '2019-04-02 18:27:44.452743+00', '{"ui": {"mouse": true, "touch": true}, "sizes": {"large": true, "small": true, "medium": true, "xlarge": true, "xsmall": true}, "features": {"webgl": false, "webaudio": false, "websockets": false, "webworkers": false, "geolocation": false}}', NULL),
('7f394489-1373-455d-954f-4c318012ac63', 'Empty Game', 'empty-game', 'https://projects.pbs.org/bitbucket/projects/PKK/repos/empty-game/', 'https://springroll-tc.pbskids.org/empty-game', 'f', 'a547e908-c19d-4c31-9779-f5e4b9523f56', '', '2019-04-02 17:34:50.871811+00', '2019-04-02 17:34:50.871811+00', '{"ui": {"mouse": true, "touch": true}, "sizes": {"large": true, "small": true, "medium": true, "xlarge": true, "xsmall": true}, "features": {"webgl": false, "webaudio": false, "websockets": false, "webworkers": false, "geolocation": false}}', NULL);

INSERT INTO "public"."group" ("id", "name", "isUserGroup", "slug", "token", "tokenExpires", "privilege", "logo") VALUES ('1', 'reader', 't', 'reader', 'ee42fce2026d46b8b06c1a7169d76256666066c5', NULL, '0', '\x6e756c6c'),
('2', 'editor', 't', 'editor', '2c4f3d3091f66bedfe0a2bc7a177b5bbe7ebe80a', NULL, '1', '\x6e756c6c'),
('3', 'admin', 't', 'admin', '8f1339ed05cc72b6e28155532779dde8a3bfb97f', NULL, '2', '\x6e756c6c'),
('12', 'editors', 'f', 'editors', '4a89861f2ea6084cd464f220b483b5e5bec58087', NULL, '1', '\x6e756c6c'),
('13', 'admins', 'f', 'admins', '0a5053ee6f3b77c66cceb49b5c1f0f34b5c8f5ea', NULL, '2', '\x6e756c6c'),
('14', 'readers', 'f', 'readers', '8ae7aa9e471c7b9d3fdb04f7e80dca5fce59a386', NULL, '0', '\x6e756c6c'),
('15', 'empty', 'f', 'empty', '4df57f8684de985fd803abd0ebdf6909b9319ce1', NULL, '0', '\x6e756c6c');

INSERT INTO "public"."group_permission" ("id", "permission", "groupID", "gameID") VALUES ('1', '2', '3', '7f394489-1373-455d-954f-4c318012ac63'),
('3', '0', '14', '7f394489-1373-455d-954f-4c318012ac63'),
('4', '1', '12', '7f394489-1373-455d-954f-4c318012ac63'),
('5', '2', '13', '7f394489-1373-455d-954f-4c318012ac63'),
('6', '2', '3', '390fb2bc-7b21-4ebf-b1e0-6a56a6727940'),
('7', '2', '13', '390fb2bc-7b21-4ebf-b1e0-6a56a6727940');

INSERT INTO "public"."release" ("id", "gameUuid", "version", "status", "commitId", "branch", "created", "updated", "updatedById", "notes", "url", "debugUncompressedSize", "debugCompressedSize", "releaseCompressedSize", "releaseUncompressedSize", "capabilities") VALUES ('1', '7f394489-1373-455d-954f-4c318012ac63', '', 'dev', '8bdc37ce8a4c1ad7c62cb373b73dbf235e804f8f', NULL, '2019-04-02 18:26:40.576245+00', '2019-04-02 18:26:40.576245+00', '3', '', NULL, '0', '0', '0', '0', '{"ui": {"mouse": true, "touch": true}, "sizes": {"large": true, "small": true, "medium": true, "xlarge": true, "xsmall": true}, "features": {"webgl": true, "webaudio": false, "websockets": false, "webworkers": false, "geolocation": false}}'),
('2', '390fb2bc-7b21-4ebf-b1e0-6a56a6727940', '', 'dev', '1525226d5aebb254acfa100e53f228409e429354', NULL, '2019-04-02 18:27:55.325208+00', '2019-04-02 18:27:55.325208+00', '3', '', NULL, '0', '0', '0', '0', '{"ui": {"mouse": true, "touch": true}, "sizes": {"large": true, "small": true, "medium": true, "xlarge": true, "xsmall": true}, "features": {"webgl": true, "webaudio": false, "websockets": false, "webworkers": false, "geolocation": false}}'),
('3', '7f394489-1373-455d-954f-4c318012ac63', '', 'dev', '1e8955d1d7a3fa77443a3f01f3dd5e1634ad095d', NULL, '2019-04-02 18:26:40.576245+00', '2019-04-02 18:26:40.576245+00', '3', '', NULL, '0', '0', '0', '0', '{"ui": {"mouse": true, "touch": true}, "sizes": {"large": true, "small": true, "medium": true, "xlarge": true, "xsmall": true}, "features": {"webgl": true, "webaudio": false, "websockets": false, "webworkers": false, "geolocation": false}}'),
('4', '7f394489-1373-455d-954f-4c318012ac63', '', 'dev', '8bdbf89b8b4c4856f675e0fc449e857640172ecc', NULL, '2019-04-02 18:26:40.576245+00', '2019-04-02 18:26:40.576245+00', '3', '', NULL, '0', '0', '0', '0', '{"ui": {"mouse": true, "touch": true}, "sizes": {"large": true, "small": true, "medium": true, "xlarge": true, "xsmall": true}, "features": {"webgl": true, "webaudio": false, "websockets": false, "webworkers": false, "geolocation": false}}'),
('5', '7f394489-1373-455d-954f-4c318012ac63', '', 'dev', '719007f351e3d712b294c211833ff2ddaecec148', NULL, '2019-04-02 18:26:40.576245+00', '2019-04-02 18:26:40.576245+00', '3', '', NULL, '0', '0', '0', '0', '{"ui": {"mouse": true, "touch": true}, "sizes": {"large": true, "small": true, "medium": true, "xlarge": true, "xsmall": true}, "features": {"webgl": true, "webaudio": false, "websockets": false, "webworkers": false, "geolocation": false}}'),
('6', '7f394489-1373-455d-954f-4c318012ac63', '', 'dev', 'c8ce20e3623b15ea63542203901d60bb09a0eca3', NULL, '2019-04-02 18:26:40.576245+00', '2019-04-02 18:26:40.576245+00', '3', '', NULL, '0', '0', '0', '0', '{"ui": {"mouse": true, "touch": true}, "sizes": {"large": true, "small": true, "medium": true, "xlarge": true, "xsmall": true}, "features": {"webgl": true, "webaudio": false, "websockets": false, "webworkers": false, "geolocation": false}}'),
('7', '7f394489-1373-455d-954f-4c318012ac63', '', 'dev', '288a415fe7c489e5517d532c5b989d28bb30c14b', NULL, '2019-04-02 18:26:40.576245+00', '2019-04-02 18:26:40.576245+00', '3', '', NULL, '0', '0', '0', '0', '{"ui": {"mouse": true, "touch": true}, "sizes": {"large": true, "small": true, "medium": true, "xlarge": true, "xsmall": true}, "features": {"webgl": true, "webaudio": false, "websockets": false, "webworkers": false, "geolocation": false}}'),
('8', '7f394489-1373-455d-954f-4c318012ac63', '', 'dev', 'ff875c59af8d3e7c79860e6b7a356eae35a5923d', NULL, '2019-04-02 18:26:40.576245+00', '2019-04-02 18:26:40.576245+00', '3', '', NULL, '0', '0', '0', '0', '{"ui": {"mouse": true, "touch": true}, "sizes": {"large": true, "small": true, "medium": true, "xlarge": true, "xsmall": true}, "features": {"webgl": true, "webaudio": false, "websockets": false, "webworkers": false, "geolocation": false}}'),
('9', '7f394489-1373-455d-954f-4c318012ac63', '', 'dev', '5a1effc96e875e2aa58016fb7e7c255cc7a63717', NULL, '2019-04-02 18:26:40.576245+00', '2019-04-02 18:26:40.576245+00', '3', '', NULL, '0', '0', '0', '0', '{"ui": {"mouse": true, "touch": true}, "sizes": {"large": true, "small": true, "medium": true, "xlarge": true, "xsmall": true}, "features": {"webgl": true, "webaudio": false, "websockets": false, "webworkers": false, "geolocation": false}}'),
('10', '7f394489-1373-455d-954f-4c318012ac63', '', 'dev', '21d317ad6ff370f58d1052e07b511fb81f2587fb', NULL, '2019-04-02 18:26:40.576245+00', '2019-04-02 18:26:40.576245+00', '3', '', NULL, '0', '0', '0', '0', '{"ui": {"mouse": true, "touch": true}, "sizes": {"large": true, "small": true, "medium": true, "xlarge": true, "xsmall": true}, "features": {"webgl": true, "webaudio": false, "websockets": false, "webworkers": false, "geolocation": false}}'),
('11', '7f394489-1373-455d-954f-4c318012ac63', '', 'dev', '31963ca8b2c8e3417b9cdc31327413a8e0223648', NULL, '2019-04-02 18:26:40.576245+00', '2019-04-02 18:26:40.576245+00', '3', '', NULL, '0', '0', '0', '0', '{"ui": {"mouse": true, "touch": true}, "sizes": {"large": true, "small": true, "medium": true, "xlarge": true, "xsmall": true}, "features": {"webgl": true, "webaudio": false, "websockets": false, "webworkers": false, "geolocation": false}}'),
('12', '7f394489-1373-455d-954f-4c318012ac63', '', 'dev', '01f445ce6d2dc60f37befb507eb2533ad2cdd3e5', NULL, '2019-04-02 18:26:40.576245+00', '2019-04-02 18:26:40.576245+00', '3', '', NULL, '0', '0', '0', '0', '{"ui": {"mouse": true, "touch": true}, "sizes": {"large": true, "small": true, "medium": true, "xlarge": true, "xsmall": true}, "features": {"webgl": true, "webaudio": false, "websockets": false, "webworkers": false, "geolocation": false}}'),
('13', '7f394489-1373-455d-954f-4c318012ac63', '', 'dev', 'e56a08c0ab77f50781c8818b7276ce7f76145d90', NULL, '2019-04-02 18:26:40.576245+00', '2019-04-02 18:26:40.576245+00', '3', '', NULL, '0', '0', '0', '0', '{"ui": {"mouse": true, "touch": true}, "sizes": {"large": true, "small": true, "medium": true, "xlarge": true, "xsmall": true}, "features": {"webgl": true, "webaudio": false, "websockets": false, "webworkers": false, "geolocation": false}}');


INSERT INTO "public"."user" ("id", "username", "password", "email", "active", "name", "resetPasswordToken", "resetPasswordExpires") VALUES ('1', 'reader', '$2a$10$E5wAlobvf7v6cmXKZPaNR.y9QzIkw7oElCv/q6K8CbLw7gogMmJ0u', 'reader@email.com', 't', 'reader', NULL, NULL),
('2', 'editor', '$2a$10$t3mvtw4pJhX.ZrWsQoOjs.cbIZFId4C10m5XPjMhdEKohwO9QT8Su', 'editor@email.com', 't', 'editor', NULL, NULL),
('3', 'admin', '$2a$10$HnnULi6vyeJauRs9gbxXgeyW8l.A0.z/45FoFuP1IMcr/4FkZSUQK', 'admin@email.com', 't', 'admin', NULL, NULL);

INSERT INTO "public"."user_groups" ("userId", "groupId") VALUES ('1', '1'),
('1', '14'),
('2', '2'),
('2', '12'),
('2', '14'),
('3', '3'),
('3', '12'),
('3', '13'),
('3', '14');

ALTER TABLE "public"."group_permission" ADD FOREIGN KEY ("groupID") REFERENCES "public"."group"("id");
ALTER TABLE "public"."group_permission" ADD FOREIGN KEY ("gameID") REFERENCES "public"."game"("uuid");
ALTER TABLE "public"."release" ADD FOREIGN KEY ("updatedById") REFERENCES "public"."user"("id");
ALTER TABLE "public"."release" ADD FOREIGN KEY ("gameUuid") REFERENCES "public"."game"("uuid");
ALTER TABLE "public"."user_groups" ADD FOREIGN KEY ("groupId") REFERENCES "public"."group"("id");
ALTER TABLE "public"."user_groups" ADD FOREIGN KEY ("userId") REFERENCES "public"."user"("id");
`;
