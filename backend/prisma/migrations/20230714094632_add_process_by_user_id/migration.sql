BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ReportUpload] ADD [processByUserId] INT,
[processedTime] DATETIME2;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH