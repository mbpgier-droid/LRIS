-- =============================================
-- Learning Resources Inventory System - Items Database
-- SQL Server Management Studio (SSMS) Queries
-- For storing Items data (SLM/SLAS, Equipment, TVL, Lesson Exemplar)
-- =============================================

-- Use your existing database (replace with your actual database name)
USE LRIS;
-- OR if you're using the LRIS database:
-- USE LRIS;
GO

-- =============================================
-- CREATE ITEMS TABLES
-- =============================================

-- Create SLM/SLAS Items table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SLMItems]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[SLMItems] (
        [SLMItemID] INT IDENTITY(1,1) PRIMARY KEY,
        [Title] NVARCHAR(200) NOT NULL,
        [Subject] NVARCHAR(100) NOT NULL,
        [GradeLevel] NVARCHAR(20) NOT NULL,
        [Quarter] NVARCHAR(20) NOT NULL,
        [Quantity] INT NOT NULL DEFAULT 1,
        [Status] NVARCHAR(50) NOT NULL DEFAULT 'Available',
        [Description] NVARCHAR(500) NULL,
        [DateAdded] DATETIME DEFAULT GETDATE(),
        [DateModified] DATETIME DEFAULT GETDATE(),
        [IsActive] BIT DEFAULT 1,
        [CreatedBy] NVARCHAR(50) DEFAULT 'Admin',
        [ModifiedBy] NVARCHAR(50) DEFAULT 'Admin'
    );
    PRINT 'SLMItems table created successfully.';
END
ELSE
BEGIN
    PRINT 'SLMItems table already exists.';
END
GO

-- Create Equipment Items table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[EquipmentItems]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[EquipmentItems] (
        [EquipmentID] INT IDENTITY(1,1) PRIMARY KEY,
        [EquipmentName] NVARCHAR(200) NOT NULL,
        [EquipmentType] NVARCHAR(100) NOT NULL,
        [Quantity] INT NOT NULL DEFAULT 1,
        [Status] NVARCHAR(50) NOT NULL DEFAULT 'Available',
        [Description] NVARCHAR(500) NULL,
        [DateAdded] DATETIME DEFAULT GETDATE(),
        [DateModified] DATETIME DEFAULT GETDATE(),
        [IsActive] BIT DEFAULT 1,
        [CreatedBy] NVARCHAR(50) DEFAULT 'Admin',
        [ModifiedBy] NVARCHAR(50) DEFAULT 'Admin'
    );
    PRINT 'EquipmentItems table created successfully.';
END
ELSE
BEGIN
    PRINT 'EquipmentItems table already exists.';
END
GO

-- Create TVL Items table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TVLItems]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TVLItems] (
        [TVLItemID] INT IDENTITY(1,1) PRIMARY KEY,
        [ItemName] NVARCHAR(200) NOT NULL,
        [Track] NVARCHAR(100) NOT NULL,
        [Strand] NVARCHAR(100) NOT NULL,
        [GradeLevel] NVARCHAR(20) NOT NULL,
        [Quantity] INT NOT NULL DEFAULT 1,
        [Status] NVARCHAR(50) NOT NULL DEFAULT 'Available',
        [Description] NVARCHAR(500) NULL,
        [DateAdded] DATETIME DEFAULT GETDATE(),
        [DateModified] DATETIME DEFAULT GETDATE(),
        [IsActive] BIT DEFAULT 1,
        [CreatedBy] NVARCHAR(50) DEFAULT 'Admin',
        [ModifiedBy] NVARCHAR(50) DEFAULT 'Admin'
    );
    PRINT 'TVLItems table created successfully.';
END
ELSE
BEGIN
    PRINT 'TVLItems table already exists.';
END
GO

-- Create Lesson Exemplar Items table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[LessonExemplarItems]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[LessonExemplarItems] (
        [LessonID] INT IDENTITY(1,1) PRIMARY KEY,
        [LessonTitle] NVARCHAR(200) NOT NULL,
        [Subject] NVARCHAR(100) NOT NULL,
        [GradeLevel] NVARCHAR(20) NOT NULL,
        [Quarter] NVARCHAR(20) NOT NULL,
        [Week] INT NOT NULL,
        [Status] NVARCHAR(50) NOT NULL DEFAULT 'Available',
        [Description] NVARCHAR(500) NULL,
        [DateAdded] DATETIME DEFAULT GETDATE(),
        [DateModified] DATETIME DEFAULT GETDATE(),
        [IsActive] BIT DEFAULT 1,
        [CreatedBy] NVARCHAR(50) DEFAULT 'Admin',
        [ModifiedBy] NVARCHAR(50) DEFAULT 'Admin'
    );
    PRINT 'LessonExemplarItems table created successfully.';
END
ELSE
BEGIN
    PRINT 'LessonExemplarItems table already exists.';
END
GO

-- =============================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- =============================================

-- SLM Items indexes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SLMItems_GradeLevel')
BEGIN
    CREATE INDEX IX_SLMItems_GradeLevel ON [dbo].[SLMItems] ([GradeLevel]);
    PRINT 'Index IX_SLMItems_GradeLevel created successfully.';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SLMItems_Subject')
BEGIN
    CREATE INDEX IX_SLMItems_Subject ON [dbo].[SLMItems] ([Subject]);
    PRINT 'Index IX_SLMItems_Subject created successfully.';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_SLMItems_Status')
BEGIN
    CREATE INDEX IX_SLMItems_Status ON [dbo].[SLMItems] ([Status]);
    PRINT 'Index IX_SLMItems_Status created successfully.';
END

-- Equipment Items indexes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_EquipmentItems_Type')
BEGIN
    CREATE INDEX IX_EquipmentItems_Type ON [dbo].[EquipmentItems] ([EquipmentType]);
    PRINT 'Index IX_EquipmentItems_Type created successfully.';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_EquipmentItems_Status')
BEGIN
    CREATE INDEX IX_EquipmentItems_Status ON [dbo].[EquipmentItems] ([Status]);
    PRINT 'Index IX_EquipmentItems_Status created successfully.';
END

-- TVL Items indexes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TVLItems_Track')
BEGIN
    CREATE INDEX IX_TVLItems_Track ON [dbo].[TVLItems] ([Track]);
    PRINT 'Index IX_TVLItems_Track created successfully.';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TVLItems_GradeLevel')
BEGIN
    CREATE INDEX IX_TVLItems_GradeLevel ON [dbo].[TVLItems] ([GradeLevel]);
    PRINT 'Index IX_TVLItems_GradeLevel created successfully.';
END

-- Lesson Exemplar Items indexes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_LessonExemplarItems_Subject')
BEGIN
    CREATE INDEX IX_LessonExemplarItems_Subject ON [dbo].[LessonExemplarItems] ([Subject]);
    PRINT 'Index IX_LessonExemplarItems_Subject created successfully.';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_LessonExemplarItems_GradeLevel')
BEGIN
    CREATE INDEX IX_LessonExemplarItems_GradeLevel ON [dbo].[LessonExemplarItems] ([GradeLevel]);
    PRINT 'Index IX_LessonExemplarItems_GradeLevel created successfully.';
END

GO

-- =============================================
-- STORED PROCEDURES FOR SLM/SLAS ITEMS
-- =============================================

-- Add SLM/SLAS Item
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_AddSLMItem]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_AddSLMItem]
GO

CREATE PROCEDURE [dbo].[sp_AddSLMItem]
    @Title NVARCHAR(200),
    @Subject NVARCHAR(100),
    @GradeLevel NVARCHAR(20),
    @Quarter NVARCHAR(20),
    @Quantity INT = 1,
    @Status NVARCHAR(50) = 'Available',
    @Description NVARCHAR(500) = NULL,
    @CreatedBy NVARCHAR(50) = 'Admin'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        INSERT INTO [dbo].[SLMItems] ([Title], [Subject], [GradeLevel], [Quarter], [Quantity], [Status], [Description], [CreatedBy])
        VALUES (@Title, @Subject, @GradeLevel, @Quarter, @Quantity, @Status, @Description, @CreatedBy);
        
        SELECT SCOPE_IDENTITY() AS SLMItemID;
        PRINT 'SLM/SLAS item added successfully.';
    END TRY
    BEGIN CATCH
        PRINT 'Error adding SLM/SLAS item: ' + ERROR_MESSAGE();
        THROW;
    END CATCH
END
GO

-- Get All SLM/SLAS Items
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_GetAllSLMItems]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_GetAllSLMItems]
GO

CREATE PROCEDURE [dbo].[sp_GetAllSLMItems]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        [SLMItemID],
        [Title],
        [Subject],
        [GradeLevel],
        [Quarter],
        [Quantity],
        [Status],
        [Description],
        [DateAdded],
        [DateModified]
    FROM [dbo].[SLMItems]
    WHERE [IsActive] = 1
    ORDER BY [DateAdded] DESC;
END
GO

-- Update SLM/SLAS Item
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_UpdateSLMItem]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_UpdateSLMItem]
GO

CREATE PROCEDURE [dbo].[sp_UpdateSLMItem]
    @SLMItemID INT,
    @Title NVARCHAR(200),
    @Subject NVARCHAR(100),
    @GradeLevel NVARCHAR(20),
    @Quarter NVARCHAR(20),
    @Quantity INT,
    @Status NVARCHAR(50),
    @Description NVARCHAR(500) = NULL,
    @ModifiedBy NVARCHAR(50) = 'Admin'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        UPDATE [dbo].[SLMItems]
        SET 
            [Title] = @Title,
            [Subject] = @Subject,
            [GradeLevel] = @GradeLevel,
            [Quarter] = @Quarter,
            [Quantity] = @Quantity,
            [Status] = @Status,
            [Description] = @Description,
            [DateModified] = GETDATE(),
            [ModifiedBy] = @ModifiedBy
        WHERE [SLMItemID] = @SLMItemID;
        
        IF @@ROWCOUNT > 0
            PRINT 'SLM/SLAS item updated successfully.';
        ELSE
            PRINT 'SLM/SLAS item not found.';
    END TRY
    BEGIN CATCH
        PRINT 'Error updating SLM/SLAS item: ' + ERROR_MESSAGE();
        THROW;
    END CATCH
END
GO

-- Delete SLM/SLAS Item (Soft Delete)
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_DeleteSLMItem]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_DeleteSLMItem]
GO

CREATE PROCEDURE [dbo].[sp_DeleteSLMItem]
    @SLMItemID INT,
    @ModifiedBy NVARCHAR(50) = 'Admin'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        UPDATE [dbo].[SLMItems]
        SET 
            [IsActive] = 0,
            [DateModified] = GETDATE(),
            [ModifiedBy] = @ModifiedBy
        WHERE [SLMItemID] = @SLMItemID;
        
        IF @@ROWCOUNT > 0
            PRINT 'SLM/SLAS item deleted successfully.';
        ELSE
            PRINT 'SLM/SLAS item not found.';
    END TRY
    BEGIN CATCH
        PRINT 'Error deleting SLM/SLAS item: ' + ERROR_MESSAGE();
        THROW;
    END CATCH
END
GO

-- =============================================
-- STORED PROCEDURES FOR EQUIPMENT ITEMS
-- =============================================

-- Add Equipment Item
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_AddEquipmentItem]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_AddEquipmentItem]
GO

CREATE PROCEDURE [dbo].[sp_AddEquipmentItem]
    @EquipmentName NVARCHAR(200),
    @EquipmentType NVARCHAR(100),
    @Quantity INT = 1,
    @Status NVARCHAR(50) = 'Available',
    @Description NVARCHAR(500) = NULL,
    @CreatedBy NVARCHAR(50) = 'Admin'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        INSERT INTO [dbo].[EquipmentItems] ([EquipmentName], [EquipmentType], [Quantity], [Status], [Description], [CreatedBy])
        VALUES (@EquipmentName, @EquipmentType, @Quantity, @Status, @Description, @CreatedBy);
        
        SELECT SCOPE_IDENTITY() AS EquipmentID;
        PRINT 'Equipment item added successfully.';
    END TRY
    BEGIN CATCH
        PRINT 'Error adding equipment item: ' + ERROR_MESSAGE();
        THROW;
    END CATCH
END
GO

-- Get All Equipment Items
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_GetAllEquipmentItems]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_GetAllEquipmentItems]
GO

CREATE PROCEDURE [dbo].[sp_GetAllEquipmentItems]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        [EquipmentID],
        [EquipmentName],
        [EquipmentType],
        [Quantity],
        [Status],
        [Description],
        [DateAdded],
        [DateModified]
    FROM [dbo].[EquipmentItems]
    WHERE [IsActive] = 1
    ORDER BY [DateAdded] DESC;
END
GO

-- Update Equipment Item
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_UpdateEquipmentItem]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_UpdateEquipmentItem]
GO

CREATE PROCEDURE [dbo].[sp_UpdateEquipmentItem]
    @EquipmentID INT,
    @EquipmentName NVARCHAR(200),
    @EquipmentType NVARCHAR(100),
    @Quantity INT,
    @Status NVARCHAR(50),
    @Description NVARCHAR(500) = NULL,
    @ModifiedBy NVARCHAR(50) = 'Admin'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        UPDATE [dbo].[EquipmentItems]
        SET 
            [EquipmentName] = @EquipmentName,
            [EquipmentType] = @EquipmentType,
            [Quantity] = @Quantity,
            [Status] = @Status,
            [Description] = @Description,
            [DateModified] = GETDATE(),
            [ModifiedBy] = @ModifiedBy
        WHERE [EquipmentID] = @EquipmentID;
        
        IF @@ROWCOUNT > 0
            PRINT 'Equipment item updated successfully.';
        ELSE
            PRINT 'Equipment item not found.';
    END TRY
    BEGIN CATCH
        PRINT 'Error updating equipment item: ' + ERROR_MESSAGE();
        THROW;
    END CATCH
END
GO

-- Delete Equipment Item (Soft Delete)
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_DeleteEquipmentItem]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_DeleteEquipmentItem]
GO

CREATE PROCEDURE [dbo].[sp_DeleteEquipmentItem]
    @EquipmentID INT,
    @ModifiedBy NVARCHAR(50) = 'Admin'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        UPDATE [dbo].[EquipmentItems]
        SET 
            [IsActive] = 0,
            [DateModified] = GETDATE(),
            [ModifiedBy] = @ModifiedBy
        WHERE [EquipmentID] = @EquipmentID;
        
        IF @@ROWCOUNT > 0
            PRINT 'Equipment item deleted successfully.';
        ELSE
            PRINT 'Equipment item not found.';
    END TRY
    BEGIN CATCH
        PRINT 'Error deleting equipment item: ' + ERROR_MESSAGE();
        THROW;
    END CATCH
END
GO

-- =============================================
-- STORED PROCEDURES FOR TVL ITEMS
-- =============================================

-- Add TVL Item
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_AddTVLItem]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_AddTVLItem]
GO

CREATE PROCEDURE [dbo].[sp_AddTVLItem]
    @ItemName NVARCHAR(200),
    @Track NVARCHAR(100),
    @Strand NVARCHAR(100),
    @GradeLevel NVARCHAR(20),
    @Quantity INT = 1,
    @Status NVARCHAR(50) = 'Available',
    @Description NVARCHAR(500) = NULL,
    @CreatedBy NVARCHAR(50) = 'Admin'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        INSERT INTO [dbo].[TVLItems] ([ItemName], [Track], [Strand], [GradeLevel], [Quantity], [Status], [Description], [CreatedBy])
        VALUES (@ItemName, @Track, @Strand, @GradeLevel, @Quantity, @Status, @Description, @CreatedBy);
        
        SELECT SCOPE_IDENTITY() AS TVLItemID;
        PRINT 'TVL item added successfully.';
    END TRY
    BEGIN CATCH
        PRINT 'Error adding TVL item: ' + ERROR_MESSAGE();
        THROW;
    END CATCH
END
GO

-- Get All TVL Items
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_GetAllTVLItems]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_GetAllTVLItems]
GO

CREATE PROCEDURE [dbo].[sp_GetAllTVLItems]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        [TVLItemID],
        [ItemName],
        [Track],
        [Strand],
        [GradeLevel],
        [Quantity],
        [Status],
        [Description],
        [DateAdded],
        [DateModified]
    FROM [dbo].[TVLItems]
    WHERE [IsActive] = 1
    ORDER BY [DateAdded] DESC;
END
GO

-- Update TVL Item
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_UpdateTVLItem]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_UpdateTVLItem]
GO

CREATE PROCEDURE [dbo].[sp_UpdateTVLItem]
    @TVLItemID INT,
    @ItemName NVARCHAR(200),
    @Track NVARCHAR(100),
    @Strand NVARCHAR(100),
    @GradeLevel NVARCHAR(20),
    @Quantity INT,
    @Status NVARCHAR(50),
    @Description NVARCHAR(500) = NULL,
    @ModifiedBy NVARCHAR(50) = 'Admin'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        UPDATE [dbo].[TVLItems]
        SET 
            [ItemName] = @ItemName,
            [Track] = @Track,
            [Strand] = @Strand,
            [GradeLevel] = @GradeLevel,
            [Quantity] = @Quantity,
            [Status] = @Status,
            [Description] = @Description,
            [DateModified] = GETDATE(),
            [ModifiedBy] = @ModifiedBy
        WHERE [TVLItemID] = @TVLItemID;
        
        IF @@ROWCOUNT > 0
            PRINT 'TVL item updated successfully.';
        ELSE
            PRINT 'TVL item not found.';
    END TRY
    BEGIN CATCH
        PRINT 'Error updating TVL item: ' + ERROR_MESSAGE();
        THROW;
    END CATCH
END
GO

-- Delete TVL Item (Soft Delete)
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_DeleteTVLItem]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_DeleteTVLItem]
GO

CREATE PROCEDURE [dbo].[sp_DeleteTVLItem]
    @TVLItemID INT,
    @ModifiedBy NVARCHAR(50) = 'Admin'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        UPDATE [dbo].[TVLItems]
        SET 
            [IsActive] = 0,
            [DateModified] = GETDATE(),
            [ModifiedBy] = @ModifiedBy
        WHERE [TVLItemID] = @TVLItemID;
        
        IF @@ROWCOUNT > 0
            PRINT 'TVL item deleted successfully.';
        ELSE
            PRINT 'TVL item not found.';
    END TRY
    BEGIN CATCH
        PRINT 'Error deleting TVL item: ' + ERROR_MESSAGE();
        THROW;
    END CATCH
END
GO

-- =============================================
-- STORED PROCEDURES FOR LESSON EXEMPLAR ITEMS
-- =============================================

-- Add Lesson Exemplar Item
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_AddLessonExemplarItem]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_AddLessonExemplarItem]
GO

CREATE PROCEDURE [dbo].[sp_AddLessonExemplarItem]
    @LessonTitle NVARCHAR(200),
    @Subject NVARCHAR(100),
    @GradeLevel NVARCHAR(20),
    @Quarter NVARCHAR(20),
    @Week INT,
    @Status NVARCHAR(50) = 'Available',
    @Description NVARCHAR(500) = NULL,
    @CreatedBy NVARCHAR(50) = 'Admin'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        INSERT INTO [dbo].[LessonExemplarItems] ([LessonTitle], [Subject], [GradeLevel], [Quarter], [Week], [Status], [Description], [CreatedBy])
        VALUES (@LessonTitle, @Subject, @GradeLevel, @Quarter, @Week, @Status, @Description, @CreatedBy);
        
        SELECT SCOPE_IDENTITY() AS LessonID;
        PRINT 'Lesson Exemplar item added successfully.';
    END TRY
    BEGIN CATCH
        PRINT 'Error adding Lesson Exemplar item: ' + ERROR_MESSAGE();
        THROW;
    END CATCH
END
GO

-- Get All Lesson Exemplar Items
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_GetAllLessonExemplarItems]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_GetAllLessonExemplarItems]
GO

CREATE PROCEDURE [dbo].[sp_GetAllLessonExemplarItems]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        [LessonID],
        [LessonTitle],
        [Subject],
        [GradeLevel],
        [Quarter],
        [Week],
        [Status],
        [Description],
        [DateAdded],
        [DateModified]
    FROM [dbo].[LessonExemplarItems]
    WHERE [IsActive] = 1
    ORDER BY [DateAdded] DESC;
END
GO

-- Update Lesson Exemplar Item
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_UpdateLessonExemplarItem]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_UpdateLessonExemplarItem]
GO

CREATE PROCEDURE [dbo].[sp_UpdateLessonExemplarItem]
    @LessonID INT,
    @LessonTitle NVARCHAR(200),
    @Subject NVARCHAR(100),
    @GradeLevel NVARCHAR(20),
    @Quarter NVARCHAR(20),
    @Week INT,
    @Status NVARCHAR(50),
    @Description NVARCHAR(500) = NULL,
    @ModifiedBy NVARCHAR(50) = 'Admin'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        UPDATE [dbo].[LessonExemplarItems]
        SET 
            [LessonTitle] = @LessonTitle,
            [Subject] = @Subject,
            [GradeLevel] = @GradeLevel,
            [Quarter] = @Quarter,
            [Week] = @Week,
            [Status] = @Status,
            [Description] = @Description,
            [DateModified] = GETDATE(),
            [ModifiedBy] = @ModifiedBy
        WHERE [LessonID] = @LessonID;
        
        IF @@ROWCOUNT > 0
            PRINT 'Lesson Exemplar item updated successfully.';
        ELSE
            PRINT 'Lesson Exemplar item not found.';
    END TRY
    BEGIN CATCH
        PRINT 'Error updating Lesson Exemplar item: ' + ERROR_MESSAGE();
        THROW;
    END CATCH
END
GO

-- Delete Lesson Exemplar Item (Soft Delete)
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_DeleteLessonExemplarItem]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_DeleteLessonExemplarItem]
GO

CREATE PROCEDURE [dbo].[sp_DeleteLessonExemplarItem]
    @LessonID INT,
    @ModifiedBy NVARCHAR(50) = 'Admin'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        UPDATE [dbo].[LessonExemplarItems]
        SET 
            [IsActive] = 0,
            [DateModified] = GETDATE(),
            [ModifiedBy] = @ModifiedBy
        WHERE [LessonID] = @LessonID;
        
        IF @@ROWCOUNT > 0
            PRINT 'Lesson Exemplar item deleted successfully.';
        ELSE
            PRINT 'Lesson Exemplar item not found.';
    END TRY
    BEGIN CATCH
        PRINT 'Error deleting Lesson Exemplar item: ' + ERROR_MESSAGE();
        THROW;
    END CATCH
END
GO
-- =============================================
-- QUERY EXAMPLES FOR TESTING
-- =============================================

-- View all SLM/SLAS items
-- SELECT * FROM [dbo].[SLMItems] WHERE [IsActive] = 1;

-- View all Equipment items
-- SELECT * FROM [dbo].[EquipmentItems] WHERE [IsActive] = 1;

-- View all TVL items
-- SELECT * FROM [dbo].[TVLItems] WHERE [IsActive] = 1;

-- View all Lesson Exemplar items
-- SELECT * FROM [dbo].[LessonExemplarItems] WHERE [IsActive] = 1;

-- Count total items by category
-- SELECT 'SLM/SLAS' as Category, COUNT(*) as Total FROM [dbo].[SLMItems] WHERE [IsActive] = 1
-- UNION ALL
-- SELECT 'Equipment' as Category, COUNT(*) as Total FROM [dbo].[EquipmentItems] WHERE [IsActive] = 1
-- UNION ALL
-- SELECT 'TVL' as Category, COUNT(*) as Total FROM [dbo].[TVLItems] WHERE [IsActive] = 1
-- UNION ALL
-- SELECT 'Lesson Exemplar' as Category, COUNT(*) as Total FROM [dbo].[LessonExemplarItems] WHERE [IsActive] = 1;

PRINT 'Items database setup completed successfully!';
PRINT 'You can now use the stored procedures to manage your items data.'; 