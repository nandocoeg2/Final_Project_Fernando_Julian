/*
  Warnings:

  - The primary key for the `ReportUpload` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[DataUpload] DROP CONSTRAINT [DataUpload_reportUploadId_fkey];

-- AlterTable
ALTER TABLE [dbo].[DataUpload] ALTER COLUMN [reportUploadId] NVARCHAR(1000) NULL;

-- RedefineTables
BEGIN TRANSACTION;
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'ReportUpload'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_ReportUpload] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [size] INT NOT NULL,
    [userId] INT NOT NULL,
    [statusReportId] INT CONSTRAINT [ReportUpload_statusReportId_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ReportUpload_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [ReportUpload_pkey] PRIMARY KEY CLUSTERED ([id])
);
IF EXISTS(SELECT * FROM [dbo].[ReportUpload])
    EXEC('INSERT INTO [dbo].[_prisma_new_ReportUpload] ([createdAt],[id],[name],[size],[statusReportId],[updatedAt],[userId]) SELECT [createdAt],[id],[name],[size],[statusReportId],[updatedAt],[userId] FROM [dbo].[ReportUpload] WITH (holdlock tablockx)');
DROP TABLE [dbo].[ReportUpload];
EXEC SP_RENAME N'dbo._prisma_new_ReportUpload', N'ReportUpload';
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[DataUpload] ADD CONSTRAINT [DataUpload_reportUploadId_fkey] FOREIGN KEY ([reportUploadId]) REFERENCES [dbo].[ReportUpload]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
