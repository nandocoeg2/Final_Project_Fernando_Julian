/*
  Warnings:

  - You are about to drop the `SubMenu` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[SubMenu] DROP CONSTRAINT [SubMenu_menuId_fkey];

-- DropTable
DROP TABLE [dbo].[SubMenu];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
