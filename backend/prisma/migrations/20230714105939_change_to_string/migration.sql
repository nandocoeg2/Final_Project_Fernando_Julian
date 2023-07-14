/*
  Warnings:

  - You are about to drop the column `processByUserId` on the `ReportUpload` table. All the data in the column will be lost.
  - You are about to drop the column `processedTime` on the `ReportUpload` table. All the data in the column will be lost.
  - Added the required column `processedByUser` to the `ReportUpload` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ReportUpload] DROP COLUMN [processByUserId],
[processedTime];
ALTER TABLE [dbo].[ReportUpload] ADD [processedByUser] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
