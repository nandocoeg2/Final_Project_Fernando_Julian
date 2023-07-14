/*
  Warnings:

  - You are about to drop the column `size` on the `ReportUpload` table. All the data in the column will be lost.
  - Added the required column `length` to the `ReportUpload` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ReportUpload] DROP COLUMN [size];
ALTER TABLE [dbo].[ReportUpload] ADD [length] INT NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
