/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
BEGIN TRY

BEGIN TRAN;

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
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'Product'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_Product] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [category] NVARCHAR(1000) NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [stockQuantity] INT NOT NULL,
    [description] NVARCHAR(1000),
    [status] BIT NOT NULL CONSTRAINT [Product_status_df] DEFAULT 1,
    [createdBy] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Product_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedBy] NVARCHAR(1000),
    [updatedAt] DATETIME2,
    [deletedAt] DATETIME2,
    CONSTRAINT [Product_pkey] PRIMARY KEY CLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_Product] ON;
IF EXISTS(SELECT * FROM [dbo].[Product])
    EXEC('INSERT INTO [dbo].[_prisma_new_Product] ([category],[createdAt],[createdBy],[deletedAt],[description],[id],[name],[price],[status],[stockQuantity],[updatedAt],[updatedBy]) SELECT [category],[createdAt],[createdBy],[deletedAt],[description],[id],[name],[price],[status],[stockQuantity],[updatedAt],[updatedBy] FROM [dbo].[Product] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_Product] OFF;
DROP TABLE [dbo].[Product];
EXEC SP_RENAME N'dbo._prisma_new_Product', N'Product';
COMMIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
