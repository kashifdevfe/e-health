-- CreateTable
CREATE TABLE "resource_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail_url" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "resource_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "content" TEXT,
    "duration" INTEGER,
    "video_url" TEXT,
    "audio_url" TEXT,
    "thumbnail_url" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "resource_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "resource_categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

