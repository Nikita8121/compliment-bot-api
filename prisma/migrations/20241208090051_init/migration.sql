-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "telegram_id" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "canCreateCompliments" BOOLEAN NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliment_receipent_profile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "time_zone" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "assignment_id" TEXT NOT NULL,

    CONSTRAINT "compliment_receipent_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliment_assignments" (
    "id" TEXT NOT NULL,
    "compliment_creator_user_id" TEXT NOT NULL,
    "compliment_receipent_user_id" TEXT NOT NULL,

    CONSTRAINT "compliment_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliments_schedule" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "assignment_id" TEXT NOT NULL,

    CONSTRAINT "compliments_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_telegram_id_key" ON "user"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "compliment_receipent_profile_assignment_id_key" ON "compliment_receipent_profile"("assignment_id");

-- CreateIndex
CREATE UNIQUE INDEX "compliments_schedule_assignment_id_time_key" ON "compliments_schedule"("assignment_id", "time");

-- AddForeignKey
ALTER TABLE "compliment_receipent_profile" ADD CONSTRAINT "compliment_receipent_profile_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "compliment_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliment_assignments" ADD CONSTRAINT "compliment_assignments_compliment_creator_user_id_fkey" FOREIGN KEY ("compliment_creator_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliment_assignments" ADD CONSTRAINT "compliment_assignments_compliment_receipent_user_id_fkey" FOREIGN KEY ("compliment_receipent_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliments_schedule" ADD CONSTRAINT "compliments_schedule_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "compliment_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
